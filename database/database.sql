SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
--
-- Database name: `dental_clinic`
--
-- ----------------------------------------------------------------
--
-- Table `appointments`
--
-- ----------------------------------------------------------------
CREATE TABLE `appointments` (
  `appt_id` int(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `appt_type` varchar(64) NOT NULL,
  `appt_date` datetime DEFAULT NULL,
  `cancelation` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- ----------------------------------------------------------------
--
-- Table `users`
--
-- ----------------------------------------------------------------
CREATE TABLE `users` (
  `user_id` varchar(255) NOT NULL,
  `first_name` varchar(45) NOT NULL,
  `last_name` varchar(45) NOT NULL,
  `user_email` varchar(45) NOT NULL,
  `user_password` varchar(255) NOT NULL,
  `cca2` varchar(8) NOT NULL,
  `phone` varchar(45) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `registered` date DEFAULT NULL,
  `session_token_web` varchar(255) DEFAULT NULL,
  `session_token_mobile` varchar(255) DEFAULT NULL,
  `last_logged_in` datetime DEFAULT NULL,
  `email_token` varchar(255) DEFAULT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expires_at` datetime DEFAULT NULL,
  `activate_account_token` varchar(255) DEFAULT NULL,
  `activated_account` tinyint(1) NOT NULL DEFAULT 0,
  `disabled_account` tinyint(1) NOT NULL DEFAULT 0,
  `blocked_initial_datetime` datetime DEFAULT NULL,
  `login_attempts` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- ----------------------------------------------------------------
--
-- Table index: `appointments`
--
-- ----------------------------------------------------------------
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`appt_id`);
-- ----------------------------------------------------------------
--
-- Table index: `users`
--
-- ----------------------------------------------------------------
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `activate_account_token` (`activate_account_token`),
  ADD UNIQUE KEY `email_token` (`email_token`),
  ADD UNIQUE KEY `reset_token` (`reset_token`),
  ADD UNIQUE KEY `session_token_web` (`session_token_web`),
  ADD UNIQUE KEY `session_token_mobile` (`session_token_mobile`);
-- ----------------------------------------------------------------
--
-- Auto-increment id: `appointments`
--
-- ----------------------------------------------------------------
ALTER TABLE `appointments`
  MODIFY `appt_id` int(255) NOT NULL AUTO_INCREMENT;
COMMIT;