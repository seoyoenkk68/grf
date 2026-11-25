<?php
$page = 'about';
$isHome = $page === 'index';
$pageTitle = '골든리본 소개 | 골든리본패밀리';
?>
<?php require __DIR__ . '/includes/header.php'; ?>
    <main>
      <div class="sub-container sub-page-title" data-sub-reveal>
        <p class="sub-page-display" lang="en">ABOUT GOLDEN RIBBON FAMILY</p>
        <nav class="sub-breadcrumb" aria-label="현재 위치">
          <a class="sub-breadcrumb-home" href="./" aria-label="홈"></a>
          <span class="sub-breadcrumb-separator" aria-hidden="true"></span>
          <h1 aria-current="page">골든리본 소개</h1>
        </nav>
      </div>
      <div class="sub-container sub-editorial">
        <section class="sub-intro" aria-labelledby="about-intro-title">
          <div class="sub-intro-copy" data-sub-reveal>
            <h2 id="about-intro-title">
              <span class="title-color">가치</span>를 나누는 사람들,<br /> <span
                class="title-color"
                >함께 성장</span
              >하는 금융 전문가 <br /> 공동체.
            </h2>
            <p class="intro-content">
              골든리본패밀리는 선배의 경험을 후배와 나누고, 동료의 고민을 함께
              풀어가는 원팀의 문화를 만들어갑니다. 교육과 실무 지원, F-OCEAN
              업무 인프라를 바탕으로 서로의 역량을 더하고 함께 나아갑니다.
            </p>
          </div>
          <figure class="sub-image" data-sub-reveal>
            <img
              src="./assets/image/hero-1.png"
              alt="푸른 들판에서 황금빛 리본으로 연결된 사람들"
              decoding="async"
            />
          </figure>
        </section>

        <section
          class="sub-feature-list about-values"
          aria-labelledby="about-values-title"
        >
          <span class="about-values-watermark" aria-hidden="true">G</span>
          <h2 id="about-values-title" data-sub-reveal>
            우리가 중요하게 생각하는 세 가지 가치
          </h2>
          <ol role="list">
            <li data-sub-reveal>
              <div class="about-value-visual">
                <canvas class="about-value-motion" width="320" height="240" aria-hidden="true"></canvas>
              </div>
              <div>
                <h3><span aria-hidden="true">01</span>가치 있는 성공</h3>
                <p>
                  골든리본패밀리가 말하는 성공은 단순히 소득을 늘리는 데 그치지
                  않습니다. 고객에게 도움이 되는 전문성을 키우고, 그
                  결실을 이웃과 사회에 나누는 것까지 진정한 성공의 가치로
                  생각합니다.
                </p>
              </div>
            </li>
            <li data-sub-reveal>
              <div class="about-value-visual">
                <canvas class="about-value-motion" data-shape="rings" data-start-angle="1.25" width="320" height="240" aria-hidden="true"></canvas>
              </div>
              <div>
                <h3><span aria-hidden="true">02</span>함께하는 성장</h3>
                <p>
                  선배의 경험과 노하우를 전하고 현장에서 서로의 어려움을
                  나누며,
                  누구도 혼자 고민하지 않도록 동행하는 원팀의 문화를 실천합니다.
                </p>
              </div>
            </li>
            <li data-sub-reveal>
              <div class="about-value-visual">
                <canvas class="about-value-motion" data-shape="cube" width="320" height="240" aria-hidden="true"></canvas>
              </div>
              <h3><span aria-hidden="true">03</span>나눔과 상생</h3>
              <p>
                정기 봉사와 후원, 구성원 기부 1:1 매칭을 통해 함께 만들어낸
                가치를 이웃과 지역사회로 확장합니다.
              </p>
            </li>
          </ol>
        </section>

        <section
          class="about-leadership"
          aria-labelledby="about-leadership-title"
        >
          <figure class="sub-image" data-sub-reveal>
            <img
              src="./assets/image/Photorealistic%20cinematic%20close-u%20740478%20NAc.png"
              alt="바다를 배경으로 황금빛 리본을 함께 잡은 두 사람의 손"
              loading="lazy"
              decoding="async"
            />
          </figure>
          <div class="about-leadership-copy" data-sub-reveal>
            <p class="sub-label" lang="en">LEADERSHIP STORY</p>
            <h2 id="about-leadership-title">
              조직을 이끄는 힘은,<br /> 사람을 향한 태도에서 시작됩니다.
            </h2>
            <p>
              골든리본패밀리의 리더십은 선배가 먼저 경험을 나누고, 동료가 서로를
              지원하며, 회사가 필요한 기반을 마련하는 데서 시작됩니다. 리더들의
              철학과 현장 경험은 원팀의 문화를 이끄는 힘입니다.
            </p>
          </div>
        </section>

        <div class="about-organization">
          <section aria-labelledby="about-organization-title" data-sub-reveal>
            <h2 id="about-organization-title">전문성과 협력 구조</h2>
            <p>
              선배 전문가의 실무 경험, 조직의 교육·영업 지원, F-OCEAN 업무
              인프라는 하나의 지원 체계로 연결됩니다. 신입은 현장에서 배우고,
              경력 설계사는 쌓아온 전문성을 발휘할 수 있도록 서로 협력합니다.
            </p>
            <ul class="about-cooperation" role="list">
              <li>
                <strong>선배의 실무 경험</strong><span>현장에서 배우기</span>
              </li>
              <li>
                <strong>교육·영업 지원</strong><span>실무 활동 뒷받침</span>
              </li>
              <li>
                <strong>F-OCEAN 업무 인프라</strong
                ><span>고객·계약·일정 관리</span>
              </li>
            </ul>
          </section>
          <section
            class="about-history"
            aria-label="생명·손해보험사 목록"
            data-sub-reveal
          >
            <ul class="about-insurers" role="list">
              <li><img src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22100%22%3E%3C/svg%3E" alt="삼성생명" width="300" height="100" /></li>
              <li><img src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22100%22%3E%3C/svg%3E" alt="한화생명" width="300" height="100" /></li>
              <li><img src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22100%22%3E%3C/svg%3E" alt="교보생명" width="300" height="100" /></li>
              <li><img src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22100%22%3E%3C/svg%3E" alt="신한라이프" width="300" height="100" /></li>
              <li><img src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22100%22%3E%3C/svg%3E" alt="동양생명" width="300" height="100" /></li>
              <li><img src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22100%22%3E%3C/svg%3E" alt="미래에셋생명" width="300" height="100" /></li>
              <li><img src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22100%22%3E%3C/svg%3E" alt="흥국생명" width="300" height="100" /></li>
              <li><img src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22100%22%3E%3C/svg%3E" alt="DB생명" width="300" height="100" /></li>
              <li><img src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22100%22%3E%3C/svg%3E" alt="KB라이프생명" width="300" height="100" /></li>
              <li><img src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22100%22%3E%3C/svg%3E" alt="NH농협생명" width="300" height="100" /></li>
              <li><img src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22100%22%3E%3C/svg%3E" alt="메트라이프생명" width="300" height="100" /></li>
              <li><img src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22100%22%3E%3C/svg%3E" alt="라이나생명" width="300" height="100" /></li>
              <li><img src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22100%22%3E%3C/svg%3E" alt="AIA생명" width="300" height="100" /></li>
              <li><img src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22100%22%3E%3C/svg%3E" alt="ABL생명" width="300" height="100" /></li>
              <li><img src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22100%22%3E%3C/svg%3E" alt="KDB생명" width="300" height="100" /></li>
              <li><img src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22100%22%3E%3C/svg%3E" alt="삼성화재" width="300" height="100" /></li>
              <li><img src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22100%22%3E%3C/svg%3E" alt="현대해상" width="300" height="100" /></li>
              <li><img src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22100%22%3E%3C/svg%3E" alt="DB손해보험" width="300" height="100" /></li>
              <li><img src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22100%22%3E%3C/svg%3E" alt="KB손해보험" width="300" height="100" /></li>
              <li><img src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22100%22%3E%3C/svg%3E" alt="메리츠화재" width="300" height="100" /></li>
              <li><img src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22100%22%3E%3C/svg%3E" alt="한화손해보험" width="300" height="100" /></li>
              <li><img src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22100%22%3E%3C/svg%3E" alt="롯데손해보험" width="300" height="100" /></li>
              <li><img src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22100%22%3E%3C/svg%3E" alt="흥국화재" width="300" height="100" /></li>
              <li><img src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22100%22%3E%3C/svg%3E" alt="NH농협손해보험" width="300" height="100" /></li>
              <li><img src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22100%22%3E%3C/svg%3E" alt="AXA손해보험" width="300" height="100" /></li>
              <li><img src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22100%22%3E%3C/svg%3E" alt="AIG손해보험" width="300" height="100" /></li>
              <li><img src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22100%22%3E%3C/svg%3E" alt="라이나손해보험" width="300" height="100" /></li>
              <li><img src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22100%22%3E%3C/svg%3E" alt="하나손해보험" width="300" height="100" /></li>
              <li><img src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22100%22%3E%3C/svg%3E" alt="신한EZ손해보험" width="300" height="100" /></li>
              <li><img src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22100%22%3E%3C/svg%3E" alt="카카오페이손해보험" width="300" height="100" /></li>
            </ul>
          </section>
        </div>

        <nav class="sub-related-links" aria-label="관련 콘텐츠">
          <a class="join" href="support.php" aria-label="설계사 지원 알아보기">
            <span class="nav-label" aria-hidden="true"
              ><span class="nav-label-ko">설계사 지원 알아보기</span
              ><span class="nav-label-en" lang="en">Your Growth</span></span
            >
            <span class="join-arrow" aria-hidden="true">↗</span>
          </a>
          <a class="join" href="careers.php" aria-label="입사 안내 보기">
            <span class="nav-label" aria-hidden="true"
              ><span class="nav-label-ko">입사 안내 보기</span
              ><span class="nav-label-en" lang="en">Careers</span></span
            >
            <span class="join-arrow" aria-hidden="true">↗</span>
          </a>
        </nav>
      </div>
    </main>
    <?php require __DIR__ . '/includes/footer.php'; ?>
  </body>
</html>
