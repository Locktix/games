<?php
// Shady/API diagnostic — hit once to check DB connectivity + schema.
// DELETE this file once the API is confirmed working in production.
require_once __DIR__ . '/config.php';

$report = ['php' => PHP_VERSION, 'db' => 'unknown', 'tables' => []];

try {
    $db = getDb();
    $report['db'] = 'connected';

    $required = [
        'shady_sessions', 'shady_rooms', 'shady_players', 'shady_game_state',
        'av_rooms', 'game_events', 'scores',
    ];
    $existing = $db->query('SHOW TABLES')->fetchAll(PDO::FETCH_COLUMN);
    foreach ($required as $t) {
        $report['tables'][$t] = in_array($t, $existing, true) ? 'ok' : 'MISSING';
    }
    $report['missing_tables'] = array_keys(array_filter(
        $report['tables'],
        fn ($v) => $v === 'MISSING'
    ));
} catch (Throwable $e) {
    $report['db'] = 'FAILED';
    $report['detail'] = $e->getMessage();
}

jsonOk($report);
