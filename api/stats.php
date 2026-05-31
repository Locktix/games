<?php
// TuPrefere — vote stats per dilemme
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = getDb();

// GET — fetch counts for a dilemma
if ($method === 'GET') {
    $dilemmaId = mb_substr(trim((string)($_GET['dilemma'] ?? '')), 0, 60);
    if (!$dilemmaId) jsonError('Paramètre dilemma manquant');

    $stmt = $db->prepare(
        'SELECT choice, vote_count FROM tuprefere_votes WHERE dilemma_id = ?'
    );
    $stmt->execute([$dilemmaId]);
    $rows = $stmt->fetchAll();

    $counts = ['A' => 0, 'B' => 0];
    foreach ($rows as $row) {
        $counts[$row['choice']] = (int)$row['vote_count'];
    }

    jsonOk(['dilemma' => $dilemmaId, 'counts' => $counts]);
}

// POST — record a vote
if ($method === 'POST') {
    $body      = getBody();
    $dilemmaId = mb_substr(trim((string)($body['dilemmaId'] ?? '')), 0, 60);
    $choice    = strtoupper(mb_substr(trim((string)($body['choice'] ?? '')), 0, 1));

    if (!$dilemmaId || !in_array($choice, ['A', 'B'], true)) {
        jsonError('Paramètres invalides: dilemmaId et choice (A|B) requis');
    }

    $stmt = $db->prepare(
        'INSERT INTO tuprefere_votes (dilemma_id, choice, vote_count)
         VALUES (?, ?, 1)
         ON DUPLICATE KEY UPDATE vote_count = vote_count + 1'
    );
    $stmt->execute([$dilemmaId, $choice]);

    // Return updated counts for this dilemma
    $stmt = $db->prepare(
        'SELECT choice, vote_count FROM tuprefere_votes WHERE dilemma_id = ?'
    );
    $stmt->execute([$dilemmaId]);
    $rows = $stmt->fetchAll();

    $counts = ['A' => 0, 'B' => 0];
    foreach ($rows as $row) {
        $counts[$row['choice']] = (int)$row['vote_count'];
    }

    jsonOk(['ok' => true, 'counts' => $counts]);
}

jsonError('Méthode non supportée', 405);
