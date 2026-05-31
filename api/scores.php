<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$game   = mb_substr(trim((string)($_GET['game'] ?? '')), 0, 50);

if (!$game) jsonError('Paramètre game manquant');

$db = getDb();

// GET — top 10 scores
if ($method === 'GET') {
    $limit = min(20, max(1, (int)($_GET['limit'] ?? 10)));
    $stmt = $db->prepare(
        'SELECT player_name, score, extra, created_at
         FROM scores
         WHERE game = ?
         ORDER BY score DESC
         LIMIT ?'
    );
    $stmt->execute([$game, $limit]);
    $rows = $stmt->fetchAll();

    foreach ($rows as &$row) {
        $row['score'] = (int)$row['score'];
        $row['extra'] = $row['extra'] ? json_decode($row['extra'], true) : null;
    }
    unset($row);

    jsonOk(['scores' => $rows]);
}

// POST — save score
if ($method === 'POST') {
    $body  = getBody();
    $name  = mb_substr(trim((string)($body['playerName'] ?? 'Anonyme')), 0, 100);
    $score = (int)($body['score'] ?? 0);
    $extra = sanitizePayload(is_array($body['extra'] ?? null) ? $body['extra'] : []);

    if ($score <= 0) jsonError('Score invalide');

    $stmt = $db->prepare(
        'INSERT INTO scores (game, player_name, score, extra) VALUES (?, ?, ?, ?)'
    );
    $stmt->execute([$game, $name ?: 'Anonyme', $score, json_encode($extra, JSON_UNESCAPED_UNICODE)]);

    jsonOk(['ok' => true, 'id' => (int)$db->lastInsertId()], 201);
}

jsonError('Méthode non supportée', 405);
