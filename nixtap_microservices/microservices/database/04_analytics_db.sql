-- ============================================================
-- NIXTAP Microservices — Analytics Service DB
-- ============================================================
CREATE DATABASE IF NOT EXISTS nixtap_analytics_db
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE nixtap_analytics_db;

CREATE TABLE IF NOT EXISTS profile_views (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    card_id             BIGINT UNSIGNED     NOT NULL,
    visitor_ip          VARCHAR(45)         NOT NULL,
    user_agent          VARCHAR(500)        NULL,
    referrer            VARCHAR(500)        NULL,
    viewed_at           TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Composite index supports dedup query: WHERE card_id=? AND visitor_ip=? AND DATE(viewed_at)=?
CREATE INDEX idx_profile_views_card_ip_date ON profile_views (card_id, visitor_ip, viewed_at);

CREATE TABLE IF NOT EXISTS card_shares (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    card_id             BIGINT UNSIGNED     NOT NULL,
    share_channel       ENUM('WHATSAPP','EMAIL','LINKEDIN','TWITTER',
                              'COPY_LINK','QR_CODE','OTHER') NOT NULL,
    shared_at           TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_card_shares_card_id ON card_shares (card_id);
CREATE INDEX idx_card_shares_channel ON card_shares (share_channel);
