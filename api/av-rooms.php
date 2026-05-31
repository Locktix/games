<?php
// ActionVerite — salons multijoueur
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$db     = getDb();

// GET /api/av-rooms?code=X — lire un salon
if ($method === 'GET') {
    $code = strtoupper(mb_substr(trim((string)($_GET['code'] ?? '')), 0, 10));
    if (!$code) jsonError('Paramètre code manquant');

    $stmt = $db->prepare('SELECT * FROM av_rooms WHERE code = ?');
    $stmt->execute([$code]);
    $room = $stmt->fetch();
    if (!$room) jsonError('Salon introuvable', 404);

    jsonOk(avRoomRow($room));
}

// POST /api/av-rooms — créer un salon
if ($method === 'POST') {
    $body       = getBody();
    $hostId     = mb_substr(trim((string)($body['hostId']    ?? '')), 0, 30);
    $hostName   = mb_substr(trim((string)($body['hostName']  ?? '')), 0, 50);
    $difficulty = mb_substr(trim((string)($body['difficulty'] ?? 'normal')), 0, 20);
    $players    = is_array($body['players'] ?? null) ? $body['players'] : [];

    if (!$hostName || !$hostId) jsonError('hostId et hostName requis');

    // Générer code unique 6 chars
    $code = null;
    for ($i = 0; $i < 10; $i++) {
        $candidate = generateRoomId(6);
        $check = $db->prepare('SELECT code FROM av_rooms WHERE code = ?');
        $check->execute([$candidate]);
        if (!$check->fetch()) { $code = $candidate; break; }
    }
    if (!$code) jsonError('Impossible de générer un code', 500);

    $stmt = $db->prepare(
        'INSERT INTO av_rooms (code, host_id, host_name, difficulty, players) VALUES (?,?,?,?,?)'
    );
    $stmt->execute([$code, $hostId, $hostName, $difficulty, json_encode($players, JSON_UNESCAPED_UNICODE)]);

    $stmt = $db->prepare('SELECT * FROM av_rooms WHERE code = ?');
    $stmt->execute([$code]);
    jsonOk(avRoomRow($stmt->fetch()), 201);
}

// PATCH /api/av-rooms?code=X — mettre à jour
if ($method === 'PATCH') {
    $code = strtoupper(mb_substr(trim((string)($_GET['code'] ?? '')), 0, 10));
    if (!$code) jsonError('Paramètre code manquant');

    $stmt = $db->prepare('SELECT * FROM av_rooms WHERE code = ?');
    $stmt->execute([$code]);
    $room = $stmt->fetch();
    if (!$room) jsonError('Salon introuvable', 404);

    $body    = getBody();
    $updates = [];
    $params  = [];

    $allowed = [
        'status'       => 'str',
        'difficulty'   => 'str',
        'currentIndex' => 'int',
        'currentType'  => 'str',
        'currentText'  => 'str',
        'players'      => 'json',
        'endVotes'     => 'json',
        'hostId'       => 'str',
        'hostName'     => 'str',
    ];

    foreach ($allowed as $key => $type) {
        if (!array_key_exists($key, $body)) continue;
        $col = strtolower(preg_replace('/([A-Z])/', '_$1', $key));
        $val = $body[$key];
        $updates[] = "$col = ?";
        if ($type === 'json')    $params[] = json_encode($val, JSON_UNESCAPED_UNICODE);
        elseif ($type === 'int') $params[] = (int)$val;
        else                     $params[] = mb_substr((string)$val, 0, 255);
    }

    // Auto-delete empty rooms
    if (array_key_exists('players', $body)) {
        $players = is_array($body['players']) ? $body['players'] : json_decode($body['players'] ?? '[]', true);
        if (empty($players)) {
            $db->prepare('DELETE FROM av_rooms WHERE code = ?')->execute([$code]);
            jsonOk(['ok' => true, 'deleted' => true]);
        }
    }

    if ($updates) {
        $params[] = $code;
        $db->prepare('UPDATE av_rooms SET ' . implode(', ', $updates) . ' WHERE code = ?')
           ->execute($params);
    }

    $stmt = $db->prepare('SELECT * FROM av_rooms WHERE code = ?');
    $stmt->execute([$code]);
    jsonOk(avRoomRow($stmt->fetch()));
}

// DELETE /api/av-rooms?code=X — supprimer
if ($method === 'DELETE') {
    $code = strtoupper(mb_substr(trim((string)($_GET['code'] ?? '')), 0, 10));
    if (!$code) jsonError('Paramètre code manquant');
    $db->prepare('DELETE FROM av_rooms WHERE code = ?')->execute([$code]);
    jsonOk(['ok' => true]);
}

jsonError('Méthode non supportée', 405);

function avRoomRow(array $r): array {
    return [
        'code'         => $r['code'],
        'hostId'       => $r['host_id'],
        'hostName'     => $r['host_name'],
        'mode'         => $r['status'],
        'difficulty'   => $r['difficulty'],
        'currentIndex' => (int)$r['current_index'],
        'currentCardType'  => $r['current_type'],
        'currentCardText'  => $r['current_text'] ?? '',
        'players'      => $r['players'] ? json_decode($r['players'], true) : [],
        'endVotes'     => $r['end_votes'] ? json_decode($r['end_votes'], true) : [],
        'updatedAt'    => $r['updated_at'],
    ];
}
