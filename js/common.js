if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual'; // 브라우저가 자동 복원 막기 (새로고침시)
}
document.addEventListener("DOMContentLoaded", function () {
  AOS.init();
  initBtnTop()
  initScrollHideHeader();
  initSubNavToggle();
  initScrollTab();
  initMobileNav();
});

function initBtnTop() {
  const btnTop = document.querySelector('a.btn-top');

  if (!btnTop) return;

  btnTop.addEventListener('click', function(e) {
    e.preventDefault();

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

function initScrollHideHeader() {
  const header = document.getElementById("header");
  const subNav = document.querySelector(".sub-nav");
  const scrollTab = document.querySelector(".scroll-tab-wp");
  const moNav = document.querySelector(".mo-nav");
  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", function () {
    const currentScrollY = window.scrollY;
    const isMobileNavOpen = moNav?.classList.contains("on");

    if (!isMobileNavOpen && currentScrollY > lastScrollY) {
      header.classList.add("hide");
      if (subNav) subNav.classList.add("top");
      if (scrollTab) scrollTab.classList.add("top");
    } else {
      header.classList.remove("hide");
      if (subNav) subNav.classList.remove("top");
      if (scrollTab) scrollTab.classList.remove("top");
    }

    lastScrollY = currentScrollY;
  });
}

function initSubNavToggle() {
  const subLinks = document.querySelectorAll(".sub-nav .sub-link");

  subLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const wrapper = link.closest(".sub-link-wp");
      if (wrapper) {
        document.querySelectorAll(".sub-link-wp.on").forEach((el) => {
          if (el !== wrapper) el.classList.remove("on");
        });

        wrapper.classList.toggle("on");
      }
    });
  });

  document.addEventListener("click", function (e) {
    const isClickInside = e.target.closest(".sub-link-wp");
    if (!isClickInside) {
      document.querySelectorAll(".sub-link-wp.on").forEach((el) => {
        el.classList.remove("on");
      });
    }
  });
}

function initScrollTab() {
  const anchors = document.querySelectorAll('.scroll-tab a');
  const sections = [];
  let isClickScrolling = false;

  anchors.forEach(anchor => {
    const targetSelector = anchor.getAttribute('href');
    const targetElement = document.querySelector(targetSelector);
    if (targetElement) {
      sections.push(targetElement);
    }
  });

  anchors.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      const targetSelector = this.getAttribute('href');
      const targetElement = document.querySelector(targetSelector);
      if (!targetElement) return;

      const offset = 150;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = window.pageYOffset + elementPosition - offset;

      isClickScrolling = true;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      anchors.forEach(a => a.parentElement.classList.remove('on'));
      this.parentElement.classList.add('on');

      if (!("onscrollend" in window)) {
        setTimeout(() => {
          isClickScrolling = false;
        }, 700);
      }
    });
  });

  window.addEventListener('scroll', () => {
    if (isClickScrolling) return; 

    const scrollPos = window.scrollY || window.pageYOffset;
    let currentIndex = 0;

    sections.forEach((sec, i) => {
      const offsetTop = sec.offsetTop;
      if (scrollPos >= offsetTop - window.innerHeight / 2) {
        currentIndex = i;
      }
    });

    anchors.forEach(anchor => anchor.parentElement.classList.remove('on'));
    if (anchors[currentIndex]) {
      anchors[currentIndex].parentElement.classList.add('on');
    }
  });

  if ("onscrollend" in window) {
    window.addEventListener("scrollend", () => {
      isClickScrolling = false;
    });
  }
}


function initMobileNav() {
  // 메뉴 버튼 클릭
  document.querySelector('.btn-menu')?.addEventListener('click', function () {
    this.classList.toggle('on');
    document.querySelector('.mo-nav')?.classList.toggle('on');
  });

  // 네비게이션 메뉴 항목 클릭
  document.querySelectorAll('.mo-nav .one-depth').forEach(function (oneDepthItem) {
    oneDepthItem.addEventListener('click', function (e) {
       const href = this.getAttribute('href');
        if (href === '#' || href === '' || !href) {
          e.preventDefault(); // 링크 이동 막음
        }

      const currentLi = this.closest('li');
      const navRoot = this.closest('.mo-nav');

      if (!currentLi || !navRoot) return;

      if (currentLi.classList.contains('on')) {
        currentLi.classList.remove('on');
      } else {
        const allItems = navRoot.querySelectorAll('.one-depth-wp > li');
        allItems.forEach(li => li.classList.remove('on'));
        currentLi.classList.add('on');
      }
    });
  });
}