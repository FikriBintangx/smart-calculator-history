-- ============================================================
-- Smart Calculator with History - Database Schema (MySQL / MariaDB)
-- ============================================================

CREATE DATABASE IF NOT EXISTS `smart_calculator_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `smart_calculator_db`;

-- 1. Table: Users
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` VARCHAR(64) NOT NULL UNIQUE,
  `email` VARCHAR(255) DEFAULT NULL,
  `device_os` ENUM('ios', 'android', 'web') DEFAULT 'android',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Table: Premium Subscriptions & Entitlements
CREATE TABLE IF NOT EXISTS `user_subscriptions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` VARCHAR(64) NOT NULL,
  `is_premium` TINYINT(1) DEFAULT 0,
  `plan_type` ENUM('free', 'monthly', 'lifetime') DEFAULT 'free',
  `expires_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Table: Purchase Receipts & Transactions Log
CREATE TABLE IF NOT EXISTS `purchase_receipts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` VARCHAR(64) NOT NULL,
  `transaction_id` VARCHAR(128) NOT NULL UNIQUE,
  `product_id` VARCHAR(128) NOT NULL,
  `platform` ENUM('ios', 'android', 'sandbox') NOT NULL,
  `receipt_data` TEXT NOT NULL,
  `purchase_date` DATETIME NOT NULL,
  `verified_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `status` ENUM('valid', 'invalid', 'expired', 'refunded') DEFAULT 'valid',
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert Mock Seed Data for Testing
INSERT INTO `users` (`user_id`, `email`, `device_os`) VALUES 
('user_free_01', 'free_user@example.com', 'android'),
('user_premium_01', 'premium_user@example.com', 'ios')
ON DUPLICATE KEY UPDATE `user_id` = `user_id`;

INSERT INTO `user_subscriptions` (`user_id`, `is_premium`, `plan_type`, `expires_at`) VALUES 
('user_free_01', 0, 'free', NULL),
('user_premium_01', 1, 'lifetime', '2099-12-31 23:59:59')
ON DUPLICATE KEY UPDATE `user_id` = `user_id`;
