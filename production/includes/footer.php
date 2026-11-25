    <footer class="site-footer">
      <div class="site-footer-inner">
        <div class="site-footer-main">
          <nav class="site-footer-nav" aria-label="푸터 메뉴">
            <a href="support.php">설계사 지원 <span aria-hidden="true">↗</span></a>
            <a href="sharing.php">나눔과 상생 <span aria-hidden="true">↗</span></a>
            <a href="careers.php">입사 안내 <span aria-hidden="true">↗</span></a>
            <a class="site-footer-cta" href="partnership.php"<?= $page === 'partnership' ? ' aria-current="page"' : '' ?>>제휴 문의</a>
            <a class="site-footer-cta" href="consultation.php"<?= $page === 'consultation' ? ' aria-current="page"' : '' ?>>자산관리 상담</a>
          </nav>
          <a class="site-footer-top" href="#top"<?= $isHome ? ' data-scroll-target="top"' : '' ?> aria-label="맨 위로">
            <span aria-hidden="true">↑</span>
          </a>
        </div>
        <div class="site-footer-details" aria-label="회사 및 문의 정보">
          <div>
            <h2>회사 정보 <span class="site-footer-sample">예시 정보</span></h2>
            <dl>
              <div><dt>상호</dt><dd>골든리본패밀리</dd></div>
              <div><dt>대표자</dt><dd>홍길동</dd></div>
              <div><dt>사업자등록번호</dt><dd>000-00-00000</dd></div>
              <div><dt>보험대리점 등록번호</dt><dd>제0000000000호</dd></div>
              <div><dt>주소</dt><dd>서울특별시 중구 예시로 00, 0층</dd></div>
            </dl>
          </div>
          <div>
            <h2>문의</h2>
            <dl>
              <div><dt>대표전화</dt><dd>02-000-0000</dd></div>
              <div><dt>팩스</dt><dd>02-000-0000</dd></div>
              <div><dt>이메일</dt><dd>contact@example.com</dd></div>
              <div><dt>운영시간</dt><dd>평일 09:00–18:00</dd></div>
            </dl>
          </div>
        </div>
        <ul class="site-footer-policies" aria-label="사이트 정책" role="list">
          <li><a href="privacy.php"<?= $page === 'privacy' ? ' aria-current="page"' : '' ?>>개인정보처리방침</a></li>
          <li>이메일무단수집거부</li>
        </ul>
        <div class="site-footer-bottom">
          <small lang="en">Copyright © 2026 Golden Ribbon Family. All rights reserved.</small>
          <p class="site-footer-brand" lang="en">Golden Ribbon <span>Family</span></p>
        </div>
      </div>
    </footer>
