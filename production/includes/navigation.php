    <div class="header-fixed<?= $isHome ? '' : ' has-section-divider' ?>">
      <header class="header">
        <a
          class="brand"
          href="<?= $isHome ? '#top' : './' ?>"<?= $isHome ? ' data-scroll-target="top"' : '' ?>
          aria-label="Golden Ribbon Family · 메인 처음으로"
        >
          Golden Ribbon<span>Family</span>
        </a>
        <div class="header-actions">
          <a class="join" href="application.php"<?= $page === 'application' ? ' aria-current="page"' : '' ?> aria-label="온라인 입사지원">
            <span class="nav-label" aria-hidden="true"
              ><span class="nav-label-ko">입사 지원</span
              ><span class="nav-label-en" lang="en">Apply Now</span></span
            >
            <span class="join-arrow" aria-hidden="true">↗</span>
          </a>
          <button class="header-menu-toggle" type="button" aria-label="메뉴 열기" aria-controls="header-navigation" aria-expanded="false">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </button>
        </div>
        <nav id="header-navigation" class="ribbon-nav" aria-label="주 메뉴"<?= $isHome ? '' : ' data-lenis-prevent' ?>>
          <a class="nav-item" href="about.php"<?= $page === 'about' ? ' aria-current="page"' : '' ?> aria-label="골든리본 소개">
            <span class="nav-label" aria-hidden="true"
              ><span class="nav-label-ko">골든리본 소개</span
              ><span class="nav-label-en" lang="en">About Us</span></span
            >
          </a>
          <div class="support-nav">
            <a class="nav-item" href="support.php" aria-label="설계사 지원"><span class="nav-label" aria-hidden="true"
                ><span class="nav-label-ko">설계사 지원</span
                ><span class="nav-label-en" lang="en"
                  >Your Growth</span
                ></span
              ></a>
            <details class="support-nav-disclosure">
              <summary aria-label="설계사 지원 하위 메뉴"></summary>
              <div class="support-nav-links">
                <a href="support.php"<?= $page === 'support' ? ' aria-current="page"' : '' ?>>지원 혜택</a>
                <a href="ocean.php" lang="en"<?= $page === 'ocean' ? ' aria-current="page"' : '' ?>>F-OCEAN</a>
              </div>
            </details>
          </div>
          <a class="nav-item" href="sharing.php"<?= $page === 'sharing' ? ' aria-current="page"' : '' ?> aria-label="나눔과 상생">
            <span class="nav-label" aria-hidden="true"
              ><span class="nav-label-ko">나눔과 상생</span
              ><span class="nav-label-en" lang="en">Together</span></span
            >
          </a>
          <a class="nav-item" href="careers.php"<?= $page === 'careers' ? ' aria-current="page"' : '' ?> aria-label="입사 안내">
            <span class="nav-label" aria-hidden="true"
              ><span class="nav-label-ko">입사 안내</span
              ><span class="nav-label-en" lang="en">Careers</span></span
            >
          </a>
        </nav>
      </header>
    </div>
