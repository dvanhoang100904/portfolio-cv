document.addEventListener('DOMContentLoaded', () => {
    /*************** Scroll Progress ***************/
    // Cập nhật biến CSS --scroll-progress dựa trên vị trí cuộn, dùng để vẽ thanh tiến trình
    const updateScrollProgress = () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight =
            document.documentElement.scrollHeight - document.documentElement.clientHeight;
        document.documentElement.style.setProperty('--scroll-progress', scrollTop / scrollHeight);
    };
    window.addEventListener('scroll', updateScrollProgress);
    // khởi tạo lần đầu khi tải trang
    updateScrollProgress();

    /*************** Navbar & Back-to-Top ***************/
    const navbar = document.querySelector('[data-js-nav]');
    const logo = document.querySelector('[data-js-logo]');
    const navLinks = document.querySelectorAll('[data-js-nav-link]');
    const backToTop = document.querySelector('.back-to-top');

    // Hover 3D + text shadow cho navbar links
    navLinks.forEach((link) => {
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'translateY(-3px) translateZ(10px)';
            link.style.textShadow = '0 4px 8px rgba(52,200,219,0.3)';
        });
        link.addEventListener('mouseleave', () => {
            link.style.transform = '';
            link.style.textShadow = '';
        });
    });

    // Scroll effect chung cho navbar và back-to-top
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Làm mờ navbar theo scroll
        if (navbar) navbar.style.backdropFilter = `blur(${Math.min(15, 8 + scrollY / 30)}px)`;

        // Giữ hiệu ứng 3D hover cho logo
        if (logo) logo.style.transform = 'translateZ(20px)';

        // Hiện/ẩn back-to-top khi scroll > 300px
        if (backToTop) backToTop.classList.toggle('active', scrollY > 300);
    });

    // Click back-to-top thì cuộn mượt về đầu trang
    if (backToTop) {
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /*************** Smooth Scroll & Active Nav Link ***************/
    // Khi click anchor, scroll mượt và highlight link active
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (!target) return;
            window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
            navLinks.forEach((l) => l.classList.remove('active'));
            anchor.classList.add('active');
        });
    });

    /*************** 3D Hover Utility (Card & Profile) ***************/
    // Tái sử dụng: áp dụng hiệu ứng 3D hover cho nhiều selector
    const apply3DHover = (selector, options = {}) => {
        document.querySelectorAll(selector).forEach((el) => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const angleX = (y - rect.height / 2) / 20;
                const angleY = (rect.width / 2 - x) / 20;

                // Xoay 3D & translateZ
                el.style.transform = `rotateX(${angleX}deg) rotateY(${angleY}deg) translateZ(${
                    options.z || 20
                }px)`;

                // Shadow (nếu có)
                if (options.shadow)
                    el.style.boxShadow = `${angleY * 2}px ${angleX * 2}px 30px rgba(0,0,0,0.2)`;

                // Glare (ánh sáng) cho profile
                if (options.glare) {
                    const glare = el.querySelector('.profile-glare');
                    if (glare)
                        glare.style.background = `linear-gradient(${
                            angleY * 10
                        }deg, rgba(255,255,255,0.3), rgba(255,255,255,0))`;
                }
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = 'translateZ(0)';
                if (options.shadow) el.style.boxShadow = '0 15px 35px rgba(0,0,0,0.1)';
                if (options.glare) {
                    const glare = el.querySelector('.profile-glare');
                    if (glare)
                        glare.style.background =
                            'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0))';
                }
            });
        });
    };
    apply3DHover('.card-3d', { shadow: true });
    apply3DHover('[data-js="profile-3d"]', { glare: true });

    /*************** Typing Effect ***************/
    const typingText = document.querySelector('.typing-text');
    const cursor = document.querySelector('.cursor');
    if (typingText && cursor) {
        const text = 'PHP Developer Intern';
        let i = 0,
            deleting = false;

        const typeWriter = () => {
            typingText.textContent = text.substring(0, i);
            cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';

            if (!deleting && i < text.length) {
                i++;
                setTimeout(typeWriter, 150);
            } else if (!deleting && i === text.length) {
                deleting = true;
                setTimeout(typeWriter, 2000);
            } else if (deleting && i > 0) {
                i--;
                setTimeout(typeWriter, 100);
            } else {
                deleting = false;
                setTimeout(typeWriter, 500);
            }
        };
        setTimeout(typeWriter, 1000);
    }

    /*************** Intersection Observer Animation ***************/
    // Quan sát các phần tử khi scroll vào view thì thêm class 'in-view'
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                const el = entry.target;
                el.classList.toggle('in-view', entry.isIntersecting);

                // Nếu là skill-progress, set width dựa vào data-width
                if (el.classList.contains('skill-progress'))
                    el.style.width = entry.isIntersecting ? el.dataset.width : '0';
            });
        },
        // 10% xuất hiện trong viewport
        { threshold: 0.1 }
    );
    document
        .querySelectorAll('.animate-on-scroll, .skill-progress, .timeline-item')
        .forEach((el) => observer.observe(el));

    /*************** Theme Toggle ***************/
    const navContainer = document.querySelector('.navbar .container');
    if (navContainer) {
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'theme-toggle';
        toggleBtn.className = 'btn btn-sm ms-3';
        toggleBtn.setAttribute('aria-label', 'Toggle theme');
        toggleBtn.innerHTML = '<i class="fas fa-moon theme-icon"></i>';
        toggleBtn.style.cssText = 'border:none;outline:none;background:transparent;box-shadow:none';
        navContainer.appendChild(toggleBtn);

        const updateIcon = (theme) =>
            (toggleBtn.querySelector('i').className =
                theme === 'dark' ? 'fas fa-sun theme-icon' : 'fas fa-moon theme-icon');

        const applyTheme = (theme) => {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            updateIcon(theme);
            loadParticles(theme);
        };

        toggleBtn.addEventListener('click', () =>
            applyTheme(
                document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
            )
        );

        const saved = localStorage.getItem('theme');
        applyTheme(saved || 'dark');

        // Nếu người dùng thay đổi theme hệ thống, update ngay (nếu chưa chọn theme)
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!saved) applyTheme(e.matches ? 'dark' : 'light');
        });
    }

    /*************** Load Particles Safe ***************/
    function loadParticles(theme) {
        if (typeof particlesJS === 'undefined') return;

        // Hủy particles trước nếu đã tồn tại
        if (window.pJSDom?.length) {
            try {
                pJSDom[0].pJS.fn.vendors.destroypJS();
                pJSDom = [];
            } catch (e) {
                console.warn(e);
            }
        }

        // Mobile không load
        if (window.innerWidth <= 768) return;

        const isDark = theme === 'dark';
        const colors = isDark
            ? ['#4D86E1', '#66A0F2', '#80BAFF']
            : ['#3482DB', '#4DA6FF', '#80CFFF'];
        const lineColor = isDark ? '#66CFFF' : '#3482DB';

        particlesJS('particles-js', {
            particles: {
                number: { value: 70, density: { enable: true, value_area: 800 } },
                color: { value: colors },
                shape: { type: 'circle' },
                opacity: { value: isDark ? 0.7 : 0.6, random: false },
                size: { value: 6, random: true },
                line_linked: {
                    enable: true,
                    distance: 130,
                    color: lineColor,
                    opacity: isDark ? 0.45 : 0.3,
                    width: isDark ? 1.2 : 1.4,
                },
            },
            interactivity: {
                events: {
                    onhover: { enable: true, mode: window.innerWidth > 1024 ? 'grab' : 'repulse' },
                    onclick: { enable: true, mode: 'bubble' },
                    resize: true,
                },
                modes: {
                    repulse: { distance: 100, duration: 0.4 },
                    bubble: { distance: 150, size: 6, duration: 0.3, opacity: 0.9 },
                    grab: { distance: 200, line_linked: { opacity: 0.6 } },
                },
            },
            retina_detect: true,
        });
    }
});
