-- ============================================================
-- NIXTAP Microservices — Engagement Service DB
-- ============================================================
CREATE DATABASE IF NOT EXISTS nixtap_engagement_db
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE nixtap_engagement_db;

CREATE TABLE IF NOT EXISTS lead_capture (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    card_id             BIGINT UNSIGNED     NOT NULL,
    visitor_name        VARCHAR(150)        NOT NULL,
    visitor_email       VARCHAR(180)        NOT NULL,
    visitor_phone       VARCHAR(20)         NULL,
    message             TEXT                NULL,
    is_deleted          BOOLEAN             NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_lead_capture_card_id    ON lead_capture (card_id);
CREATE INDEX idx_lead_capture_created_at ON lead_capture (created_at);

CREATE TABLE IF NOT EXISTS appointments (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    card_id             BIGINT UNSIGNED     NOT NULL,
    visitor_name        VARCHAR(150)        NOT NULL,
    visitor_email       VARCHAR(180)        NOT NULL,
    visitor_phone       VARCHAR(20)         NULL,
    requested_datetime  DATETIME            NOT NULL,
    message             TEXT                NULL,
    status              ENUM('PENDING','CONFIRMED','CANCELLED') NOT NULL DEFAULT 'PENDING',
    is_deleted          BOOLEAN             NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_appointments_card_id ON appointments (card_id);
CREATE INDEX idx_appointments_status  ON appointments (status);

CREATE TABLE IF NOT EXISTS visitor_feedback (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    card_id             BIGINT UNSIGNED     NOT NULL,
    visitor_name        VARCHAR(150)        NULL,
    rating              TINYINT UNSIGNED    NOT NULL,
    comment             TEXT                NULL,
    image_url           LONGTEXT            NULL,
    is_deleted          BOOLEAN             NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_rating CHECK (rating BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_visitor_feedback_card_id ON visitor_feedback (card_id);
