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

    // 드롭다운 메뉴 호버 처리
    function setupDropdownHover() {
        const menuItems = document.querySelectorAll('.header__menu-item--has-dropdown');
        let activeDropdown = null;
        let hoverTimeout = null;

        menuItems.forEach(item => {
            const dropdown = item.querySelector('.header__dropdown');

            // 메뉴 아이템에 마우스 진입
            item.addEventListener('mouseenter', () => {
                clearTimeout(hoverTimeout);
                if (activeDropdown && activeDropdown !== item) {
                    activeDropdown.classList.remove('dropdown-active');
                }
                item.classList.add('dropdown-active');
                activeDropdown = item;
            });

            // 메뉴 아이템에서 마우스 이탈
            item.addEventListener('mouseleave', (e) => {
                // 드롭다운으로 이동하는지 체크
                const toElement = e.relatedTarget;
                if (dropdown && dropdown.contains(toElement)) {
                    return; // 드롭다운으로 이동 중이면 유지
                }
                hoverTimeout = setTimeout(() => {
                    item.classList.remove('dropdown-active');
                    if (activeDropdown === item) activeDropdown = null;
                }, 50);
            });

            // 드롭다운에 마우스 진입
            if (dropdown) {
                dropdown.addEventListener('mouseenter', () => {
                    clearTimeout(hoverTimeout);
                    item.classList.add('dropdown-active');
                    activeDropdown = item;
                });

                // 드롭다운에서 마우스 이탈
                dropdown.addEventListener('mouseleave', (e) => {
                    const toElement = e.relatedTarget;
                    if (item.contains(toElement)) {
                        return; // 메뉴 아이템으로 돌아가면 유지
                    }
                    hoverTimeout = setTimeout(() => {
                        item.classList.remove('dropdown-active');
                        if (activeDropdown === item) activeDropdown = null;
                    }, 50);
                });
            }
        });
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
