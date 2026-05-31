<?php
// AdminStats — lecture des événements analytics
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') jsonError('GET requis', 405);

$limit = max(50, min(2000, (int)($_GET['limit'] ?? 500)));

$db = getDb();
$stmt = $db->prepare(
    'SELECT game, event_type, payload, page_path, created_at
     FROM game_events
     ORDER BY created_at DESC
     LIMIT ?'
);
$stmt->execute([$limit]);
$events = $stmt->fetchAll();

foreach ($events as &$ev) {
    $ev['payload'] = $ev['payload'] ? json_decode($ev['payload'], true) : null;
}
unset($ev);

jsonOk(['events' => $events, 'total' => count($events)]);
