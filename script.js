document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // Sticky Header Scroll Effect
    // ==========================================================================
    const navbar = document.querySelector('.navbar');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run once in case of page reload down the page

    // ==========================================================================
    // Mobile Navigation Menu Toggle
    // ==========================================================================
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    const toggleMenu = () => {
        navToggle.classList.toggle('open');
        navMenu.classList.toggle('open');
        
        // Prevent body scrolling when menu is open
        if (navMenu.classList.contains('open')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    };

    if (navToggle) {
        navToggle.addEventListener('click', toggleMenu);
    }

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu && navMenu.classList.contains('open')) {
                toggleMenu();
            }
        });
    });

    // ==========================================================================
    // Smart Smooth Scroll Navigation (Page to Page & Local)
    // ==========================================================================
    const getPageName = (path) => {
        const parts = path.split('/');
        return parts[parts.length - 1] || 'index.html';
    };

    const currentPath = window.location.pathname;
    const currentPage = getPageName(currentPath);

    const scrollToElement = (targetElement) => {
        const navbarHeight = navbar ? navbar.offsetHeight : 80;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = targetPosition - navbarHeight - 15; // Extra padding
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    };

    // Intercept clicks on links that are local hashes
    const allLinks = document.querySelectorAll('a');
    allLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        
        // Check if the link contains a hash
        if (href.includes('#')) {
            const [linkPagePath, hash] = href.split('#');
            const linkPage = getPageName(linkPagePath);
            
            // Check if linkPage matches currentPage (or both are home references)
            const isCurrentPageHome = currentPage === 'index.html' || currentPage === '' || currentPage === 'Sirij-Astro';
            const isLinkPageHome = linkPage === 'index.html' || linkPage === '';
            
            const isSamePage = (linkPage === currentPage) || (isCurrentPageHome && isLinkPageHome);
            
            if (isSamePage) {
                const targetElement = document.querySelector(`#${hash}`);
                if (targetElement) {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        scrollToElement(targetElement);
                        
                        // Update active state in nav menu
                        navLinks.forEach(nl => nl.classList.remove('active'));
                        if (link.classList.contains('nav-link')) {
                            link.classList.add('active');
                        }
                    });
                }
            }
        }
    });

    // Handle hash on page load (e.g., navigating to services.html#havan from home)
    if (window.location.hash) {
        setTimeout(() => {
            const hash = window.location.hash.substring(1);
            const targetElement = document.querySelector(`#${hash}`);
            if (targetElement) {
                scrollToElement(targetElement);
            }
        }, 300); // Short delay to let fonts/images layout load
    }

    // ==========================================================================
    // Intersection Observer for Active Navigation Highlight (Only on Home Page)
    // ==========================================================================
    const sections = document.querySelectorAll('section[id]');
    
    if (sections.length > 0 && (currentPage === 'index.html' || currentPage === '' || currentPage === 'Sirij-Astro')) {
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -60% 0px',
            threshold: 0
        };

        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.getAttribute('id');
                    
                    navLinks.forEach(link => {
                        const href = link.getAttribute('href');
                        if (href && href.includes(`#${sectionId}`)) {
                            link.classList.add('active');
                        } else {
                            link.classList.remove('active');
                        }
                    });
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        sections.forEach(section => observer.observe(section));
    }

    // ==========================================================================
    // Fade-in Reveal Animations on Scroll
    // ==========================================================================
    const revealElements = document.querySelectorAll(
        '.service-preview-card, .service-detail-card, .testimonials-slider-container, .about-grid, .hero-content, .hero-visual'
    );
    
    const revealOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.15
    };

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
    
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        
        revealObserver.observe(el);
    });

    // Inject styling rule for revealed elements
    const style = document.createElement('style');
    style.innerHTML = `
        .revealed {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
});
