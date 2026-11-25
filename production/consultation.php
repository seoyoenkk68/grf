<?php
$page = 'consultation';
$isHome = $page === 'index';
$pageTitle = '자산관리 상담 | 골든리본패밀리';
?>
<?php require __DIR__ . '/includes/header.php'; ?>
    <main>
      <div class="sub-container sub-page-title" data-sub-reveal>
        <p class="sub-page-display" lang="en">FINANCIAL CONSULTATION</p>
        <nav class="sub-breadcrumb" aria-label="현재 위치">
          <a class="sub-breadcrumb-home" href="./" aria-label="홈"></a>
          <span class="sub-breadcrumb-separator" aria-hidden="true"></span>
          <h1 aria-current="page">자산관리 상담</h1>
        </nav>
      </div>
      <div class="sub-container sub-editorial">
        <section class="application-section" aria-labelledby="application-title">
          <div class="application-intro" data-sub-reveal>
            <h2 id="application-title">상담은 시작됩니다.</h2>
            <p>재무 상황과 상담 목적에 맞는 정보를 살펴볼 수 있도록 상담 문의를 남겨 주세요. 구체적인 안내 내용은 상담 과정에서 확인할 수 있습니다.</p>
            <p id="application-preview">현재는 폼 미리보기 단계입니다. 실제 개인정보를 입력하지 마세요. 입력한 정보는 전송하거나 저장하지 않습니다.</p>
          </div>
          <form class="application-form" method="post" aria-describedby="application-preview" data-preview-status="필수 항목을 확인했습니다. 미리보기에서는 문의가 접수되지 않습니다.">
            <div class="application-fields">
              <label>성함 <span aria-hidden="true">*</span>
                <input name="name" type="text" autocomplete="name" placeholder="성함을 입력해 주세요." required />
              </label>
              <label>연락처 <span aria-hidden="true">*</span>
                <input name="phone" type="tel" autocomplete="tel" placeholder="연락 가능한 전화번호" required />
              </label>
              <label class="application-motivation">상담 희망 내용 <span aria-hidden="true">*</span>
                <textarea name="message" rows="6" placeholder="상담을 희망하는 주제와 내용을 작성해 주세요." required></textarea>
              </label>
            </div>

            <fieldset class="application-consent">
              <legend>개인정보 수집 및 이용 동의 (필수)</legend>
              <div class="application-consent-terms">
                <dl id="application-consent-note">
                  <div>
                    <dt>1. 수집 및 이용 목적</dt>
                    <dd>자산관리 상담 문의 접수, 상담 일정 조율 및 관련 안내</dd>
                  </div>
                  <div>
                    <dt>2. 수집하는 개인정보 항목</dt>
                    <dd>성명, 연락처, 상담 희망 내용</dd>
                  </div>
                  <div>
                    <dt>3. 개인정보 보유 및 이용 기간</dt>
                    <dd>문의 및 상담 처리 완료 시까지 보유·이용하며, 이후 지체 없이 파기합니다. 관계 법령에 따른 보존 의무가 있는 경우 해당 기간 동안 보관합니다.</dd>
                  </div>
                  <div>
                    <dt>4. 동의 거부 권리 및 불이익</dt>
                    <dd>개인정보 수집 및 이용에 대한 동의를 거부할 수 있습니다. 동의를 거부하는 경우 문의 접수가 제한됩니다.</dd>
                  </div>
                </dl>
              </div>
              <label>
                <input type="checkbox" name="consent" aria-describedby="application-consent-note" required />
                개인정보 수집 및 이용에 동의합니다. (필수)
              </label>
              <a class="application-privacy-link" href="privacy.php" target="_blank" rel="noopener" aria-label="개인정보처리방침 전문 보기 (새 탭)">개인정보처리방침 전문 보기</a>
            </fieldset>

            <div class="application-actions">
              <button class="join application-submit" type="submit" disabled>자산관리 상담 문의하기 <span class="join-arrow" aria-hidden="true">↗</span></button>
            </div>
            <p class="application-status" role="status" hidden></p>
          </form>
        </section>
      </div>
    </main>
    <?php require __DIR__ . '/includes/footer.php'; ?>
  </body>
</html>
