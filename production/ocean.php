<?php
$page = 'ocean';
$isHome = $page === 'index';
$pageTitle = 'F-OCEAN 준비 중 | 골든리본패밀리';
?>
<?php require __DIR__ . '/includes/header.php'; ?>
    <main>
      <div class="sub-container sub-page-title" data-sub-reveal>
        <p class="sub-page-display" lang="en" aria-hidden="true">F-OCEAN</p>
        <nav class="sub-breadcrumb" aria-label="현재 위치">
          <a class="sub-breadcrumb-home" href="./" aria-label="홈"></a>
          <span class="sub-breadcrumb-separator" aria-hidden="true"></span>
          <a class="sub-breadcrumb-parent" href="support.php">설계사 지원</a>
          <span class="sub-breadcrumb-separator" aria-hidden="true"></span>
          <h1 lang="en" aria-current="page">F-OCEAN</h1>
        </nav>
      </div>
      <div class="sub-container sub-editorial">
        <section class="ocean-preview" aria-labelledby="ocean-preview-title" data-sub-reveal>
          <div class="ocean-preview-copy">
            <p class="sub-label" lang="en">COMING SOON</p>
            <h2 id="ocean-preview-title">F-OCEAN 상세 페이지를 준비하고 있습니다.</h2>
            <a class="join" href="support.php">설계사 지원 혜택 보기 <span class="join-arrow" aria-hidden="true">↗</span></a>
          </div>
        </section>
      </div>
    </main>
    <?php require __DIR__ . '/includes/footer.php'; ?>
  </body>
</html>
