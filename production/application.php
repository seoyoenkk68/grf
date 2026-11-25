<?php
$page = 'application';
$isHome = $page === 'index';
$pageTitle = '온라인 입사지원 | 골든리본패밀리';
?>
<?php require __DIR__ . '/includes/header.php'; ?>
    <main>
      <div class="sub-container sub-page-title" data-sub-reveal>
        <p class="sub-page-display" lang="en">APPLICATION</p>
        <nav class="sub-breadcrumb" aria-label="현재 위치">
          <a class="sub-breadcrumb-home" href="./" aria-label="홈"></a>
          <span class="sub-breadcrumb-separator" aria-hidden="true"></span>
          <a class="sub-breadcrumb-parent" href="careers.php">입사 안내</a>
          <span class="sub-breadcrumb-separator" aria-hidden="true"></span>
          <h1 aria-current="page">온라인 입사지원</h1>
        </nav>
      </div>
      <div class="sub-container sub-editorial">
        <section class="application-section" aria-labelledby="application-title">
          <div class="application-intro" data-sub-reveal>
            <h2 id="application-title">골든리본패밀리와의 새로운 시작,<br /> 지금 지원해 보세요.</h2>
            <p id="application-preview">현재는 폼 미리보기 단계입니다. 실제 개인정보를 입력하지 마세요. 입력한 정보는 전송하거나 저장하지 않습니다.</p>
          </div>
          <form class="application-form" method="post" aria-describedby="application-preview">
            <div class="application-fields">
              <label>성함 <span aria-hidden="true">*</span>
                <input name="name" type="text" autocomplete="name" placeholder="성함을 입력해 주세요." required />
              </label>
              <label>연락처 <span aria-hidden="true">*</span>
                <input name="phone" type="tel" autocomplete="tel" placeholder="연락 가능한 휴대전화 번호" required />
              </label>
              <label>이메일 주소 <span aria-hidden="true">*</span>
                <input name="email" type="email" autocomplete="email" placeholder="이메일 주소를 입력해 주세요." required />
              </label>
              <label>금융 영업 경력 <span aria-hidden="true">*</span>
                <select name="experience" required>
                  <option value="" selected disabled>경력 여부를 선택해 주세요.</option>
                  <option value="new">신입</option>
                  <option value="experienced">경력</option>
                </select>
              </label>
              <label class="application-motivation">자기소개 및 포부 <span aria-hidden="true">*</span>
                <textarea name="motivation" rows="6" placeholder="지원 동기와 본인의 경험 또는 앞으로의 목표를 작성해 주세요." required></textarea>
              </label>
            </div>

            <fieldset class="application-consent">
              <legend>개인정보 수집 및 이용 동의 (필수)</legend>
              <div class="application-consent-terms">
                <p id="application-consent-note">골든리본패밀리는 온라인 입사지원 접수 및 채용 절차 진행을 위해 다음과 같이 개인정보를 수집·이용합니다.</p>
                <dl>
                  <div>
                    <dt>1. 수집 및 이용 목적</dt>
                    <dd>입사지원 접수, 지원자 확인, 채용 심사, 면접 일정 및 결과 안내, 채용 관련 연락</dd>
                  </div>
                  <div>
                    <dt>2. 수집하는 개인정보 항목</dt>
                    <dd>성명, 연락처, 이메일 주소, 금융 영업 경력, 자기소개 및 포부</dd>
                  </div>
                  <div>
                    <dt>3. 개인정보 보유 및 이용 기간</dt>
                    <dd>채용 절차 종료 시까지 보유·이용하며, 이후 지체 없이 파기합니다. 단, 관계 법령에 따른 보존 의무가 있는 경우 해당 기간 동안 보관합니다.</dd>
                  </div>
                  <div>
                    <dt>4. 동의 거부 권리 및 불이익</dt>
                    <dd>귀하는 개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있습니다. 다만, 동의를 거부하는 경우 온라인 입사지원서 접수가 제한됩니다.</dd>
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
              <button class="join application-submit" type="submit" disabled>입사지원서 접수하기 <span class="join-arrow" aria-hidden="true">↗</span></button>
              <a class="join" href="careers.php">입사 안내로 돌아가기</a>
            </div>
            <p class="application-status" role="status" hidden></p>
          </form>
        </section>
      </div>
    </main>
    <?php require __DIR__ . '/includes/footer.php'; ?>
  </body>
</html>
