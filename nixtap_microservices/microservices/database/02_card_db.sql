-- ============================================================
-- NIXTAP Microservices — Card Service DB
-- ============================================================
CREATE DATABASE IF NOT EXISTS nixtap_card_db
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE nixtap_card_db;

CREATE TABLE IF NOT EXISTS card_templates (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name                VARCHAR(80)         NOT NULL,
    description         VARCHAR(255)        NULL,
    preview_image_url   VARCHAR(500)        NULL,
    default_theme_color VARCHAR(7)          NOT NULL DEFAULT '#2563EB',
    is_active           BOOLEAN             NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_card_templates_name UNIQUE (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cards (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id             BIGINT UNSIGNED     NOT NULL,
    template_id         BIGINT UNSIGNED     NOT NULL,
    custom_slug         VARCHAR(60)         NULL,
    public_id           VARCHAR(20)         NOT NULL,
    full_name           VARCHAR(150)        NOT NULL,
    job_title           VARCHAR(120)        NULL,
    company             VARCHAR(120)        NULL,
    bio                 TEXT                NULL,
    email               VARCHAR(180)        NULL,
    phone               VARCHAR(20)         NULL,
    profile_image_url   VARCHAR(500)        NULL,
    cover_image_url     VARCHAR(500)        NULL,
    theme_color         VARCHAR(7)          NULL,
    custom_fields       JSON                NULL,
    is_primary          BOOLEAN             NOT NULL DEFAULT FALSE,
    is_published        BOOLEAN             NOT NULL DEFAULT TRUE,
    is_deleted          BOOLEAN             NOT NULL DEFAULT FALSE,
    deleted_at          TIMESTAMP           NULL,
    created_at          TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_cards_custom_slug UNIQUE (custom_slug),
    CONSTRAINT uq_cards_public_id   UNIQUE (public_id),
    CONSTRAINT fk_cards_template FOREIGN KEY (template_id)
        REFERENCES card_templates(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_cards_user_id    ON cards (user_id);
CREATE INDEX idx_cards_is_deleted ON cards (is_deleted);

CREATE TABLE IF NOT EXISTS social_links (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    card_id             BIGINT UNSIGNED     NOT NULL,
    platform            ENUM('LINKEDIN','INSTAGRAM','TWITTER','GITHUB',
                              'FACEBOOK','YOUTUBE','WHATSAPP','WEBSITE','OTHER') NOT NULL,
    url                 VARCHAR(500)        NOT NULL,
    display_order       SMALLINT UNSIGNED   NOT NULL DEFAULT 0,
    is_deleted          BOOLEAN             NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_social_links_card FOREIGN KEY (card_id)
        REFERENCES cards(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_social_links_card_id ON social_links (card_id);

-- Seed templates
INSERT INTO card_templates (name, description, default_theme_color) VALUES
('Minimal',  'Clean single-column layout, generous whitespace', '#2563EB'),
('Bold',     'Large profile image, high-contrast accent header', '#0F172A'),
('Classic',  'Traditional business-card proportions, centered layout', '#22C55E');
