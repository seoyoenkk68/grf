'use strict';

(() => {
  const header = document.querySelector('.header-fixed');
  const navigation = header?.querySelector('.ribbon-nav');
  const toggle = header?.querySelector('.header-menu-toggle');
  if (!navigation || !toggle) return;

  const desktop = matchMedia('(min-width: 768px)');
  const supportGroup = navigation.querySelector('.support-nav');
  const supportMenu = supportGroup?.querySelector('.support-nav-disclosure');

  function setMenuOpen(open, restoreFocus = false) {
    header.classList.toggle('is-menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    navigation.inert = !desktop.matches && !open;
    if (!open && supportMenu) supportMenu.open = false;
    if (restoreFocus) toggle.focus();
  }

  setMenuOpen(false);
  toggle.addEventListener('click', () => setMenuOpen(!header.classList.contains('is-menu-open')));
  desktop.addEventListener('change', () => setMenuOpen(false));

  supportGroup?.addEventListener('pointerenter', event => {
    if (desktop.matches && event.pointerType === 'mouse') supportMenu.open = true;
  });

  supportGroup?.addEventListener('pointerleave', event => {
    if (!desktop.matches || event.pointerType !== 'mouse') return;
    if (!supportMenu.querySelector('.support-nav-links').contains(document.activeElement)) {
      supportMenu.open = false;
    }
  });

  supportGroup?.addEventListener('focusout', event => {
    if (!supportGroup.contains(event.relatedTarget) && !supportGroup.matches(':hover')) {
      supportMenu.open = false;
    }
  });

  document.addEventListener('click', event => {
    if (supportMenu?.open && (!supportGroup.contains(event.target) || event.target.closest('.support-nav a'))) {
      supportMenu.open = false;
    }
    if (!header.classList.contains('is-menu-open')) return;
    if (!header.contains(event.target)) {
      setMenuOpen(false);
      return;
    }
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;

    const target = event.target.closest('[data-scroll-target]');
    if (target && document.getElementById(target.dataset.scrollTarget)) {
      setMenuOpen(false, navigation.contains(target));
    } else if (event.target.closest('.ribbon-nav a[href]')) {
      setMenuOpen(false);
    }
  });

  addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (supportMenu?.open) {
      event.preventDefault();
      supportMenu.open = false;
      supportMenu.querySelector('summary').focus();
      return;
    }
    if (!header.classList.contains('is-menu-open')) return;
    event.preventDefault();
    setMenuOpen(false, true);
  });
})();
