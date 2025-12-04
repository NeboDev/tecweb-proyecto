-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 02-12-2025 a las 17:46:14
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `digital_resources`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `access`
--

CREATE TABLE `access` (
  `id_access` int(11) UNSIGNED NOT NULL,
  `id_user` int(11) UNSIGNED NOT NULL,
  `date_access` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `access`
--

INSERT INTO `access` (`id_access`, `id_user`, `date_access`) VALUES
(1, 1, '2025-11-30 00:19:44'),
(2, 3, '2025-11-29 22:19:44'),
(3, 7, '2025-11-29 19:19:44'),
(4, 16, '2025-11-30 00:19:44'),
(5, 17, '2025-11-29 00:19:44'),
(6, 18, '2025-11-30 00:19:44'),
(7, 19, '2025-11-28 00:19:44'),
(8, 20, '2025-11-27 00:19:44'),
(9, 11, '2025-11-30 00:09:44'),
(10, 12, '2025-11-29 23:49:44'),
(11, 13, '2025-11-29 23:19:44'),
(12, 14, '2025-11-29 20:19:44'),
(13, 15, '2025-11-23 00:19:44'),
(14, 16, '2025-11-29 22:19:44'),
(15, 1, '2025-10-30 00:19:44');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `downloads`
--

CREATE TABLE `downloads` (
  `id_download` int(11) UNSIGNED NOT NULL,
  `id_user` int(11) UNSIGNED NOT NULL,
  `id_resource` int(11) UNSIGNED NOT NULL,
  `date_download` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `downloads`
--

INSERT INTO `downloads` (`id_download`, `id_user`, `id_resource`, `date_download`) VALUES
(1, 16, 35, '2025-11-30 00:19:44'),
(2, 16, 34, '2025-11-29 23:19:44'),
(3, 16, 36, '2025-11-29 00:19:44'),
(4, 17, 37, '2025-11-30 00:19:44'),
(5, 17, 39, '2025-11-29 00:19:44'),
(6, 17, 38, '2025-11-28 00:19:45'),
(7, 18, 8, '2025-11-30 00:19:45'),
(8, 18, 44, '2025-11-30 00:19:45'),
(10, 18, 43, '2025-11-29 21:19:45'),
(11, 18, 55, '2025-11-29 00:19:45'),
(12, 19, 51, '2025-11-30 00:19:45'),
(13, 19, 52, '2025-11-29 19:19:45'),
(14, 20, 60, '2025-11-30 00:19:45'),
(15, 20, 56, '2025-11-29 00:19:45'),
(16, 1, 2, '2025-11-30 00:19:45'),
(17, 1, 3, '2025-11-30 00:19:45'),
(19, 3, 16, '2025-11-28 00:19:45'),
(20, 7, 18, '2025-11-23 00:19:45'),
(21, 16, 60, '2025-11-28 00:19:45'),
(22, 3, 60, '2025-11-27 00:19:45'),
(23, 1, 43, '2025-11-30 00:09:45'),
(24, 7, 43, '2025-11-29 23:59:45');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `resources`
--

CREATE TABLE `resources` (
  `id_resource` int(11) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `route` varchar(255) NOT NULL,
  `type` varchar(100) DEFAULT NULL,
  `language` varchar(100) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `date` datetime DEFAULT current_timestamp(),
  `delete` tinyint(4) NOT NULL DEFAULT 0,
  `id_user` int(11) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `resources`
--

INSERT INTO `resources` (`id_resource`, `name`, `description`, `route`, `type`, `language`, `category`, `date`, `delete`, `id_user`) VALUES
(2, 'Guía de Slim Framework', 'Introducción paso a paso a APIs con PHP', '/uploads/guias/slim_v4.pdf', 'pdf', 'es', 'backend', '2025-11-29 00:00:00', 1, 1),
(3, 'Guía de Slim Framework v2', 'Versión actualizada con Middleware', '/uploads/guias/slim_v4_updated.pdf', 'pdf', 'es', 'backend', '2025-12-01 00:00:00', 0, 1),
(4, 'Introducción a PHP', 'Guía básica de backend', 'uploads/php_intro.pdf', 'pdf', 'es', 'backend', '2025-11-29 18:45:57', 0, 1),
(5, 'CSS Grid Layout', 'Diseño moderno con CSS', 'uploads/css_grid.pdf', 'pdf', 'es', 'frontend', '2025-11-29 18:45:57', 1, 3),
(6, 'Javascript ES6', 'Nuevas características de JS', 'uploads/js_es6.pdf', 'pdf', 'en', 'frontend', '2025-11-29 18:45:57', 1, 7),
(7, 'Docker para Principiantes', 'Contenedores paso a paso', 'uploads/docker.pdf', 'pdf', 'es', 'devops', '2025-11-29 18:45:57', 1, 1),
(8, 'React vs Vue', 'Comparativa de frameworks', 'uploads/comparison.png', 'png', 'en', 'frontend', '2025-11-29 18:45:57', 1, 3),
(9, 'Base de Datos MySQL', 'Optimización de consultas', 'uploads/mysql_opt.pdf', 'pdf', 'es', 'database', '2025-11-29 18:45:57', 1, 7),
(10, 'API REST con Slim', 'Como crear APIs rápidas', 'uploads/slim_fast.pdf', 'pdf', 'es', 'backend', '2025-11-28 18:45:57', 1, 1),
(11, 'Seguridad Informática', 'Conceptos de hacking ético', 'uploads/security.pdf', 'pdf', 'en', 'security', '2025-11-27 18:45:57', 1, 3),
(12, 'Python para Data Science', 'Análisis de datos', 'uploads/python_data.pdf', 'pdf', 'es', 'data', '2025-11-26 18:45:57', 1, 7),
(13, 'Algoritmos Genéticos', 'Inteligencia Artificial', 'uploads/ai_gen.pdf', 'pdf', 'es', 'ai', '2025-11-25 18:45:57', 1, 1),
(14, 'Diseño UX/UI', 'Principios de experiencia de usuario', 'uploads/ux_ui.pdf', 'pdf', 'es', 'design', '2025-11-29 18:45:57', 1, 11),
(15, 'Angular Avanzado', 'RxJS y Observables', 'uploads/angular.pdf', 'pdf', 'en', 'frontend', '2025-11-29 18:45:57', 1, 12),
(16, 'Laravel 10', 'Novedades del framework', 'uploads/laravel.pdf', 'pdf', 'es', 'backend', '2025-11-29 18:45:57', 1, 13),
(17, 'NodeJS y Express', 'Backend con Javascript', 'uploads/node.pdf', 'pdf', 'en', 'backend', '2025-11-29 18:45:57', 1, 14),
(18, 'Git y Github', 'Control de versiones', 'uploads/git_manual.pdf', 'pdf', 'es', 'tools', '2025-11-29 18:45:57', 1, 15),
(19, 'Scrum Master', 'Metodologías ágiles', 'uploads/scrum.pdf', 'pdf', 'es', 'agile', '2025-11-29 18:45:57', 1, 1),
(20, 'Kotlin para Android', 'Desarrollo móvil nativo', 'uploads/kotlin.pdf', 'pdf', 'en', 'mobile', '2025-11-29 18:45:57', 1, 3),
(21, 'Swift iOS', 'Desarrollo para iPhone', 'uploads/swift.pdf', 'pdf', 'en', 'mobile', '2025-11-29 18:45:57', 1, 7),
(22, 'Linux Server', 'Administración de servidores', 'uploads/linux.pdf', 'pdf', 'es', 'sysadmin', '2025-11-29 18:45:57', 0, 11),
(23, 'AWS Cloud', 'Servicios en la nube', 'uploads/aws.pdf', 'pdf', 'en', 'cloud', '2025-11-29 18:45:57', 0, 12),
(24, 'C# .NET Core', 'Desarrollo empresarial', 'uploads/csharp.pdf', 'pdf', 'es', 'backend', '2025-11-29 18:45:57', 0, 13),
(25, 'Go Lang', 'Concurrencia y microservicios', 'uploads/go.pdf', 'pdf', 'en', 'backend', '2025-11-29 18:45:57', 0, 14),
(26, 'Rust Programming', 'Seguridad de memoria', 'uploads/rust.pdf', 'pdf', 'en', 'systems', '2025-11-29 18:45:57', 0, 15),
(27, 'Machine Learning', 'Redes neuronales', 'uploads/ml.pdf', 'pdf', 'es', 'ai', '2025-11-29 18:45:57', 0, 1),
(28, 'Big Data Hadoop', 'Procesamiento masivo', 'uploads/hadoop.pdf', 'pdf', 'en', 'data', '2025-11-29 18:45:57', 0, 3),
(29, 'Cybersecurity Ops', 'Defensa de red', 'uploads/cyber.png', 'png', 'en', 'security', '2025-11-29 18:45:57', 0, 7),
(30, 'Blockchain Basics', 'Criptomonedas y cadenas', 'uploads/crypto.pdf', 'pdf', 'es', 'crypto', '2025-11-29 18:45:57', 0, 11),
(31, 'Unity 3D', 'Desarrollo de videojuegos', 'uploads/unity.pdf', 'pdf', 'en', 'gamedev', '2025-11-29 18:45:57', 0, 12),
(32, 'Unreal Engine', 'Gráficos avanzados', 'uploads/unreal.pdf', 'pdf', 'en', 'gamedev', '2025-11-29 18:45:57', 0, 13),
(33, 'Photoshop para Web', 'Edición de assets', 'uploads/ps.png', 'png', 'es', 'design', '2025-11-29 18:45:57', 0, 14),
(34, 'Script de Web Scraping', 'Bot con BeautifulSoup para extraer datos', 'uploads/scraper.py', 'py', 'python', 'backend', '2025-11-29 18:53:38', 0, 16),
(35, 'Análisis de Pandas', 'Notebook de Jupyter para ciencia de datos', 'uploads/analysis.ipynb', 'ipynb', 'python', 'data', '2025-11-28 18:53:38', 0, 16),
(36, 'API con FastAPI', 'Backend asíncrono moderno', 'uploads/main.py', 'py', 'python', 'backend', '2025-11-29 18:53:38', 0, 16),
(37, 'Conexión Singleton BD', 'Patrón de diseño Singleton para JDBC', 'uploads/DatabaseConnection.java', 'java', 'java', 'backend', '2025-11-27 18:53:38', 0, 17),
(38, 'Modelo de Usuario', 'POJO User Entity con getters/setters', 'uploads/User.java', 'java', 'java', 'backend', '2025-11-29 18:53:38', 0, 17),
(39, 'Servicio Spring Boot', 'Controlador REST básico', 'uploads/UserController.java', 'java', 'java', 'backend', '2025-11-29 18:53:38', 0, 1),
(40, 'Algoritmo Dijkstra', 'Implementación eficiente de grafos', 'uploads/dijkstra.cpp', 'cpp', 'c++', 'algorithms', '2025-11-26 18:53:38', 0, 3),
(41, 'Gestor de Memoria', 'Manejo manual de punteros y referencias', 'uploads/memory.c', 'c', 'c', 'systems', '2025-11-29 18:53:38', 0, 7),
(42, 'Header de Utilidades', 'Archivo de cabecera con macros', 'uploads/utils.h', 'cpp', 'c++', 'systems', '2025-11-29 18:53:38', 0, 3),
(43, 'Validación Formulario', 'Script para validar emails y passwords', 'uploads/validate.js', 'js', 'javascript', 'frontend', '2025-11-29 18:53:38', 0, 18),
(44, 'Componente React', 'Botón reutilizable con hooks', 'uploads/Button.jsx', 'jsx', 'javascript', 'frontend', '2025-11-28 18:53:38', 0, 18),
(45, 'Servidor Express', 'Configuración básica de Node.js', 'uploads/server.js', 'js', 'javascript', 'backend', '2025-11-29 18:53:38', 0, 18),
(46, 'Interfaz de Usuario', 'Definición de tipos para API', 'uploads/types.ts', 'ts', 'typescript', 'frontend', '2025-11-29 18:53:38', 0, 1),
(47, 'Login Controller', 'Lógica de autenticación', 'uploads/auth.php', 'php', 'php', 'backend', '2025-11-29 18:53:38', 0, 7),
(48, 'Conexión PDO', 'Clase wrapper para base de datos', 'uploads/db.php', 'php', 'php', 'backend', '2025-11-24 18:53:38', 0, 7),
(49, 'Juego Unity', 'Script de movimiento del jugador', 'uploads/PlayerMovement.cs', 'cs', 'c#', 'gamedev', '2025-11-29 18:53:38', 0, 17),
(50, 'API Controller .NET', 'Endpoint para gestión de productos', 'uploads/ProductsController.cs', 'cs', 'c#', 'backend', '2025-11-29 18:53:38', 0, 3),
(51, 'Dump Base de Datos', 'Backup completo de tablas y datos', 'uploads/backup_v1.sql', 'sql', 'sql', 'database', '2025-11-23 18:53:38', 0, 19),
(52, 'Procedimientos Almacenados', 'Funciones para reportes mensuales', 'uploads/procedures.sql', 'sql', 'sql', 'database', '2025-11-29 18:53:38', 0, 19),
(53, 'Consultas Complejas', 'Joins y subconsultas optimizadas', 'uploads/queries.sql', 'sql', 'sql', 'database', '2025-11-29 18:53:38', 0, 1),
(54, 'Landing Page', 'Estructura semántica HTML5', 'uploads/index.html', 'html', 'html', 'frontend', '2025-11-29 18:53:38', 0, 18),
(55, 'Estilos Dark Mode', 'Variables CSS y media queries', 'uploads/style.css', 'css', 'css', 'frontend', '2025-11-29 18:53:38', 0, 18),
(56, 'Microservicio Go', 'Servidor HTTP con Goroutines', 'uploads/main.go', 'go', 'go', 'backend', '2025-11-29 18:53:38', 0, 20),
(57, 'Calculadora Rust', 'CLI seguro con manejo de memoria', 'uploads/calc.rs', 'rs', 'rust', 'systems', '2025-11-29 18:53:38', 0, 20),
(58, 'Vista iOS', 'SwiftUI View para perfil', 'uploads/ProfileView.swift', 'swift', 'swift', 'mobile', '2025-11-29 18:53:38', 0, 3),
(59, 'Script Automatización', 'Script Ruby para tareas', 'uploads/task.rb', 'rb', 'ruby', 'devops', '2025-11-29 18:53:38', 0, 7),
(60, 'Docker Compose', 'Orquestación de contenedores', 'uploads/docker-compose.yml', 'yml', 'yaml', 'devops', '2025-11-29 18:53:38', 0, 20),
(61, 'Package JSON', 'Dependencias de proyecto Node', 'uploads/package.json', 'json', 'json', 'frontend', '2025-11-29 18:53:38', 0, 18),
(62, 'Variables de Entorno', 'Ejemplo de archivo .env', 'uploads/.env.example', 'txt', 'config', 'devops', '2025-11-29 18:53:38', 0, 1),
(63, 'README Proyecto', 'Documentación en Markdown', 'uploads/README.md', 'md', 'markdown', 'docs', '2025-11-29 18:53:38', 0, 16);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `eliminado` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `eliminado`) VALUES
(1, 'Said Israel Cesar Arce', 'saidcesar118@gmail.com', '$2y$10$toCms05bpsqdkRv.oByuA.Ilq9TuQkWflNNdwx6pm0jDSgs6tC5t2', 0),
(3, 'Carlos Duran', 'carlosfdv@gmail.com', '$2y$10$biC2Kfxt5in08K/rUxohzuCm/zUya98iovczTrl95wyo6/l9g6OD6', 0),
(7, 'Edgar Martinez', 'eddymart@gmail.com', '$2y$10$hS2ZDAoEagZxv.U9cCb1COQlaGWpbGhopgSthsg0tixKYzNMVqc92', 0),
(8, 'Usuario Pruebas', 'test@correo.com', '$2y$10$mJ8cYnGsNg732jMwoslKdOW9NaPKhWzv7BEtnEsMsZyvW1zmPrNEC', 0),
(11, 'Ana Torres', 'ana.torres@test.com', '$2y$10$toCms05bpsqdkRv.oByuA.Ilq9TuQkWflNNdwx6pm0jDSgs6tC5t2', 0),
(12, 'Luis Mendez', 'luis.mendez@test.com', '$2y$10$toCms05bpsqdkRv.oByuA.Ilq9TuQkWflNNdwx6pm0jDSgs6tC5t2', 0),
(13, 'Sofia Castro', 'sofia.castro@test.com', '$2y$10$toCms05bpsqdkRv.oByuA.Ilq9TuQkWflNNdwx6pm0jDSgs6tC5t2', 0),
(14, 'Jorge Ruiz', 'jorge.ruiz@test.com', '$2y$10$toCms05bpsqdkRv.oByuA.Ilq9TuQkWflNNdwx6pm0jDSgs6tC5t2', 0),
(15, 'Valeria Diaz', 'valeria.diaz@test.com', '$2y$10$toCms05bpsqdkRv.oByuA.Ilq9TuQkWflNNdwx6pm0jDSgs6tC5t2', 0),
(16, 'Alex Python', 'alex.py@code.com', '$2y$10$toCms05bpsqdkRv.oByuA.Ilq9TuQkWflNNdwx6pm0jDSgs6tC5t2', 0),
(17, 'Sarah Java', 'sarah.java@code.com', '$2y$10$toCms05bpsqdkRv.oByuA.Ilq9TuQkWflNNdwx6pm0jDSgs6tC5t2', 0),
(18, 'Mike Frontend', 'mike.js@code.com', '$2y$10$toCms05bpsqdkRv.oByuA.Ilq9TuQkWflNNdwx6pm0jDSgs6tC5t2', 0),
(19, 'Elena Data', 'elena.sql@code.com', '$2y$10$toCms05bpsqdkRv.oByuA.Ilq9TuQkWflNNdwx6pm0jDSgs6tC5t2', 0),
(20, 'DevOps Dave', 'dave.ops@code.com', '$2y$10$toCms05bpsqdkRv.oByuA.Ilq9TuQkWflNNdwx6pm0jDSgs6tC5t2', 0);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `access`
--
ALTER TABLE `access`
  ADD PRIMARY KEY (`id_access`),
  ADD KEY `idx_access_user` (`id_user`);

--
-- Indices de la tabla `downloads`
--
ALTER TABLE `downloads`
  ADD PRIMARY KEY (`id_download`),
  ADD KEY `idx_downloads_user` (`id_user`),
  ADD KEY `idx_downloads_resource` (`id_resource`);

--
-- Indices de la tabla `resources`
--
ALTER TABLE `resources`
  ADD PRIMARY KEY (`id_resource`),
  ADD KEY `idx_resources_user` (`id_user`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `access`
--
ALTER TABLE `access`
  MODIFY `id_access` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `downloads`
--
ALTER TABLE `downloads`
  MODIFY `id_download` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `resources`
--
ALTER TABLE `resources`
  MODIFY `id_resource` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `access`
--
ALTER TABLE `access`
  ADD CONSTRAINT `fk_access_user` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `downloads`
--
ALTER TABLE `downloads`
  ADD CONSTRAINT `fk_downloads_resource` FOREIGN KEY (`id_resource`) REFERENCES `resources` (`id_resource`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_downloads_user` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `resources`
--
ALTER TABLE `resources`
  ADD CONSTRAINT `fk_resources_user` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
