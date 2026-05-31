<?php
// Shady — endpoint de polling (room + players + game en une seule requête)
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') jsonError('GET requis', 405);

$roomId = strtoupper(mb_substr(trim((string)($_GET['room'] ?? '')), 0, 10));
if (!$roomId) jsonError('Paramètre room manquant');

$db = getDb();

// Room
$roomStmt = $db->prepare(
    "SELECT r.*, COUNT(p.token) AS player_count
     FROM shady_rooms r
     LEFT JOIN shady_players p ON p.room_id = r.id
     WHERE r.id = ?
     GROUP BY r.id"
);
$roomStmt->execute([$roomId]);
$room = $roomStmt->fetch();

if (!$room) {
    jsonOk(['room' => null, 'players' => [], 'game' => null]);
}

// Players
$playersStmt = $db->prepare('SELECT * FROM shady_players WHERE room_id = ? ORDER BY joined_at ASC');
$playersStmt->execute([$roomId]);
$players = $playersStmt->fetchAll();

// Game state
$gameStmt = $db->prepare('SELECT * FROM shady_game_state WHERE room_id = ?');
$gameStmt->execute([$roomId]);
$game = $gameStmt->fetch();

jsonOk([
    'room'    => roomRow($room),
    'players' => array_map('playerRow', $players),
    'game'    => $game ? gameStateRow($game) : null,
]);

function roomRow(array $r): array {
    return [
        'id'            => $r['id'],
        'name'          => $r['name'],
        'hostToken'     => $r['host_token'],
        'hostName'      => $r['host_name'],
        'hostIcon'      => $r['host_icon'],
        'maxPlayers'    => (int)$r['max_players'],
        'discussionDur' => (int)$r['discussion_dur'],
        'voteDur'       => (int)$r['vote_dur'],
        'maxRounds'     => (int)$r['max_rounds'],
        'mrWhite'       => (bool)$r['mr_white'],
        'anonymousVote' => (bool)$r['anonymous_vote'],
        'status'        => $r['status'],
        'phase'         => $r['phase'],
        'roundNum'      => (int)$r['round_num'],
        'winner'        => $r['winner'],
        'pair'          => $r['pair'] ? json_decode($r['pair'], true) : null,
        'publicRoom'    => (bool)$r['public_room'],
        'playerCount'   => (int)($r['player_count'] ?? 0),
        'updatedAt'     => $r['updated_at'],
    ];
}

function playerRow(array $p): array {
    return [
        'token'       => $p['token'],
        'displayName' => $p['display_name'],
        'icon'        => $p['icon'],
        'alive'       => (bool)$p['alive'],
        'role'        => $p['role'],
        'word'        => $p['word'],
    ];
}

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
