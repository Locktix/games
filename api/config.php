<?php
// ─────────────────────────────────────────────
// Database credentials — fill in before deploying
// ─────────────────────────────────────────────
define('DB_HOST',    'localhost');
define('DB_NAME',    'cujo4479_games');   // e.g. alanbill_games
define('DB_USER',    'cujo4479_games');   // e.g. alanbill_games
define('DB_PASS',    'Cx48uboT8d');
define('DB_CHARSET', 'utf8mb4');

// ─────────────────────────────────────────────
// CORS — adjust origin if needed
// ─────────────────────────────────────────────
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ─────────────────────────────────────────────
// Global error handling — return a JSON cause instead of an empty 500
// ─────────────────────────────────────────────
error_reporting(E_ALL);
ini_set('display_errors', '0');

set_exception_handler(function (Throwable $e): void {
    error_log('[API] ' . $e->getMessage() . ' @ ' . $e->getFile() . ':' . $e->getLine());
    if (!headers_sent()) {
        http_response_code(500);
        header('Content-Type: application/json; charset=utf-8');
    }
    echo json_encode(['error' => 'Erreur serveur', 'detail' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
    exit;
});

register_shutdown_function(function (): void {
    $err = error_get_last();
    if ($err && in_array($err['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR], true)) {
        error_log('[API] FATAL ' . $err['message'] . ' @ ' . $err['file'] . ':' . $err['line']);
        if (!headers_sent()) {
            http_response_code(500);
            header('Content-Type: application/json; charset=utf-8');
        }
        echo json_encode(['error' => 'Erreur serveur fatale', 'detail' => $err['message']], JSON_UNESCAPED_UNICODE);
    }
});

// ─────────────────────────────────────────────
// PDO singleton
// ─────────────────────────────────────────────
function getDb(): PDO {
    static $pdo = null;
    if ($pdo !== null) return $pdo;
    $dsn = sprintf(
        'mysql:host=%s;dbname=%s;charset=%s',
        DB_HOST, DB_NAME, DB_CHARSET
    );
    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);
    $pdo->exec("SET time_zone = '+00:00'");
    return $pdo;
}

// ─────────────────────────────────────────────
// Response helpers
// ─────────────────────────────────────────────
function jsonOk(mixed $data, int $status = 200): void {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function jsonError(string $message, int $status = 400): void {
    jsonOk(['error' => $message], $status);
}

function getBody(): array {
    $raw = file_get_contents('php://input');
    return json_decode($raw, true) ?? [];
}

// ─────────────────────────────────────────────
// Auth helpers — Shady session token
// ─────────────────────────────────────────────
function getBearerToken(): ?string {
    // Apache/CGI on shared hosting (o2switch) often drops the Authorization
    // header; check the common fallbacks before giving up.
    $header = $_SERVER['HTTP_AUTHORIZATION']
        ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
        ?? '';
    if (!$header && function_exists('apache_request_headers')) {
        $h = apache_request_headers();
        $header = $h['Authorization'] ?? $h['authorization'] ?? '';
    }
    if (preg_match('/Bearer\s+(.+)$/i', $header, $m)) {
        return trim($m[1]);
    }
    return null;
}

function requireSession(): array {
    $token = getBearerToken();
    if (!$token) jsonError('Token requis', 401);

    $db = getDb();
    $stmt = $db->prepare('SELECT * FROM shady_sessions WHERE token = ?');
    $stmt->execute([$token]);
    $session = $stmt->fetch();

    if (!$session) jsonError('Session invalide ou expirée', 401);

    // touch last_seen
    $db->prepare('UPDATE shady_sessions SET last_seen = NOW() WHERE token = ?')->execute([$token]);

    return $session;
}

// ─────────────────────────────────────────────
// Sanitize analytics payload
// ─────────────────────────────────────────────
function sanitizePayload(array $payload): array {
    $safe = [];
    foreach ($payload as $key => $value) {
        if ($value === null) continue;
        if (is_bool($value) || is_int($value) || is_float($value)) {
            $safe[$key] = $value;
        } else {
            $safe[$key] = mb_substr((string)$value, 0, 180);
        }
    }
    return $safe;
}

// ─────────────────────────────────────────────
// Random room ID (6 alphanumeric uppercase)
// ─────────────────────────────────────────────
function generateRoomId(int $length = 6): string {
    $chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    $id = '';
    for ($i = 0; $i < $length; $i++) {
        $id .= $chars[random_int(0, strlen($chars) - 1)];
    }
    return $id;
}
