<?php
// Shady — gestion sessions anonymes (remplace Firebase Auth)
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = getDb();

// POST /api/session — créer une session (ou retourner l'existante si token valide)
if ($method === 'POST') {
    $body = getBody();
    $existingToken = getBearerToken();

    // Si token fourni, vérifier si session existe encore
    if ($existingToken) {
        $stmt = $db->prepare('SELECT * FROM shady_sessions WHERE token = ?');
        $stmt->execute([$existingToken]);
        $session = $stmt->fetch();

        if ($session) {
            $db->prepare('UPDATE shady_sessions SET last_seen = NOW() WHERE token = ?')
               ->execute([$existingToken]);
            jsonOk(sessionToPublic($session));
        }
        // token invalide → créer une nouvelle session
    }

    // Créer session
    $displayName = mb_substr(trim((string)($body['displayName'] ?? '')), 0, 18);
    if (!$displayName) jsonError('displayName requis');

    $icon  = mb_substr(trim((string)($body['icon'] ?? '🕵️')), 0, 10);
    $token = bin2hex(random_bytes(32));

    $stmt = $db->prepare(
        'INSERT INTO shady_sessions (token, display_name, icon, achievements)
         VALUES (?, ?, ?, ?)'
    );
    $achievements = json_encode(new stdClass(), JSON_FORCE_OBJECT);
    $stmt->execute([$token, $displayName, $icon, $achievements]);

    $stmt = $db->prepare('SELECT * FROM shady_sessions WHERE token = ?');
    $stmt->execute([$token]);
    $session = $stmt->fetch();

    jsonOk(sessionToPublic($session), 201);
}

// GET /api/session — récupérer la session courante
if ($method === 'GET') {
    $session = requireSession();
    jsonOk(sessionToPublic($session));
}

// PUT /api/session — mettre à jour profil
if ($method === 'PUT') {
    $session = requireSession();
    $body = getBody();

    $updates = [];
    $params  = [];

    if (isset($body['displayName'])) {
        $updates[] = 'display_name = ?';
        $params[]  = mb_substr(trim((string)$body['displayName']), 0, 18);
    }
    if (isset($body['icon'])) {
        $updates[] = 'icon = ?';
        $params[]  = mb_substr(trim((string)$body['icon']), 0, 10);
    }
    if (isset($body['achievements'])) {
        $updates[] = 'achievements = ?';
        $params[]  = json_encode($body['achievements'], JSON_UNESCAPED_UNICODE);
    }
    if (isset($body['gamesPlayed'])) {
        $updates[] = 'games_played = ?';
        $params[]  = max(0, (int)$body['gamesPlayed']);
    }

    if ($updates) {
        $params[] = $session['token'];
        $db->prepare(
            'UPDATE shady_sessions SET ' . implode(', ', $updates) . ' WHERE token = ?'
        )->execute($params);
    }

    $stmt = $db->prepare('SELECT * FROM shady_sessions WHERE token = ?');
    $stmt->execute([$session['token']]);
    jsonOk(sessionToPublic($stmt->fetch()));
}

jsonError('Méthode non supportée', 405);

function sessionToPublic(array $s): array {
    return [
        'token'        => $s['token'],
        'displayName'  => $s['display_name'],
        'icon'         => $s['icon'],
        'gamesPlayed'  => (int)$s['games_played'],
        'achievements' => $s['achievements'] ? json_decode($s['achievements'], true) : [],
    ];
}
