let isFullpageActive = false;
let swiperInstance = null;

function changeAni() {
  const change = document.querySelector('.change-ani');
  if (!change) return;

  change.classList.remove('done');
  void change.offsetWidth;

  change.classList.add('play');

  change.addEventListener('animationend', () => {
    change.classList.remove('play');
    change.classList.add('done');

    initSwiper();
    showVisualCopy();
  }, { once: true });
}

function updatePagination(index) {
  const current = document.querySelector('.current-page');
  current.textContent = String(index + 1).padStart(2, '0');
}

function progressAni() {
  const bar = document.querySelector('.visual-progressbar .bar');
  if (bar) {
    bar.style.animation = 'none';
    void bar.offsetWidth;
    bar.style.animation = 'progressAni 3500ms ease-in-out 620ms forwards';
  }
}

function reprogressAni() {
  progressAni();
}

function handleVideoPlayback() {
  const slides = document.querySelectorAll('.swiper-slide');
  slides.forEach((slide) => {
    const video = slide.querySelector('video');
    if (!video) return;

    if (slide.classList.contains('swiper-slide-active')) {
      video.play().catch((e) => {
        console.warn('Video play error:', e);
      });
    } else {
      video.pause();
    }
  });
}

function showVisualCopy() {
  const copies = document.querySelectorAll('.visual-copy');
  copies.forEach(copy => copy.classList.remove('show'));

  setTimeout(() => {
    const activeCopy = document.querySelector('.swiper-slide-active .visual-copy');
    if (activeCopy) activeCopy.classList.add('show');
  }, 1000);
}

function initSwiper() {
  swiperInstance = new Swiper('.main-visual-swiper', {
    loop: true,
    autoplay: {
      delay: 6000,
      disableOnInteraction: false
    },
    speed: 1000,
    effect: 'fade',
    fadeEffect: {
      crossFade: true
    },
    navigation: {
      nextEl: '.btn-swiper-next',
      prevEl: '.btn-swiper-prev'
    },
    on: {
      init: function () {
        updatePagination(this.realIndex);
        progressAni();
        handleVideoPlayback();
        showVisualCopy();
      },
      slideChangeTransitionEnd: function () {
        updatePagination(this.realIndex);
        reprogressAni();
        handleVideoPlayback();
        showVisualCopy();
      }
    }
  });
}

function isElementInViewport(el, offset = 0) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top + offset <= window.innerHeight &&
    rect.bottom >= 0
  );
}


function setupMobileScrollAnimations() {
  const sections = document.querySelectorAll('.section');

  function onScroll() {
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.8) {
        section.classList.add('done');
      } else {
        // section.classList.remove('done');
      }
    });
  }

  window.addEventListener('scroll', onScroll);
  onScroll();  // 초기 한 번 체크
}


window.addEventListener('load', setupMobileScrollAnimations);
window.addEventListener('resize', setupMobileScrollAnimations);


function initHeaderBehavior() {
  const header = $('#header');

  // 모바일 여부 체크 (768px 이하)
  const isMobile = window.innerWidth <= 768;
  if (isMobile) {
    isFullpageActive = false;
    // 모바일 전용 스크롤 애니메이션 초기화
    setupMobileScrollAnimations();
    $(document).on('click', '.btn-top', function (e) {
      e.preventDefault();
      $('html, body').animate({ scrollTop: 0 }, 500);
    });
    return;
  }

  $('#fullpage').fullpage({
    licenseKey: 'xxxxxxxxxxxxxxxxxxxxxxxxx',
    scrollOverflow: true,
    onLeave: function (origin, destination, direction) {
      if (direction === 'down') {
        header.addClass('hide');
      } else {
        header.removeClass('hide');
      }
    },
    afterRender: function () {
      isFullpageActive = true;
      $(document).on('click', '.btn-top', function (e) {
        e.preventDefault();
        if (typeof $.fn.fullpage.moveTo === 'function') {
          $.fn.fullpage.moveTo(1);
        }
      });
    },
    afterResponsive: function (isResponsive) {
      if (isResponsive && !isFullpageActive) {
        header.removeClass('hide');
      }
    },
    afterResize: function () {
      
    },
    afterLoad: function(anchorLink, index) {
      // console.log(`도착한 섹션 인덱스: ${index}`);
      switch(index) {
        case 1:
           $('#section1').addClass('done');
          break;
        case 2:
           $('#section2').addClass('done');
          break;
        case 3:
           $('#section3').addClass('done');
          const listItems = document.querySelectorAll(".service-list li");
          if (!window.serviceListInitialized) {
            const hasOn = Array.from(listItems).some((li) =>
              li.classList.contains("on")
            );
            if (!hasOn && listItems.length > 0) {
              listItems[0].classList.add("on");
            }

            listItems.forEach((li) => {
              li.addEventListener("mouseenter", function () {
                listItems.forEach((el) => el.classList.remove("on"));
                this.classList.add("on");
              });
            });

            window.serviceListInitialized = true;
          }
          break;
        case 4:
           $('#section4').addClass('done');
          setTimeout(() => {
            if (window.fullpage_api && typeof fullpage_api.reBuild === 'function') {
              fullpage_api.reBuild();
            }
          }, 100);

          // setTimeout(() => {
          //   if (typeof $.fn.fullpage.reBuild === 'function') {
          //     $.fn.fullpage.reBuild();
          //   }
          // }, 100);

          break;
        default:
      }
      
    }
  });
}


// 첫 번째 슬라이더 초기화 함수
function initFirstSlider() {
  const btnRight1 = document.querySelector(".group .btn-right");
  const btnLeft1 = document.querySelector(".group .btn-left");
  const imgListItems = document.querySelectorAll(".img-list li");
  const solutionList = document.querySelector(".solution-list");
  const bullets = document.querySelectorAll(".mo-pagination-bullet .bullet");
  const totalItems = imgListItems.length;

  let currentIndex = 0;
  let isTransitioning = false;

  function updateSliderTo(index, direction = "right") {
    if (isTransitioning) return;
    isTransitioning = true;

    const items = solutionList.querySelectorAll("li");
    const offset = direction === "right" ? -5 : 5;

    solutionList.style.transition = "250ms ease-in";
    solutionList.style.transform = `translateX(${offset}px)`;

    items.forEach(li => {
      li.style.transition = "250ms ease-in";
      li.style.opacity = "0.5";
    });

    setTimeout(() => {
      solutionList.style.transition = "none";
      solutionList.style.transform = "translateX(0px)";

      // 슬라이드 순서 재배치
      while (currentIndex !== index) {
        if ((currentIndex + 1) % totalItems === index) {
          solutionList.appendChild(solutionList.firstElementChild);
          currentIndex = (currentIndex + 1) % totalItems;
        } else {
          solutionList.insertBefore(solutionList.lastElementChild, solutionList.firstElementChild);
          currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        }
      }

      void solutionList.offsetHeight;
      solutionList.style.transition = "250ms ease-in";

      // 리스트 on 클래스 정리
      solutionList.querySelectorAll("li").forEach((li, i) => {
        li.classList.toggle("on", i === 0);
        li.style.opacity = i === 0 ? "1" : "0.5";
      });

      // 이미지 리스트 애니메이션 처리
      imgListItems.forEach((li, i) => {
        const isActive = i === currentIndex;
        const moveDistance = 7;

        if (isActive) {
          const startX = direction === "right" ? -moveDistance : moveDistance;
          li.style.transition = "none";
          li.style.transform = `translateX(${startX}px)`;
          li.style.opacity = "0";

          requestAnimationFrame(() => {
            li.style.transition = "250ms ease-in";
            li.style.transform = "translateX(0)";
            li.style.opacity = "1";
          });
        } else {
          const endX = direction === "right" ? moveDistance : -moveDistance;
          li.style.transition = "250ms ease-in";
          li.style.transform = `translateX(${endX}px)`;
          li.style.opacity = "0";
        }
      });

      // bullet 업데이트
      bullets.forEach((bullet, indexB) => {
        bullet.classList.toggle("on", indexB === currentIndex);
      });

      isTransitioning = false;
    }, 250);
  }

  function next() {
    const nextIndex = (currentIndex + 1) % totalItems;
    updateSliderTo(nextIndex, "right");
  }

  function prev() {
    const prevIndex = (currentIndex - 1 + totalItems) % totalItems;
    updateSliderTo(prevIndex, "left");
  }

  // ▶ 버튼 이벤트
  btnRight1?.addEventListener("click", next);
  btnLeft1?.addEventListener("click", prev);

  // ▶ 리스트 클릭 시 이동
  solutionList.querySelectorAll("li").forEach(li => {
    li.addEventListener("click", () => {
      if (!li.classList.contains("on")) {
        next();
      }
    });
  });

  // ▶ bullet 클릭 시 이동
  bullets.forEach((bullet, index) => {
    bullet.addEventListener("click", () => {
      if (index !== currentIndex) {
        const direction = index > currentIndex ? "right" : "left";
        updateSliderTo(index, direction);
      }
    });
  });

  // ▶ 드래그 슬라이드 (터치 & 마우스)
  let startX = 0;
  let isDragging = false;

  solutionList.addEventListener("mousedown", e => {
    isDragging = true;
    startX = e.clientX;
  });

  solutionList.addEventListener("touchstart", e => {
    isDragging = true;
    startX = e.touches[0].clientX;
  });

  solutionList.addEventListener("mousemove", e => {
    if (!isDragging) return;
    e.preventDefault(); // 드래그 방지
  });

  solutionList.addEventListener("mouseup", e => {
    if (!isDragging) return;
    const delta = e.clientX - startX;
    handleSwipe(delta);
    isDragging = false;
  });

  solutionList.addEventListener("touchend", e => {
    if (!isDragging) return;
    const delta = e.changedTouches[0].clientX - startX;
    handleSwipe(delta);
    isDragging = false;
  });

  function handleSwipe(deltaX) {
    const threshold = 30;
    if (deltaX > threshold) {
      prev();
    } else if (deltaX < -threshold) {
      next();
    }
  }

  // ▶ 초기 세팅
  updateSliderTo(0);
}


// 두 번째 슬라이더 초기화 함수
function initSecondSlider() {
  const slider = document.querySelector('.slider-list');
  const btnLeft2 = document.querySelector('.slider-list-wp .btn-left');
  const btnRight2 = document.querySelector('.slider-list-wp .btn-right');

  if (!slider || !btnLeft2 || !btnRight2) return;

  function calculateSlideWidthAndGap() {
    const slide = slider.querySelector('li');
    const slideWidth = slide.offsetWidth;

    const sliderStyles = getComputedStyle(slider);
    const gapStr = sliderStyles.getPropertyValue('gap') || sliderStyles.getPropertyValue('column-gap');
    const gap = parseInt(gapStr) || 0;

    return { slideWidth, gap, totalSlideWidth: slideWidth + gap };
  }

  const slideCount = slider.children.length;
  let { slideWidth, gap, totalSlideWidth } = calculateSlideWidthAndGap();

  // 슬라이드 복제
  const slides = Array.from(slider.children);
  slides.forEach(slide => {
    const clone = slide.cloneNode(true);
    slider.appendChild(clone);
  });

  let currentX = 0;
  let direction = -1; // -1: left, 1: right
  const speed = 2; // px/frame
  let animationId;

  function animate() {
    currentX += direction * speed;

    const resetPoint = -(slideCount * totalSlideWidth);

    if (direction === -1 && currentX <= resetPoint) {
      currentX = 0;
    } else if (direction === 1 && currentX >= 0) {
      currentX = resetPoint;
    }

    slider.style.transform = `translateX(${currentX}px)`;
    animationId = requestAnimationFrame(animate);
  }

  animate();

  function changeDirection(dir) {
    if ((dir === 'left' && direction === -1) || (dir === 'right' && direction === 1)) return;
    direction = dir === 'left' ? -1 : 1;
  }

  btnLeft2.addEventListener('click', () => changeDirection('left'));
  btnRight2.addEventListener('click', () => changeDirection('right'));

  // 리사이즈 시 다시 계산
  window.addEventListener('resize', () => {
    const sizes = calculateSlideWidthAndGap();
    slideWidth = sizes.slideWidth;
    gap = sizes.gap;
    totalSlideWidth = sizes.totalSlideWidth;
  });
}


window.addEventListener('load', changeAni);
$(document).ready(function () {
  initHeaderBehavior();
  initFirstSlider();
  initSecondSlider();
});

$(document).on('click', '.mo-nav .one-depth', function (e) {
  e.preventDefault();

  const $currentLi = $(this).closest('li');
  const $navRoot = $(this).closest('.mo-nav');

  if ($currentLi.hasClass('on')) {
    $currentLi.removeClass('on');
  } else {
    $navRoot.find('.one-depth-wp > li').removeClass('on');
    $currentLi.addClass('on');
  }
});

$(document).on('click', '.btn-menu', function () {
  $('.btn-menu').toggleClass('on');
  $('.mo-nav').toggleClass('on');
});