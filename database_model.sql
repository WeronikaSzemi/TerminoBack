-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Wersja serwera:               10.4.24-MariaDB - mariadb.org binary distribution
-- Serwer OS:                    Win64
-- HeidiSQL Wersja:              12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Zrzut struktury tabela termino.termbases
CREATE TABLE IF NOT EXISTS `termbases` (
  `termbaseId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT uuid(),
  `termbaseName` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userName` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`termbaseId`) USING BTREE,
  KEY `FK_termbases_users` (`userName`),
  CONSTRAINT `FK_termbases_users` FOREIGN KEY (`userName`) REFERENCES `users` (`userName`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Eksport danych został odznaczony.

-- Zrzut struktury tabela termino.users
CREATE TABLE IF NOT EXISTS `users` (
  `userName` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hash` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`userName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Eksport danych został odznaczony.

-- Zrzut struktury tabela termino.user_glossary
CREATE TABLE IF NOT EXISTS `user_glossary` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT uuid(),
  `term` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `termSource` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `termDefinition` varchar(300) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `termDefinitionSource` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `termCollocations` varchar(300) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `equivalent` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `equivalentSource` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `equivalentDefinition` varchar(300) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `equivalentDefinitionSource` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `equivalentCollocations` varchar(300) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Eksport danych został odznaczony.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
