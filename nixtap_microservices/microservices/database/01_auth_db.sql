-- ============================================================
-- NIXTAP Microservices — Auth Service DB
-- Run this first
-- ============================================================
CREATE DATABASE IF NOT EXISTS nixtap_auth_db
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE nixtap_auth_db;

CREATE TABLE IF NOT EXISTS users (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    full_name           VARCHAR(150)        NOT NULL,
    email               VARCHAR(180)        NOT NULL,
    password_hash       VARCHAR(255)        NULL,
    phone               VARCHAR(20)         NULL,
    role                ENUM('ADMIN','USER') NOT NULL DEFAULT 'USER',
    auth_provider       ENUM('LOCAL','GOOGLE') NOT NULL DEFAULT 'LOCAL',
    provider_user_id    VARCHAR(255)        NULL,
    is_active           BOOLEAN             NOT NULL DEFAULT TRUE,
    is_deleted          BOOLEAN             NOT NULL DEFAULT FALSE,
    deleted_at          TIMESTAMP           NULL,
    created_at          TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_users_email UNIQUE (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_users_email     ON users (email);
CREATE INDEX idx_users_is_deleted ON users (is_deleted);
