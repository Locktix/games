<?php
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') jsonError('POST requis', 405);

$body = getBody();
$game      = mb_substr(trim((string)($body['game']      ?? '')), 0, 50);
$eventType = mb_substr(trim((string)($body['eventType'] ?? '')), 0, 50);
$payload   = sanitizePayload(is_array($body['payload'] ?? null) ? $body['payload'] : []);
$pagePath  = mb_substr(trim((string)($body['pagePath'] ?? '')), 0, 255);

if (!$game || !$eventType) jsonError('game et eventType requis');

$db = getDb();
$stmt = $db->prepare(
    'INSERT INTO game_events (game, event_type, payload, page_path) VALUES (?, ?, ?, ?)'
);
$stmt->execute([$game, $eventType, json_encode($payload, JSON_UNESCAPED_UNICODE), $pagePath]);

jsonOk(['ok' => true, 'id' => (int)$db->lastInsertId()], 201);
