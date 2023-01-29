DROP TABLE IF EXISTS `blog_articles`;
CREATE TABLE `blog_articles` (
  `uid` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `eid` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,
  `thumbnail` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `author` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `creation` datetime NOT NULL,
  `modified` datetime NOT NULL,
  `tags` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `views` int NOT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

DROP TABLE IF EXISTS `blog_comments`;
CREATE TABLE `blog_comments` (
  `uid` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `article` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `replyof` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `author` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `home` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `creation` datetime NOT NULL,
  `modified` datetime NOT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;
