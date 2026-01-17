/* ========================================
   GRACEB - Components Loader
   중앙 관리용 헤더/푸터 로드
   ======================================== */

(function() {
    // 컴포넌트 로드 함수
    async function loadComponent(elementId, componentPath) {
        const element = document.getElementById(elementId);
        if (!element) return;

        try {
            const response = await fetch(componentPath);
            if (!response.ok) throw new Error(`Failed to load ${componentPath}`);
            const html = await response.text();
            element.innerHTML = html;
            return true;
        } catch (error) {
            console.error(`Error loading component: ${error.message}`);
            return false;
        }
    }

    // 페이지 타입 감지 (메인 vs 서브페이지)
    function isSubPage() {
        return window.location.pathname.includes('/pages/');
    }

    // 서브페이지용 헤더 클래스 추가
    function setupSubPageHeader() {
        const header = document.getElementById('header');
        if (header && isSubPage()) {
            header.classList.add('header--scrolled');
        }
    }

    // 드롭다운 메뉴 호버 처리 - 0.3초 유지해야 열림/전환
    function setupDropdownHover() {
        if (window.innerWidth <= 768) return;

        const menuItems = document.querySelectorAll('.header__menu-item--has-dropdown');
        let currentOpen = null;
        let hoverTimer = null;

        menuItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                clearTimeout(hoverTimer);

                // 0.3초 후에 전환
                hoverTimer = setTimeout(() => {
                    // 기존 열린 것 닫기
                    if (currentOpen && currentOpen !== item) {
                        currentOpen.classList.remove('dropdown-active');
                    }
                    item.classList.add('dropdown-active');
                    currentOpen = item;
                }, 300);
            });

            item.addEventListener('mouseleave', () => {
                clearTimeout(hoverTimer);
            });
        });

        // 메뉴 영역 벗어나면 닫기
        const nav = document.querySelector('.header__nav');
        if (nav) {
            nav.addEventListener('mouseleave', () => {
                clearTimeout(hoverTimer);
                if (currentOpen) {
                    currentOpen.classList.remove('dropdown-active');
                    currentOpen = null;
                }
            });
        }
    }

    // 컴포넌트 초기화
    async function initComponents() {
        const basePath = '/components';

        // 헤더와 푸터 로드
        const headerLoaded = await loadComponent('header-placeholder', `${basePath}/header.html`);
        const footerLoaded = await loadComponent('footer-placeholder', `${basePath}/footer.html`);

        // 컴포넌트 로드 후 초기화
        if (headerLoaded || footerLoaded) {
            // 서브페이지 헤더 설정
            setupSubPageHeader();

            // 드롭다운 호버 설정
            setupDropdownHover();

            // 커스텀 이벤트 발생 (다른 스크립트에서 사용 가능)
            document.dispatchEvent(new CustomEvent('componentsLoaded'));
        }
    }

    // DOM 로드 시 실행
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initComponents);
    } else {
        initComponents();
    }
})();
