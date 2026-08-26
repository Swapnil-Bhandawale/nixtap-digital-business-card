-- V1 originally created username and password as mandatory columns. The current
-- User entity persists full_name and password_hash instead, so those legacy
-- columns must not remain mandatory on Flyway-created databases.
SET @drop_column_sql = (
    SELECT IF(COUNT(*) = 1, 'ALTER TABLE users DROP COLUMN username', 'SELECT 1')
    FROM information_schema.columns
    WHERE table_schema = DATABASE() AND table_name = 'users' AND column_name = 'username');
PREPARE drop_column_statement FROM @drop_column_sql;
EXECUTE drop_column_statement;
DEALLOCATE PREPARE drop_column_statement;

SET @drop_column_sql = (
    SELECT IF(COUNT(*) = 1, 'ALTER TABLE users DROP COLUMN password', 'SELECT 1')
    FROM information_schema.columns
    WHERE table_schema = DATABASE() AND table_name = 'users' AND column_name = 'password');
PREPARE drop_column_statement FROM @drop_column_sql;
EXECUTE drop_column_statement;
DEALLOCATE PREPARE drop_column_statement;
