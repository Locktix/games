<?php
// Shady — état de partie (écritures hôte)
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$roomId = strtoupper(mb_substr(trim((string)($_GET['room'] ?? '')), 0, 10));
$db     = getDb();

if (!$roomId) jsonError('Paramètre room manquant');

function fetchGameState(PDO $db, string $roomId): ?array {
    $stmt = $db->prepare('SELECT * FROM shady_game_state WHERE room_id = ?');
    $stmt->execute([$roomId]);
    $row = $stmt->fetch();
    if (!$row) return null;
    return gameStateRow($row);
}

// GET — lire l'état de partie
if ($method === 'GET') {
    $state = fetchGameState($db, $roomId);
    jsonOk(['game' => $state]);
}

// POST — démarrer une partie (hôte)
if ($method === 'POST') {
    $session = requireSession();

    $roomStmt = $db->prepare('SELECT * FROM shady_rooms WHERE id = ?');
    $roomStmt->execute([$roomId]);
    $room = $roomStmt->fetch();
    if (!$room) jsonError('Salon introuvable', 404);
    if ($room['host_token'] !== $session['token']) jsonError('Seul l\'hôte peut démarrer', 403);

    $body = getBody();
    $pair      = $body['pair']      ?? null;
    $players   = $body['players']   ?? [];  // [{token, role, word}]

    if (!$pair || !is_array($players) || count($players) < 3) {
        jsonError('pair et players (min 3) requis');
    }

    // Mettre à jour les joueurs
    $updatePlayer = $db->prepare(
        'UPDATE shady_players SET role=?, word=?, alive=1 WHERE room_id=? AND token=?'
    );
    foreach ($players as $p) {
        $updatePlayer->execute([$p['role'], $p['word'], $roomId, $p['token']]);
    }

    // Créer/réinitialiser l'état de partie
    $stmt = $db->prepare(
        'INSERT INTO shady_game_state
         (room_id, phase, round_num, phase_started_at, phase_dur_sec, votes, eliminated, pair, winner, mr_white_guess)
         VALUES (?,?,1,NOW(),0,?,?,?,NULL,NULL)
         ON DUPLICATE KEY UPDATE
           phase=\'distribution\', round_num=1, phase_started_at=NOW(), phase_dur_sec=0,
           votes=?, eliminated=?, pair=?, winner=NULL, mr_white_guess=NULL'
    );
    $emptyJson = json_encode(new stdClass(), JSON_FORCE_OBJECT);
    $emptyArr  = '[]';
    $pairJson  = json_encode($pair, JSON_UNESCAPED_UNICODE);
    $stmt->execute([$roomId, 'distribution', $emptyJson, $emptyArr, $pairJson, $emptyJson, $emptyArr, $pairJson]);

    // Mettre à jour le salon
    $db->prepare("UPDATE shady_rooms SET status='playing', phase='distribution', round_num=1, winner=NULL, pair=? WHERE id=?")
       ->execute([$pairJson, $roomId]);

    jsonOk(['game' => fetchGameState($db, $roomId)]);
}

// PATCH — mettre à jour l'état de partie (hôte)
if ($method === 'PATCH') {
    $session = requireSession();

    $roomStmt = $db->prepare('SELECT host_token FROM shady_rooms WHERE id = ?');
    $roomStmt->execute([$roomId]);
    $room = $roomStmt->fetch();
    if (!$room) jsonError('Salon introuvable', 404);
    if ($room['host_token'] !== $session['token']) jsonError('Seul l\'hôte peut modifier l\'état', 403);

    $body    = getBody();
    $updates = [];
    $params  = [];

    $fields = [
        'phase'         => ['type' => 'str'],
        'roundNum'      => ['col' => 'round_num', 'type' => 'int'],
        'phaseDurSec'   => ['col' => 'phase_dur_sec', 'type' => 'int'],
        'votes'         => ['type' => 'json'],
        'eliminated'    => ['type' => 'json'],
        'winner'        => ['type' => 'str'],
        'mrWhiteGuess'  => ['col' => 'mr_white_guess', 'type' => 'str'],
        'pair'          => ['type' => 'json'],
    ];

    foreach ($fields as $bodyKey => $meta) {
        if (!array_key_exists($bodyKey, $body)) continue;
        $col  = $meta['col'] ?? strtolower(preg_replace('/([A-Z])/', '_$1', $bodyKey));
        $val  = $body[$bodyKey];
        $type = $meta['type'];

        $updates[] = "$col = ?";
        if ($type === 'json')    $params[] = is_array($val) || is_object($val) ? json_encode($val, JSON_UNESCAPED_UNICODE) : $val;
        elseif ($type === 'int') $params[] = (int)$val;
        else                     $params[] = $val;
    }

    // Réinitialiser le timer si phase change
    if (array_key_exists('phase', $body)) {
        $updates[] = 'phase_started_at = NOW()';
    }

    if ($updates) {
        $params[] = $roomId;
        $db->prepare('UPDATE shady_game_state SET ' . implode(', ', $updates) . ' WHERE room_id = ?')
           ->execute($params);

        // Sync phase + round_num sur le salon aussi
        $syncUpdates = [];
        $syncParams  = [];
        if (array_key_exists('phase', $body))    { $syncUpdates[] = 'phase = ?';     $syncParams[] = $body['phase']; }
        if (array_key_exists('roundNum', $body)) { $syncUpdates[] = 'round_num = ?'; $syncParams[] = (int)$body['roundNum']; }
        if (array_key_exists('winner', $body))   { $syncUpdates[] = 'winner = ?';    $syncParams[] = $body['winner']; }
        if (array_key_exists('winner', $body) && $body['winner'] !== null) {
            $syncUpdates[] = "status = 'finished'";
        }
        if ($syncUpdates) {
            $syncParams[] = $roomId;
            $db->prepare('UPDATE shady_rooms SET ' . implode(', ', $syncUpdates) . ' WHERE id = ?')
               ->execute($syncParams);
        }
    }

    jsonOk(['game' => fetchGameState($db, $roomId)]);
}

// PUT — soumettre un vote (joueur)
// Body: { targetToken: "..." }
if ($method === 'PUT') {
    $session = requireSession();
    $body    = getBody();
    $target  = mb_substr(trim((string)($body['targetToken'] ?? '')), 0, 64);
    if (!$target) jsonError('targetToken requis');

    // Lire les votes actuels
    $stmt = $db->prepare('SELECT votes, phase FROM shady_game_state WHERE room_id = ?');
    $stmt->execute([$roomId]);
    $state = $stmt->fetch();
    if (!$state) jsonError('Partie non démarrée', 404);
    if ($state['phase'] !== 'vote') jsonError('Phase de vote non active');

    $votes = json_decode($state['votes'] ?? '{}', true) ?: [];
    $votes[$session['token']] = $target;

    $db->prepare('UPDATE shady_game_state SET votes = ? WHERE room_id = ?')
       ->execute([json_encode($votes, JSON_UNESCAPED_UNICODE), $roomId]);

    jsonOk(['ok' => true, 'votes' => $votes]);
}

// DELETE — fermer la partie (hôte)
if ($method === 'DELETE') {
    $session = requireSession();
    $roomStmt = $db->prepare('SELECT host_token FROM shady_rooms WHERE id = ?');
    $roomStmt->execute([$roomId]);
    $room = $roomStmt->fetch();
    if (!$room) jsonError('Salon introuvable', 404);
    if ($room['host_token'] !== $session['token']) jsonError('Seul l\'hôte peut fermer la partie', 403);

    $db->prepare("UPDATE shady_rooms SET status='closed', phase='end' WHERE id=?")->execute([$roomId]);
    jsonOk(['ok' => true]);
}

jsonError('Méthode non supportée', 405);

function gameStateRow(array $r): array {
    return [
        'roomId'         => $r['room_id'],
        'phase'          => $r['phase'],
        'roundNum'       => (int)$r['round_num'],
        'phaseStartedAt' => $r['phase_started_at'],
        'phaseDurSec'    => (int)$r['phase_dur_sec'],
        'votes'          => json_decode($r['votes'] ?? '{}', true) ?: [],
        'eliminated'     => json_decode($r['eliminated'] ?? '[]', true) ?: [],
        'pair'           => $r['pair'] ? json_decode($r['pair'], true) : null,
        'winner'         => $r['winner'],
        'mrWhiteGuess'   => $r['mr_white_guess'],
        'updatedAt'      => $r['updated_at'],
    ];
}
