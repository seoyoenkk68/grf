<!doctype html>
<html lang="ko"<?= $isHome ? ' class="grf-scroll-test"' : '' ?>>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title><?= htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8') ?></title>
<?php if ($isHome): ?>
    <link rel="preload" href="./assets/image/hero-puzzle.jpg" as="image" />
<?php endif; ?>
    <link
      rel="preload"
      href="./assets/fonts/FORUM-REGULAR.woff"
      as="font"
      type="font/woff"
      crossorigin
    />
    <link
      rel="stylesheet"
      crossorigin
      href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.min.css"
    />
    <link rel="stylesheet" href="css/common.css?v=<?= filemtime(__DIR__ . '/../css/common.css') ?>" />
<?php if ($isHome): ?>
    <link rel="stylesheet" href="css/main.css?v=<?= filemtime(__DIR__ . '/../css/main.css') ?>" />
<?php else: ?>
    <link rel="stylesheet" href="css/sub.css?v=<?= filemtime(__DIR__ . '/../css/sub.css') ?>" />
    <link rel="stylesheet" href="vendor/lenis/lenis.css" />
<?php endif; ?>
    <script src="js/common.js?v=<?= filemtime(__DIR__ . '/../js/common.js') ?>" defer></script>
<?php if ($isHome): ?>
    <script src="js/main.js?v=<?= filemtime(__DIR__ . '/../js/main.js') ?>" defer></script>
<?php else: ?>
    <script src="vendor/lenis/lenis.min.js" defer></script>
    <script src="js/sub.js?v=<?= filemtime(__DIR__ . '/../js/sub.js') ?>" defer></script>
<?php endif; ?>
  </head>
  <body class="grf-page<?= $isHome ? '' : ' grf-sub' ?>"<?= $isHome ? '' : ' id="top"' ?>>
<?php if (!$isHome) { require __DIR__ . '/navigation.php'; } ?>
