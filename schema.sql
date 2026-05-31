-- Games Hub — MySQL Schema
-- Run once: mysql -u USER -p DB_NAME < schema.sql

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- ─────────────────────────────────────────────
-- Analytics
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS game_events (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  game       VARCHAR(50)  NOT NULL,
  event_type VARCHAR(50)  NOT NULL,
  payload    JSON,
  page_path  VARCHAR(255),
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_game    (game),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────
-- PianoTiles leaderboard
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS scores (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  game        VARCHAR(50)  NOT NULL,
  player_name VARCHAR(100) NOT NULL DEFAULT 'Anonyme',
  score       INT          NOT NULL DEFAULT 0,
  extra       JSON,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_game_score (game, score DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────
-- TuPrefere — vote counts per dilemme
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tuprefere_votes (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  dilemma_id  VARCHAR(60)  NOT NULL COMMENT 'e.g. normal_1, spicy_3',
  choice      CHAR(1)      NOT NULL COMMENT 'A or B',
  vote_count  INT UNSIGNED NOT NULL DEFAULT 1,
  UNIQUE KEY uk_vote (dilemma_id, choice),
  INDEX idx_dilemma (dilemma_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────
-- RPG players
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS rpg_players (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  player_name VARCHAR(50) NOT NULL,
  extra       JSON,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────
-- Shady — sessions anonymes (remplace Firebase Auth)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS shady_sessions (
  token        VARCHAR(64)  NOT NULL PRIMARY KEY,
  display_name VARCHAR(18)  NOT NULL,
  icon         VARCHAR(10)  NOT NULL DEFAULT '🕵️',
  games_played INT UNSIGNED NOT NULL DEFAULT 0,
  achievements JSON,
  created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────
-- Shady — salons
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS shady_rooms (
  id              VARCHAR(10)  NOT NULL PRIMARY KEY,
  name            VARCHAR(30)  NOT NULL,
  host_token      VARCHAR(64)  NOT NULL,
  host_name       VARCHAR(18)  NOT NULL,
  host_icon       VARCHAR(10)  NOT NULL DEFAULT '🕵️',
  max_players     TINYINT      NOT NULL DEFAULT 6,
  discussion_dur  SMALLINT     NOT NULL DEFAULT 60,
  vote_dur        SMALLINT     NOT NULL DEFAULT 45,
  max_rounds      TINYINT      NOT NULL DEFAULT 6,
  mr_white        TINYINT(1)   NOT NULL DEFAULT 1,
  anonymous_vote  TINYINT(1)   NOT NULL DEFAULT 1,
  status          ENUM('waiting','playing','finished','closed') NOT NULL DEFAULT 'waiting',
  phase           VARCHAR(20)  NOT NULL DEFAULT 'distribution',
  round_num       TINYINT      NOT NULL DEFAULT 1,
  winner          VARCHAR(20)  DEFAULT NULL,
  pair            JSON         DEFAULT NULL,
  public_room     TINYINT(1)   NOT NULL DEFAULT 1,
  created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────
-- Shady — joueurs dans un salon
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS shady_players (
  room_id      VARCHAR(10) NOT NULL,
  token        VARCHAR(64) NOT NULL,
  display_name VARCHAR(18) NOT NULL,
  icon         VARCHAR(10) NOT NULL DEFAULT '🕵️',
  alive        TINYINT(1)  NOT NULL DEFAULT 1,
  role         VARCHAR(20) DEFAULT NULL,
  word         VARCHAR(50) DEFAULT NULL,
  joined_at    TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (room_id, token),
  INDEX idx_room (room_id),
  FOREIGN KEY (room_id) REFERENCES shady_rooms(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────
-- Shady — état de partie
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS shady_game_state (
  room_id          VARCHAR(10) NOT NULL PRIMARY KEY,
  phase            VARCHAR(20) NOT NULL DEFAULT 'distribution',
  round_num        TINYINT     NOT NULL DEFAULT 1,
  phase_started_at TIMESTAMP   NULL DEFAULT NULL,
  phase_dur_sec    SMALLINT    NOT NULL DEFAULT 0,
  votes            JSON        DEFAULT NULL,
  eliminated       JSON        DEFAULT NULL,
  pair             JSON        DEFAULT NULL,
  winner           VARCHAR(20) DEFAULT NULL,
  mr_white_guess   VARCHAR(50) DEFAULT NULL,
  updated_at       TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (room_id) REFERENCES shady_rooms(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────
-- ActionVerite — salons multijoueur
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS av_rooms (
  code           VARCHAR(10) NOT NULL PRIMARY KEY,
  host_id        VARCHAR(30) NOT NULL DEFAULT '',
  host_name      VARCHAR(50) NOT NULL DEFAULT '',
  status         ENUM('waiting','playing','ended') NOT NULL DEFAULT 'waiting',
  difficulty     VARCHAR(20) NOT NULL DEFAULT 'normal',
  current_index  INT         NOT NULL DEFAULT 0,
  current_type   VARCHAR(10) DEFAULT NULL,
  current_text   TEXT        DEFAULT NULL,
  players        JSON        DEFAULT NULL COMMENT '[{id,name}]',
  end_votes      JSON        DEFAULT NULL COMMENT '[clientId, ...]',
  created_at     TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
