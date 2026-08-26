-- Make a database initialized only by Flyway compatible with the User entity.
-- Use information_schema rather than MySQL 8-specific ADD COLUMN IF NOT EXISTS;
-- this also runs on the local MySQL server used by the project.
SET @add_column_sql = (
    SELECT IF(COUNT(*) = 0,
        'ALTER TABLE users ADD COLUMN full_name VARCHAR(150) NOT NULL DEFAULT ''''',
        'SELECT 1')
    FROM information_schema.columns
    WHERE table_schema = DATABASE() AND table_name = 'users' AND column_name = 'full_name');
PREPARE add_column_statement FROM @add_column_sql;
EXECUTE add_column_statement;
DEALLOCATE PREPARE add_column_statement;

SET @add_column_sql = (
    SELECT IF(COUNT(*) = 0, 'ALTER TABLE users ADD COLUMN password_hash VARCHAR(255) NULL', 'SELECT 1')
    FROM information_schema.columns
    WHERE table_schema = DATABASE() AND table_name = 'users' AND column_name = 'password_hash');
PREPARE add_column_statement FROM @add_column_sql;
EXECUTE add_column_statement;
DEALLOCATE PREPARE add_column_statement;

SET @add_column_sql = (
    SELECT IF(COUNT(*) = 0, 'ALTER TABLE users ADD COLUMN phone VARCHAR(20) NULL', 'SELECT 1')
    FROM information_schema.columns
    WHERE table_schema = DATABASE() AND table_name = 'users' AND column_name = 'phone');
PREPARE add_column_statement FROM @add_column_sql;
EXECUTE add_column_statement;
DEALLOCATE PREPARE add_column_statement;

SET @add_column_sql = (
    SELECT IF(COUNT(*) = 0, 'ALTER TABLE users ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT ''USER''', 'SELECT 1')
    FROM information_schema.columns
    WHERE table_schema = DATABASE() AND table_name = 'users' AND column_name = 'role');
PREPARE add_column_statement FROM @add_column_sql;
EXECUTE add_column_statement;
DEALLOCATE PREPARE add_column_statement;

SET @add_column_sql = (
    SELECT IF(COUNT(*) = 0, 'ALTER TABLE users ADD COLUMN auth_provider VARCHAR(20) NOT NULL DEFAULT ''LOCAL''', 'SELECT 1')
    FROM information_schema.columns
    WHERE table_schema = DATABASE() AND table_name = 'users' AND column_name = 'auth_provider');
PREPARE add_column_statement FROM @add_column_sql;
EXECUTE add_column_statement;
DEALLOCATE PREPARE add_column_statement;

SET @add_column_sql = (
    SELECT IF(COUNT(*) = 0, 'ALTER TABLE users ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE', 'SELECT 1')
    FROM information_schema.columns
    WHERE table_schema = DATABASE() AND table_name = 'users' AND column_name = 'is_active');
PREPARE add_column_statement FROM @add_column_sql;
EXECUTE add_column_statement;
DEALLOCATE PREPARE add_column_statement;

SET @add_column_sql = (
    SELECT IF(COUNT(*) = 0, 'ALTER TABLE users ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT FALSE', 'SELECT 1')
    FROM information_schema.columns
    WHERE table_schema = DATABASE() AND table_name = 'users' AND column_name = 'is_deleted');
PREPARE add_column_statement FROM @add_column_sql;
EXECUTE add_column_statement;
DEALLOCATE PREPARE add_column_statement;

SET @add_column_sql = (
    SELECT IF(COUNT(*) = 0, 'ALTER TABLE users ADD COLUMN deleted_at TIMESTAMP NULL', 'SELECT 1')
    FROM information_schema.columns
    WHERE table_schema = DATABASE() AND table_name = 'users' AND column_name = 'deleted_at');
PREPARE add_column_statement FROM @add_column_sql;
EXECUTE add_column_statement;
DEALLOCATE PREPARE add_column_statement;

SET @add_column_sql = (
    SELECT IF(COUNT(*) = 0,
        'ALTER TABLE users ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
        'SELECT 1')
    FROM information_schema.columns
    WHERE table_schema = DATABASE() AND table_name = 'users' AND column_name = 'updated_at');
PREPARE add_column_statement FROM @add_column_sql;
EXECUTE add_column_statement;
DEALLOCATE PREPARE add_column_statement;

ALTER TABLE users MODIFY COLUMN email VARCHAR(180) NOT NULL;
