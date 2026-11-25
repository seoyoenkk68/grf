<?php
$page = 'sharing';
$isHome = $page === 'index';
$pageTitle = '나눔과 상생 | 골든리본패밀리';
?>
<?php require __DIR__ . '/includes/header.php'; ?>
    <main>
      <div class="sub-container sub-page-title" data-sub-reveal>
        <p class="sub-page-display" lang="en">SOCIAL RESPONSIBILITY</p>
        <nav class="sub-breadcrumb" aria-label="현재 위치">
          <a class="sub-breadcrumb-home" href="./" aria-label="홈"></a>
          <span class="sub-breadcrumb-separator" aria-hidden="true"></span>
          <h1 aria-current="page">나눔과 상생</h1>
        </nav>
      </div>
      <div class="sub-container sub-editorial sharing-editorial">
        <section class="sub-intro" aria-labelledby="sharing-intro-title">
          <div class="sub-intro-copy" data-sub-reveal>
            <h2 id="sharing-intro-title">함께 성장하는 일의 의미를,<br /> <span class="title-color">사회와 나누는 가치</span>로.</h2>
            <p>골든리본패밀리는 설계사와 회사가 함께 성장하는 데서 나아가, 지역사회와 이웃에게 그 가치를 나누고 있습니다. 정기적인 자원봉사와 후원 활동, 기부 매칭을 통해 나눔과 상생을 실천합니다.</p>
            <a class="join sharing-intro-link" href="about.php" aria-label="골든리본 소개 보기">
              <span class="nav-label" aria-hidden="true"><span class="nav-label-ko">골든리본 소개 보기</span><span class="nav-label-en" lang="en">About Us</span></span>
              <span class="join-arrow" aria-hidden="true">↗</span>
            </a>
          </div>
          <figure class="sub-image" data-sub-reveal>
            <img src="./assets/image/main_sec5_img.jpg" alt="푸른 언덕에서 황금빛 리본이 묶인 어린 묘목을 손으로 감싸는 모습" decoding="async" />
          </figure>
        </section>

        <section class="sharing-activities sub-feature-list" aria-labelledby="sharing-activities-title">
          <h2 id="sharing-activities-title" data-sub-reveal>활동과 이야기</h2>
          <div class="sharing-activity-lead" data-sub-reveal>
            <p>우리의 나눔은 일회성 행사에 그치지 않습니다.<br />구성원이 직접 현장에 참여하고 회사가 기부에 동참하며, 도움이 필요한 이웃과 지속적인 관계를 이어갑니다.</p>
          </div>
          <ol role="list">
            <li class="sharing-activity-feature" data-sub-reveal>
              <div class="sharing-activity-visual">
                <img src="./assets/image/sub_sharing_img2-1.jpg" alt="봉사자들이 골목에서 연탄을 나르는 모습" loading="lazy" decoding="async" />
              </div>
              <h3><span aria-hidden="true">01</span>겨울 온기 나눔</h3>
              <p>겨울철 저소득 가정을 찾아 연탄과 생필품을 전달합니다.</p>
            </li>
            <li class="sharing-activity-brief" data-sub-reveal>
              <div class="sharing-activity-visual">
                <img src="./assets/image/sub_sharing_img2-2.jpg" alt="밥과 국, 반찬을 담은 식사 쟁반" loading="lazy" decoding="async" />
              </div>
              <div>
                <h3><span aria-hidden="true">02</span>희망의 급식</h3>
                <p>결식이 우려되는 아동을 위한 급식·복지 기금 후원에 참여합니다.</p>
              </div>
            </li>
            <li class="sharing-activity-brief" data-sub-reveal>
              <div class="sharing-activity-visual">
                <img src="./assets/image/sub_sharing_img2-3.jpg" alt="두 사람이 어린 나무를 심고 물을 주는 모습" loading="lazy" decoding="async" />
              </div>
              <div>
                <h3><span aria-hidden="true">03</span>푸른 숲 조성</h3>
                <p>나무 식재와 숲 가꾸기 봉사를 통해 지역의 녹색 환경 조성에 함께합니다.</p>
              </div>
            </li>
          </ol>
        </section>

        <section class="sharing-volunteer" aria-label="분기별 봉사활동">
          <div class="sharing-activity-note" data-sub-reveal>
            <p>골든리본패밀리는 <strong>분기별 봉사활동</strong>을 진행합니다.</p>
            <p>구성원들이 사회공헌 현장에 직접 참여하는 문화를 이어가고 있습니다.</p>
          </div>
        </section>

        <!--
        <section class="sharing-match" aria-labelledby="sharing-match-title">
          <div data-sub-reveal>
            <div class="sharing-match-ratio" aria-hidden="true">1<span>:</span>1</div>
            <p class="sub-label sharing-match-formula">설계사의 기부 + 회사의 동일 금액</p>
            <h2 id="sharing-match-title">함께 만드는 나눔</h2>
            <p>설계사가 참여한 기부에 회사가 동일한 금액을 더하는 1:1 매칭그랜트 제도를 운영합니다. 개인의 나눔이 조직의 실천으로 확장되는 구조를 만들어갑니다.</p>
          </div>
          <figure class="sub-image sharing-match-image" data-sub-reveal>
            <img src="./assets/image/sharing-match-ribbons.png" alt="아이보리 바탕 위에 교차하는 두 가닥의 금빛 리본" width="1200" height="896" loading="lazy" decoding="async" />
          </figure>
        </section>
        -->

      </div>
    </main>
    <?php require __DIR__ . '/includes/footer.php'; ?>
  </body>
</html>
