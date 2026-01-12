/* ========================================
   GRACEB - Main JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initModules();
});

// 컴포넌트 로드 후 재초기화 (components.js 사용 시)
document.addEventListener('componentsLoaded', function() {
    initModules();
});

function initModules() {
    initHeader();
    initMobileMenu();
    initSmoothScroll();
    initAOS();
    initSwiper();
    initPortfolioSwiper();
    initCounterAnimation();
    initBackToTop();
    initHeroSlider();
    fixFooterSocial();
}

/* ==================== Fix Footer Channels (Cafe24 Override) ==================== */
function fixFooterSocial() {
    function applyStyles() {
        // 중립적 클래스명 (footer-channels, channel-btn)
        const footerChannels = document.querySelector('.footer-channels');
        const channelList = document.querySelector('.channel-list');
        const channelButtons = document.querySelectorAll('.channel-btn');

        if (footerChannels) {
            footerChannels.style.cssText = 'display: flex !important; flex-direction: column !important; align-items: center !important; visibility: visible !important; opacity: 1 !important;';
        }

        if (channelList) {
            channelList.style.cssText = 'display: flex !important; justify-content: center !important; gap: 1rem !important; visibility: visible !important; opacity: 1 !important;';
        }

        channelButtons.forEach(btn => {
            btn.style.cssText = 'display: flex !important; align-items: center !important; justify-content: center !important; width: 40px !important; height: 40px !important; border: 1px solid rgba(255,255,255,0.3) !important; visibility: visible !important; opacity: 1 !important;';

            const svg = btn.querySelector('svg');
            if (svg) {
                svg.style.cssText = 'display: block !important; width: 18px !important; height: 18px !important; fill: #ffffff !important; visibility: visible !important; opacity: 1 !important;';
            }
        });
    }

    // 즉시 실행
    applyStyles();

    // 0.5초 후 다시 실행 (Cafe24 등에서 늦게 스타일 덮어씌우는 경우 대비)
    setTimeout(applyStyles, 500);
    setTimeout(applyStyles, 1000);
    setTimeout(applyStyles, 2000);
}

/* ==================== Hero Slider ==================== */
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero__slide');
    const prevBtn = document.querySelector('.hero__nav--prev');
    const nextBtn = document.querySelector('.hero__nav--next');
    const heroTitle = document.querySelector('.hero__title');
    const heroDescription = document.querySelector('.hero__description');

    if (slides.length === 0) return;

    let currentSlide = 0;
    const totalSlides = slides.length;
    let isFirstLoad = true;

    function goToSlide(index) {
        // 범위 체크
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;

        // 현재 슬라이드 비활성화
        slides[currentSlide].classList.remove('hero__slide--active');

        // 새 슬라이드 활성화
        currentSlide = index;
        const activeSlide = slides[currentSlide];
        activeSlide.classList.add('hero__slide--active');

        // 문구 변경 (페이드 효과)
        if (heroTitle && heroDescription) {
            // 첫 로드가 아닌 경우에만 페이드 효과 적용
            if (!isFirstLoad) {
                // 애니메이션 비활성화 후 transition만 사용
                heroTitle.classList.add('fade-transition');
                heroDescription.classList.add('fade-transition');

                heroTitle.style.opacity = '0';
                heroDescription.style.opacity = '0';

                setTimeout(() => {
                    heroTitle.innerHTML = activeSlide.dataset.title;
                    heroDescription.textContent = activeSlide.dataset.description;
                    heroTitle.style.opacity = '1';
                    heroDescription.style.opacity = '1';
                }, 500);
            }
            isFirstLoad = false;
        }

        // 비디오 재생 관리
        slides.forEach((slide, i) => {
            const video = slide.querySelector('video');
            if (video) {
                if (i === currentSlide) {
                    video.currentTime = 0;
                    video.play();
                } else {
                    video.pause();
                }
            }
        });
    }

    // 이전/다음 버튼
    if (prevBtn) {
        prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
    }

    // 동영상 종료 시 다음 슬라이드로 자동 전환
    slides.forEach((slide, i) => {
        const video = slide.querySelector('video');
        if (video) {
            video.addEventListener('ended', () => {
                goToSlide(currentSlide + 1);
            });
        }
    });

    // 초기화: 모든 비디오 정지 후 첫 번째 슬라이드로 이동
    slides.forEach((slide) => {
        const video = slide.querySelector('video');
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
    });

    // 첫 번째 슬라이드 강제 활성화
    goToSlide(0);
}

/* ==================== Header ==================== */
function initHeader() {
    const header = document.getElementById('header');
    let lastScrollY = 0;

    function handleScroll() {
        const currentScrollY = window.scrollY;

        // Add/remove scrolled class
        if (currentScrollY > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }

        lastScrollY = currentScrollY;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
}

/* ==================== Mobile Menu ==================== */
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.header__link');

    if (!hamburger || !nav) return;

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when pressing Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && nav.classList.contains('active')) {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/* ==================== Smooth Scroll ==================== */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    const headerHeight = document.getElementById('header').offsetHeight;

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

/* ==================== AOS (Animate On Scroll) ==================== */
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out',
            once: true,
            offset: 100,
            disable: 'mobile' // Optional: disable on mobile for performance
        });
    }
}

/* ==================== Swiper Slider ==================== */
function initSwiper() {
    if (typeof Swiper === 'undefined') return;

    // Brand Product Slider
    const brandSwiper = new Swiper('.brand-swiper', {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        effect: 'fade',
        fadeEffect: {
            crossFade: true,
        },
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });
}

/* ==================== Portfolio Swiper ==================== */
function initPortfolioSwiper() {
    if (typeof Swiper === 'undefined') return;

    // 모든 포트폴리오 슬라이더 초기화
    const portfolioSwipers = document.querySelectorAll('.portfolio-swiper');

    portfolioSwipers.forEach((swiperEl) => {
        const prevBtn = swiperEl.querySelector('.portfolio-swiper-prev');
        const nextBtn = swiperEl.querySelector('.portfolio-swiper-next');
        const slides = swiperEl.querySelectorAll('.swiper-slide');

        new Swiper(swiperEl, {
            slidesPerView: 1,
            spaceBetween: 0,
            loop: slides.length > 1, // 슬라이드가 2개 이상일 때만 loop 활성화
            navigation: {
                nextEl: nextBtn,
                prevEl: prevBtn,
            },
        });
    });
}

/* ==================== Counter Animation ==================== */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.counter-card__number');
    if (counters.length === 0) return;

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;
    let current = 0;
    const increment = target / steps;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = formatNumber(Math.floor(current));
    }, stepDuration);
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(0) + 'M';
    } else if (num >= 1000) {
        return num.toLocaleString();
    }
    return num.toString();
}

/* ==================== Back to Top ==================== */
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;

    function toggleButton() {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', toggleButton, { passive: true });

    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ==================== Utility Functions ==================== */

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
