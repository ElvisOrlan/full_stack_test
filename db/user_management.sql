-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le : lun. 25 août 2025 à 19:40
-- Version du serveur : 8.3.0
-- Version de PHP : 8.4.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `user_management`
--

-- --------------------------------------------------------

--
-- Structure de la table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('laravel-cache-6ErNIhNjJfoCRQwG', 's:7:\"forever\";', 2071509908),
('laravel-cache-6KLUxuZ4GdWs4cHP', 's:7:\"forever\";', 2071510016),
('laravel-cache-aRVt2wyh2QHEKhxT', 's:7:\"forever\";', 2071509955),
('laravel-cache-d1eSvOYiJREifcik', 's:7:\"forever\";', 2071509161),
('laravel-cache-e1CvkninhI1r6SJA', 's:7:\"forever\";', 2071510075),
('laravel-cache-gqKzr5EsAqszXr2C', 's:7:\"forever\";', 2071508961),
('laravel-cache-hfluQlulggfeqHOa', 's:7:\"forever\";', 2071509063),
('laravel-cache-w1CP384aC7w78dmq', 's:7:\"forever\";', 2071510694),
('laravel-cache-Xda44KDxg4GXpRqB', 's:7:\"forever\";', 2071509007),
('laravel-cache-YYXQ2SxeNfkR39ct', 's:7:\"forever\";', 2071510831);

-- --------------------------------------------------------

--
-- Structure de la table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `migrations`
--

CREATE TABLE `migrations` (
  `id` int UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_08_22_111000_create_roles_table', 1),
(5, '2025_08_22_111525_create_utilisateurs_table', 1);

-- --------------------------------------------------------

--
-- Structure de la table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `roles`
--

CREATE TABLE `roles` (
  `id` bigint UNSIGNED NOT NULL COMMENT 'id du role pour la liaison avec la table utilsateur ',
  `nom_role` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT ' 	Nom du role: admin ou user ',
  `description_role` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT ' 	La table roles définit les différents niveaux d’accès ou responsabilités attribués aux utilisateurs de l’application. Chaque rôle représente une catégorie fonctionnelle (ex. : administrateur, utilisateur) et peut être utilisé pour contrôler les permissions, l\\’affichage de contenu, ou l\\’accès à certaines fonctionnalités.',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `roles`
--

INSERT INTO `roles` (`id`, `nom_role`, `description_role`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'Administrateur du système', '2025-08-22 13:13:40', '2025-08-22 13:13:40'),
(2, 'user', 'Utilisateur standard', '2025-08-22 13:13:40', '2025-08-22 13:13:40');

-- --------------------------------------------------------

--
-- Structure de la table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('4HAepmmj8k4I0nFXGOG7dahgpFjOVXZNPdGpDQj7', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:143.0) Gecko/20100101 Firefox/143.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoib0s5d3MxNGM2dVM0NWJqN3NuNmVkSEdtenF5eTBOQkhVZWgxc3o3ZiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjI6Imh0dHA6Ly9ncm1jcnVkYXBwLnRlc3QiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1756144633),
('6qD51rwB06SRR1lXBDcLGxGXQHeJlM8yihHsc1We', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:143.0) Gecko/20100101 Firefox/143.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidnU3ZkRSc0phWkE2U1pCWkg4WEp0bnN3VWtYQWZkVFBtSHRxS1FmMyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjI6Imh0dHA6Ly9ncm1jcnVkYXBwLnRlc3QiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1756141840),
('70KIW5UWIQ693dPNUZ6UUL3603KInreenBa1hRfI', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:143.0) Gecko/20100101 Firefox/143.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZ09BS0FNOXl5Rmhabk1CZTFlRDVVc3pTUHp4NnFaajN4UzVtVk5RYiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjI6Imh0dHA6Ly9ncm1jcnVkYXBwLnRlc3QiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1756143265),
('AYvUQ16iR660bn9Bw4WBDFMk9E1Up35GhCSq0LoL', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:143.0) Gecko/20100101 Firefox/143.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidTljYWFRdU9ET09UdkxYQWZkT0xPcGJFUWNhbjQwSUdpVkFrMGR3eCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjI6Imh0dHA6Ly9ncm1jcnVkYXBwLnRlc3QiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1756140582),
('BMR3OV1uewJUgAUw4LoH7owgmCmcOOQ5eHozMh7o', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:143.0) Gecko/20100101 Firefox/143.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYmZQMnFRNjFaWHJwdWdsRHloY1ZneG5lZFlVWWNNMnVBT28yTVk1TyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjI6Imh0dHA6Ly9ncm1jcnVkYXBwLnRlc3QiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1756137640),
('EHzjDMMqfneQ5dYM4xxWT8z0qgLcwl5wZ8FtinIo', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:143.0) Gecko/20100101 Firefox/143.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNDV4SzJPSHRqb3N5RFpKRTdGOWtKUjhLQjJ0eDVGTjluYnNiNkR4aSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjI6Imh0dHA6Ly9ncm1jcnVkYXBwLnRlc3QiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1756149435),
('igHlsxpzbLpNypcrYvZCqnZCd8SAC0oywKo1jM88', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:143.0) Gecko/20100101 Firefox/143.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNWVNSFZncmQyN0lMdUN1VDFmdUxMNUpBU09QS3VqNkVKR211a25TbCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzI6Imh0dHA6Ly9ncm1jcnVkYXBwLnRlc3QvZGFzaGJvYXJkIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1756147791),
('JavmOJYzvx7yIlgPzLH25JXcMHYEBbAYqzB6br9f', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:143.0) Gecko/20100101 Firefox/143.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidVNnWmN3SEd5bWI5QkZIclN4aktHdnRVR2FHcTNwSGxYeG80MndPQyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzI6Imh0dHA6Ly9ncm1jcnVkYXBwLnRlc3QvZGFzaGJvYXJkIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1756144630),
('jUxtI8jAW6JkPzhGyf9UsBBz13MY9ph3GGhzwAlO', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:143.0) Gecko/20100101 Firefox/143.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiblN4TllmY1VLZFVYQk9ZOEVYUFBBa0ttV1JXeWhnOW5mS0RaOHp0dSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjI6Imh0dHA6Ly9ncm1jcnVkYXBwLnRlc3QiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1756141644),
('Pa0GShTA7k3lAREpfQ6PbOVzRBEMWwQQtEiu9Vcm', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:143.0) Gecko/20100101 Firefox/143.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieElKcUVLYUJWaHVIbThWaUVsbzJta2czT0lHTkdadlhjMDdyc2w5RSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzI6Imh0dHA6Ly9ncm1jcnVkYXBwLnRlc3QvZGFzaGJvYXJkIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1756149432),
('qmpvpsFQKuJyK2mxTZkEuvDaZxOUrjbbDWfx5flm', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:143.0) Gecko/20100101 Firefox/143.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidXlZTDJ3MzNJN2J5RURYNU9mT096SWk5aEE4aklramlDZGZJampSRiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjI6Imh0dHA6Ly9ncm1jcnVkYXBwLnRlc3QiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1756150833),
('SQjKlLqpzD1mZMxuTvm5CK7JdWcoDuAU7pzl6WS3', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:143.0) Gecko/20100101 Firefox/143.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoib0dNT3NFU0xoaHpDNTc3ZTJoSm9MSUtSNWNWWUdtdlQ0OHExM3drcyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzI6Imh0dHA6Ly9ncm1jcnVkYXBwLnRlc3QvZGFzaGJvYXJkIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1756143283),
('sufrlCOSKPAFa9yoH1eOJzVLYVzukQ2scOt43gBL', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:143.0) Gecko/20100101 Firefox/143.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMTJGN1F0dlEwSXIzZVV0M2pHUjdIcDc3OVptS3NZUDJieG5zWGk5NiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjI6Imh0dHA6Ly9ncm1jcnVkYXBwLnRlc3QiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1756143963),
('T4QJvSR81YS1HodgNF8Zq8MUvZt5N3USY7XcAyyx', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:143.0) Gecko/20100101 Firefox/143.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMVZtQk80c2RwdDJFYXBMM1JoQ2JnVnJ1VGxJRlJzQ2d1bXNVMW9UUiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzI6Imh0dHA6Ly9ncm1jcnVkYXBwLnRlc3QvZGFzaGJvYXJkIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1756142475),
('UkmiordWCzrVRVx6QvvBba12dPwsbYJM1qpGlcIG', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:143.0) Gecko/20100101 Firefox/143.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidG5PNjlwam11Y1RqbU9qWVNuUjVSNFFqMGlMOWQ3MGNoc1hLbUlrdCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzI6Imh0dHA6Ly9ncm1jcnVkYXBwLnRlc3QvZGFzaGJvYXJkIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1756139069),
('UzPHxuWeOwRkzUVX8QvGHUDdjRheeLUkWFQyDDAO', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:143.0) Gecko/20100101 Firefox/143.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRVdyU3ZDVm5UQ242SGNNcFVybGpzckhWY25ySjUzdnV2azhibTJSUyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzI6Imh0dHA6Ly9ncm1jcnVkYXBwLnRlc3QvZGFzaGJvYXJkIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1756141858),
('vpfIcM43DzEv9M7x9CEefRSJZWRkKmoKb1ExiB8p', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:143.0) Gecko/20100101 Firefox/143.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTXJPcWhXM0l6d0VWV2N6VFN2cWsxTFlVem92cnl1dHR1OTR3S2RUdyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzI6Imh0dHA6Ly9ncm1jcnVkYXBwLnRlc3QvZGFzaGJvYXJkIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1756139130),
('wzF8yDJzW1lGnI60vv7ghg8gKSG5qlFSJnLQfJpL', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:143.0) Gecko/20100101 Firefox/143.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSElqaGI0NEZkUmFMa1F6TW5JbFYxb0Rtd3FDdldjSjBsYVU3TEI3VSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzI6Imh0dHA6Ly9ncm1jcnVkYXBwLnRlc3QvZGFzaGJvYXJkIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1756138965),
('yvLoTq0UlR6EaAq8QGT2T5vCMuZJDTb1F32WmcYd', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:143.0) Gecko/20100101 Firefox/143.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicEFCYjY4bkVtVThnSGZCUW5xdDB1TFplc2hQaWJ2WFBRcVM0TThocCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjI6Imh0dHA6Ly9ncm1jcnVkYXBwLnRlc3QiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1756149961);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role_id` bigint NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `utilisateurs`
--

CREATE TABLE `utilisateurs` (
  `id` bigint UNSIGNED NOT NULL COMMENT 'identifiant de l''utilisateur',
  `nom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'nom complet de l''utilisateur',
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'adresse email de l''utilisateur, doit être unique',
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'mot de passe hash& de l''utilisateur',
  `role_id` bigint UNSIGNED NOT NULL,
  `actif` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'indique si l''utilisateur est actif ou non, par défaut il est inactif',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `utilisateurs`
--

INSERT INTO `utilisateurs` (`id`, `nom`, `email`, `password`, `role_id`, `actif`, `created_at`, `updated_at`) VALUES
(1, 'Elvis Admin', 'admin@example.com', '$2y$12$A2dL2yd3hCf.5l1k1aA.Ju.19LxWROiaGD9eYWni7TOJM.kASYdFe', 1, 1, '2025-08-22 13:13:43', '2025-08-22 13:13:43'),
(12, 'Bob Martin', 'bob.martin@example.com', 'securepass', 2, 0, '2025-08-24 12:14:21', '2025-08-24 12:14:21'),
(13, 'Claire Moreau', 'claire.moreau@example.com', 'pass456', 1, 0, '2025-08-24 12:14:21', '2025-08-24 13:45:35'),
(14, 'David Leroy', 'david.leroy@example.com', 'mypassword', 2, 1, '2025-08-24 12:14:21', '2025-08-24 12:14:21'),
(20, 'Julien Caron', 'julien.caron@example.com', 'julienpass', 2, 1, '2025-08-24 12:14:21', '2025-08-24 12:14:21'),
(21, 'Karine Lefevre', 'karine.lefevre@example.com', 'karinepass', 1, 0, '2025-08-24 12:14:21', '2025-08-24 12:14:21'),
(22, 'Laurent Giraud', 'laurent.giraud@example.com', 'laurentpass', 2, 1, '2025-08-24 12:14:21', '2025-08-24 12:14:21'),
(23, 'Marie Roche', 'appoline@example.com', 'mariepass', 1, 1, '2025-08-24 12:14:21', '2025-08-24 13:46:41'),
(24, 'Nicolas Fontaine', 'nicolas.fontaine@example.com', 'nicolaspwd', 2, 0, '2025-08-24 12:14:21', '2025-08-24 12:14:21'),
(26, 'Pauline Rey', 'pauline.rey@example.com', 'paulinepwd', 2, 1, '2025-08-24 12:14:21', '2025-08-24 12:14:21'),
(27, 'Quentin Meunier', 'quentin.meunier@example.com', 'quentinpass', 1, 0, '2025-08-24 12:14:21', '2025-08-24 12:14:21'),
(28, 'Romain Lemoine', 'romain.lemoine@example.com', 'romainpwd', 2, 1, '2025-08-24 12:14:21', '2025-08-24 12:14:21'),
(30, 'Thomas Perret', 'thomas.perret@example.com', 'thomaspwd', 2, 0, '2025-08-24 12:14:21', '2025-08-24 12:14:21'),
(34, 'user', 'user@email.com', '$2y$12$5mib6UkuBkg.Xee4Iq9QWuLrVzxssuRj89xQDqkTIP6ztfPZq7se6', 2, 1, '2025-08-25 18:15:05', '2025-08-25 18:15:05'),
(35, 'admin', 'admin@mail.com', '$2y$12$EXW.2LOmMiqNDv/70S9EYO3nP4nTqgGAkkciFofrMnBrHjQRkl/Na', 1, 1, '2025-08-25 18:15:43', '2025-08-25 18:15:43');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Index pour la table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Index pour la table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Index pour la table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Index pour la table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Index pour la table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roles_nom_role_unique` (`nom_role`);

--
-- Index pour la table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Index pour la table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `utilisateurs_email_unique` (`email`),
  ADD KEY `utilisateurs_role_id_foreign` (`role_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'id du role pour la liaison avec la table utilsateur ', AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'identifiant de l''utilisateur', AUTO_INCREMENT=36;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  ADD CONSTRAINT `utilisateurs_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
