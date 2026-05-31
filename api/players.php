<?php
// Shady — joueurs dans un salon
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$roomId = strtoupper(mb_substr(trim((string)($_GET['room'] ?? '')), 0, 10));
$db     = getDb();

if (!$roomId) jsonError('Paramètre room manquant');

// GET — liste des joueurs
if ($method === 'GET') {
    $stmt = $db->prepare('SELECT * FROM shady_players WHERE room_id = ? ORDER BY joined_at ASC');
    $stmt->execute([$roomId]);
    jsonOk(['players' => array_map('playerRow', $stmt->fetchAll())]);
}

// POST — rejoindre le salon
if ($method === 'POST') {
    $session = requireSession();

    // Vérifier que le salon existe et n'est pas plein
    $roomStmt = $db->prepare('SELECT * FROM shady_rooms WHERE id = ?');
    $roomStmt->execute([$roomId]);
    $room = $roomStmt->fetch();

    if (!$room) jsonError('Salon introuvable', 404);
    if ($room['status'] === 'finished' || $room['status'] === 'closed') {
        jsonError('Cette partie est terminée');
    }

    // Déjà dans le salon ?
    $existStmt = $db->prepare('SELECT token FROM shady_players WHERE room_id = ? AND token = ?');
    $existStmt->execute([$roomId, $session['token']]);
    if (!$existStmt->fetch()) {
        // Vérifier capacité
        $countStmt = $db->prepare('SELECT COUNT(*) AS cnt FROM shady_players WHERE room_id = ?');
        $countStmt->execute([$roomId]);
        $count = (int)$countStmt->fetch()['cnt'];
        if ($count >= (int)$room['max_players']) jsonError('Salon complet');

        $db->prepare(
            'INSERT INTO shady_players (room_id, token, display_name, icon) VALUES (?,?,?,?)'
        )->execute([$roomId, $session['token'], $session['display_name'], $session['icon']]);
    }

    $stmt = $db->prepare('SELECT * FROM shady_players WHERE room_id = ? ORDER BY joined_at ASC');
    $stmt->execute([$roomId]);
    jsonOk(['players' => array_map('playerRow', $stmt->fetchAll())], 201);
}

// PATCH — mettre à jour un joueur (hôte uniquement pour role/word/alive)
if ($method === 'PATCH') {
    $session = requireSession();
    $body    = getBody();

    // Qui modifie quoi ?
    $targetToken = mb_substr(trim((string)($body['token'] ?? '')), 0, 64);
    if (!$targetToken) $targetToken = $session['token'];

    $playerStmt = $db->prepare('SELECT * FROM shady_players WHERE room_id = ? AND token = ?');
    $playerStmt->execute([$roomId, $targetToken]);
    $player = $playerStmt->fetch();
    if (!$player) jsonError('Joueur introuvable dans ce salon', 404);

    $roomStmt = $db->prepare('SELECT host_token FROM shady_rooms WHERE id = ?');
    $roomStmt->execute([$roomId]);
    $room = $roomStmt->fetch();

    $isHost = $room && $room['host_token'] === $session['token'];
    $isSelf = $targetToken === $session['token'];

    $updates = [];
    $params  = [];

    if ($isHost) {
        if (array_key_exists('role', $body)) { $updates[] = 'role = ?'; $params[] = $body['role']; }
        if (array_key_exists('word', $body)) { $updates[] = 'word = ?'; $params[] = $body['word']; }
        if (array_key_exists('alive', $body)) { $updates[] = 'alive = ?'; $params[] = (int)(bool)$body['alive']; }
    }

    if ($isSelf) {
        if (array_key_exists('displayName', $body)) {
            $updates[] = 'display_name = ?';
            $params[]  = mb_substr(trim((string)$body['displayName']), 0, 18);
        }
        if (array_key_exists('icon', $body)) {
            $updates[] = 'icon = ?';
            $params[]  = mb_substr(trim((string)$body['icon']), 0, 10);
        }
    }

    if ($updates) {
        $params[] = $roomId;
        $params[] = $targetToken;
        $db->prepare('UPDATE shady_players SET ' . implode(', ', $updates) . ' WHERE room_id = ? AND token = ?')
           ->execute($params);
    }

    $stmt = $db->prepare('SELECT * FROM shady_players WHERE room_id = ? ORDER BY joined_at ASC');
    $stmt->execute([$roomId]);
    jsonOk(['players' => array_map('playerRow', $stmt->fetchAll())]);
}

// DELETE — quitter le salon
if ($method === 'DELETE') {
    $session = requireSession();

    $db->prepare('DELETE FROM shady_players WHERE room_id = ? AND token = ?')
       ->execute([$roomId, $session['token']]);

    // Si plus de joueurs → supprimer le salon
    $countStmt = $db->prepare('SELECT COUNT(*) AS cnt FROM shady_players WHERE room_id = ?');
    $countStmt->execute([$roomId]);
    $remaining = (int)$countStmt->fetch()['cnt'];

    if ($remaining === 0) {
        $db->prepare('DELETE FROM shady_rooms WHERE id = ?')->execute([$roomId]);
        jsonOk(['ok' => true, 'roomDeleted' => true]);
    }

    // Transférer le host si nécessaire
    $roomStmt = $db->prepare('SELECT * FROM shady_rooms WHERE id = ?');
    $roomStmt->execute([$roomId]);
    $room = $roomStmt->fetch();

    if ($room && $room['host_token'] === $session['token']) {
        $nextStmt = $db->prepare('SELECT token, display_name, icon FROM shady_players WHERE room_id = ? ORDER BY joined_at ASC LIMIT 1');
        $nextStmt->execute([$roomId]);
        $next = $nextStmt->fetch();
        if ($next) {
            $db->prepare('UPDATE shady_rooms SET host_token=?, host_name=?, host_icon=? WHERE id=?')
               ->execute([$next['token'], $next['display_name'], $next['icon'], $roomId]);
        }
    }

    jsonOk(['ok' => true, 'roomDeleted' => false]);
}

jsonError('Méthode non supportée', 405);

function playerRow(array $p): array {
    return [
        'token'       => $p['token'],
        'displayName' => $p['display_name'],
        'icon'        => $p['icon'],
        'alive'       => (bool)$p['alive'],
        'role'        => $p['role'],
        'word'        => $p['word'],
        'joinedAt'    => $p['joined_at'],
    ];
}
