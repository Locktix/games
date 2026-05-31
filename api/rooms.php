<?php
// Shady — salons (CRUD)
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$db     = getDb();

// GET /api/rooms — liste des salons publics actifs
if ($method === 'GET') {
    $stmt = $db->prepare(
        "SELECT r.id, r.name, r.host_name, r.host_icon,
                r.max_players, r.discussion_dur, r.vote_dur, r.max_rounds,
                r.mr_white, r.anonymous_vote, r.status, r.phase,
                r.round_num, r.winner, r.public_room, r.created_at,
                COUNT(p.token) AS player_count
         FROM shady_rooms r
         LEFT JOIN shady_players p ON p.room_id = r.id
         WHERE r.status IN ('waiting','playing') AND r.public_room = 1
         GROUP BY r.id
         ORDER BY r.created_at ASC"
    );
    $stmt->execute();
    $rooms = $stmt->fetchAll();

    // Auto-delete stale empty waiting rooms (> 2min old, 0 players)
    foreach ($rooms as $room) {
        if (
            $room['status'] === 'waiting' &&
            (int)$room['player_count'] === 0 &&
            strtotime($room['created_at']) < time() - 120
        ) {
            $db->prepare('DELETE FROM shady_rooms WHERE id = ?')->execute([$room['id']]);
        }
    }

    $rooms = array_filter($rooms, fn($r) =>
        (int)$r['player_count'] > 0 ||
        $r['status'] === 'playing' ||
        strtotime($r['created_at']) >= time() - 120
    );

    jsonOk(['rooms' => array_values(array_map('roomRow', $rooms))]);
}

// POST /api/rooms — créer un salon
if ($method === 'POST') {
    $session = requireSession();
    $body    = getBody();

    $name            = mb_substr(trim((string)($body['name']           ?? '')), 0, 30);
    $maxPlayers      = max(3, min(15, (int)($body['maxPlayers']      ?? 6)));
    $discussionDur   = max(0, min(300, (int)($body['discussionDur']  ?? 60)));
    $voteDur         = max(0, min(180, (int)($body['voteDur']        ?? 45)));
    $maxRounds       = max(2, min(12, (int)($body['maxRounds']       ?? 6)));
    $mrWhite         = (int)(bool)($body['mrWhite']       ?? true);
    $anonymousVote   = (int)(bool)($body['anonymousVote'] ?? true);

    if (!$name) jsonError('Nom de salon requis');

    // Generate unique room ID
    $roomId = null;
    for ($attempt = 0; $attempt < 10; $attempt++) {
        $candidate = generateRoomId(6);
        $check = $db->prepare('SELECT id FROM shady_rooms WHERE id = ?');
        $check->execute([$candidate]);
        if (!$check->fetch()) { $roomId = $candidate; break; }
    }
    if (!$roomId) jsonError('Impossible de générer un ID de salon', 500);

    $stmt = $db->prepare(
        'INSERT INTO shady_rooms
         (id, name, host_token, host_name, host_icon, max_players,
          discussion_dur, vote_dur, max_rounds, mr_white, anonymous_vote)
         VALUES (?,?,?,?,?,?,?,?,?,?,?)'
    );
    $stmt->execute([
        $roomId,
        $name,
        $session['token'],
        $session['display_name'],
        $session['icon'],
        $maxPlayers,
        $discussionDur,
        $voteDur,
        $maxRounds,
        $mrWhite,
        $anonymousVote,
    ]);

    // Add host as first player
    $db->prepare(
        'INSERT INTO shady_players (room_id, token, display_name, icon) VALUES (?,?,?,?)'
    )->execute([$roomId, $session['token'], $session['display_name'], $session['icon']]);

    $stmt = $db->prepare(
        "SELECT r.*, COUNT(p.token) AS player_count
         FROM shady_rooms r
         LEFT JOIN shady_players p ON p.room_id = r.id
         WHERE r.id = ?
         GROUP BY r.id"
    );
    $stmt->execute([$roomId]);
    jsonOk(roomRow($stmt->fetch()), 201);
}

// ─── single-room actions ───────────────────────────────────────────────
$roomId = $_GET['id'] ?? null;
if (!$roomId) jsonError('ID salon manquant');

$roomId = strtoupper(mb_substr(trim((string)$roomId), 0, 10));

function fetchRoom(PDO $db, string $id): array {
    $stmt = $db->prepare(
        "SELECT r.*, COUNT(p.token) AS player_count
         FROM shady_rooms r
         LEFT JOIN shady_players p ON p.room_id = r.id
         WHERE r.id = ?
         GROUP BY r.id"
    );
    $stmt->execute([$id]);
    $room = $stmt->fetch();
    if (!$room) jsonError('Salon introuvable', 404);
    return $room;
}

// DELETE /api/rooms?id=X — fermer/supprimer salon
if ($method === 'DELETE') {
    $session = requireSession();
    $room    = fetchRoom($db, $roomId);

    if ($room['host_token'] !== $session['token']) jsonError('Seul l\'hôte peut fermer ce salon', 403);

    $db->prepare('DELETE FROM shady_rooms WHERE id = ?')->execute([$roomId]);
    jsonOk(['ok' => true]);
}

// PATCH /api/rooms?id=X — mettre à jour état du salon (hôte)
if ($method === 'PATCH') {
    $session = requireSession();
    $room    = fetchRoom($db, $roomId);
    $body    = getBody();

    if ($room['host_token'] !== $session['token']) jsonError('Seul l\'hôte peut modifier ce salon', 403);

    $allowed = ['status','phase','round_num','winner','pair','public_room'];
    $updates = [];
    $params  = [];

    foreach ($allowed as $field) {
        $bodyKey = lcfirst(str_replace('_', '', ucwords($field, '_')));
        if (!array_key_exists($bodyKey, $body) && !array_key_exists($field, $body)) continue;
        $val = $body[$bodyKey] ?? $body[$field];
        if (in_array($field, ['pair'], true)) {
            $updates[] = "$field = ?";
            $params[]  = is_array($val) ? json_encode($val, JSON_UNESCAPED_UNICODE) : $val;
        } else {
            $updates[] = "$field = ?";
            $params[]  = $val;
        }
    }

    if ($updates) {
        $params[] = $roomId;
        $db->prepare('UPDATE shady_rooms SET ' . implode(', ', $updates) . ' WHERE id = ?')
           ->execute($params);
    }

    jsonOk(roomRow(fetchRoom($db, $roomId)));
}

jsonError('Méthode non supportée', 405);

function roomRow(array $r): array {
    return [
        'id'            => $r['id'],
        'name'          => $r['name'],
        'hostToken'     => $r['host_token'],
        'hostName'      => $r['host_name'],
        'hostIcon'      => $r['host_icon'],
        'maxPlayers'    => (int)$r['max_players'],
        'discussionDur' => (int)$r['discussion_dur'],
        'voteDur'       => (int)$r['vote_dur'],
        'maxRounds'     => (int)$r['max_rounds'],
        'mrWhite'       => (bool)$r['mr_white'],
        'anonymousVote' => (bool)$r['anonymous_vote'],
        'status'        => $r['status'],
        'phase'         => $r['phase'],
        'roundNum'      => (int)$r['round_num'],
        'winner'        => $r['winner'],
        'pair'          => $r['pair'] ? json_decode($r['pair'], true) : null,
        'publicRoom'    => (bool)$r['public_room'],
        'playerCount'   => (int)($r['player_count'] ?? 0),
        'createdAt'     => $r['created_at'],
        'updatedAt'     => $r['updated_at'],
    ];
}
