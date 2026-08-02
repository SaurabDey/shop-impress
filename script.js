document.addEventListener('DOMContentLoaded', () => {
    
    // --- Mobile Menu Toggle ---
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.getElementById('nav-links');
    const navItems = document.querySelectorAll('.nav-link');

    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileToggle.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('bx-menu');
            icon.classList.add('bx-x');
        } else {
            icon.classList.remove('bx-x');
            icon.classList.add('bx-menu');
        }
    });

    // Close mobile menu when a link is clicked
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                icon.classList.remove('bx-x');
                icon.classList.add('bx-menu');
            }
        });
    });

    // --- Navbar Scrolled Effect ---
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Active Link Highlighting on Scroll ---
    const sections = document.querySelectorAll('section, header, footer');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').includes(current)) {
                item.classList.add('active');
            }
        });
    });

    // --- Scroll Reveal Animation ---
    const reveals = document.querySelectorAll('.reveal');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    reveals.forEach(reveal => {
        revealOnScroll.observe(reveal);
    });

    // Trigger reveal immediately for elements already in viewport on load
    setTimeout(() => {
        reveals.forEach(reveal => {
            const windowHeight = window.innerHeight;
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - 50) {
                reveal.classList.add('active');
            }
        });
    }, 100);

    // --- Multilingual Translation Logic ---
    const langModal = document.getElementById('language-modal');
    
    // Language Code to Name Mapping
    const langLabels = {
        en: 'English',
        hi: 'हिन्दी',
        bn: 'বাংলা'
    };

    // Update webpage elements based on selected language
    function setLanguage(lang) {
        document.documentElement.setAttribute('lang', lang);
        localStorage.setItem('pref_lang', lang);
        
        // Update all translatable text nodes
        const translatableElements = document.querySelectorAll('[data-i18n]');
        translatableElements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (typeof translations !== 'undefined' && translations[lang] && translations[lang][key] !== undefined) {
                element.innerHTML = translations[lang][key];
            }
        });

        // Update UI state for active labels and classes
        const activeLangText = document.querySelector('.active-lang-text');
        if (activeLangText) {
            activeLangText.textContent = langLabels[lang];
        }

        document.querySelectorAll('.lang-opt').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });

        document.querySelectorAll('.lang-mob-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });
    }

    // Modal Initial Setup
    const storedLang = localStorage.getItem('pref_lang');
    if (storedLang && typeof translations !== 'undefined' && translations[storedLang]) {
        setLanguage(storedLang);
        if (langModal) {
            langModal.classList.remove('active');
        }
    } else {
        if (langModal) {
            langModal.classList.add('active');
        }
    }

    // Event Listeners for Modal Selection Buttons
    document.querySelectorAll('.modal-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            setLanguage(lang);
            if (langModal) {
                langModal.classList.remove('active');
            }
        });
    });

    // Event Listeners for Desktop Dropdown Buttons
    document.querySelectorAll('.lang-opt').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = btn.getAttribute('data-lang');
            setLanguage(lang);
        });
    });

    // Event Listeners for Mobile Switcher Buttons
    document.querySelectorAll('.lang-mob-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = btn.getAttribute('data-lang');
            setLanguage(lang);
        });
    });

    // --- Rolling Announcements Carousel ---
    const container = document.querySelector('.announcement-slides-container');
    const slides = document.querySelectorAll('.announcement-slide');
    if (container && slides.length > 0) {
        let currentSlide = 0;
        setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            container.style.transform = `translateX(-${currentSlide * 100}%)`;
        }, 10000); // Rotate every 10 seconds
    }

    // --- Gallery Sequential Rolling & Non-gallery Carousels ---
    const allSliders = document.querySelectorAll('.product-image-slider');
    
    // Filter out gallery sliders and non-gallery sliders
    const gallerySliders = [];
    const nonGallerySliders = [];
    
    allSliders.forEach(slider => {
        const isGallery = slider.closest('#gallery') !== null;
        if (isGallery) {
            const slides = slider.querySelectorAll('.product-slide');
            if (slides.length > 1) {
                gallerySliders.push(slider);
            }
        } else {
            nonGallerySliders.push(slider);
        }
    });

    // 1. Setup Non-Gallery Carousels (Puja, Frames, Garlands, Digital Services) - Auto-roll independently
    nonGallerySliders.forEach(slider => {
        const wrapper = slider.querySelector('.product-slider-wrapper');
        const slides = slider.querySelectorAll('.product-slide');
        if (wrapper && slides.length > 0) {
            let currentSlide = 0;
            setInterval(() => {
                currentSlide = (currentSlide + 1) % slides.length;
                wrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
            }, 2000); // Auto-scroll every 2 seconds
        }
    });

    // 2. Setup Gallery Carousels (Sequential rolling section-by-section, click-to-navigate arrows)
    if (gallerySliders.length > 0) {
        let currentSliderIndex = 0;
        let activeRollInterval = null;
        let nextSliderTimeout = null;
        const sliderStates = new Map(); // Track current slide index for each gallery slider

        gallerySliders.forEach(slider => {
            sliderStates.set(slider, 0);
        });

        function clearTimers() {
            if (activeRollInterval) {
                clearInterval(activeRollInterval);
                activeRollInterval = null;
            }
            if (nextSliderTimeout) {
                clearTimeout(nextSliderTimeout);
                nextSliderTimeout = null;
            }
        }

        function rollActiveSlider() {
            clearTimers();
            if (gallerySliders.length === 0) return;

            const slider = gallerySliders[currentSliderIndex];
            const wrapper = slider.querySelector('.product-slider-wrapper');
            const slides = slider.querySelectorAll('.product-slide');
            
            let slideIndex = sliderStates.get(slider) || 0;

            activeRollInterval = setInterval(() => {
                slideIndex++;
                if (slideIndex < slides.length) {
                    sliderStates.set(slider, slideIndex);
                    wrapper.style.transform = `translateX(-${slideIndex * 100}%)`;
                } else {
                    // Reached the end of this section: return to 0 and pause
                    clearInterval(activeRollInterval);
                    activeRollInterval = null;
                    slideIndex = 0;
                    sliderStates.set(slider, slideIndex);
                    wrapper.style.transform = `translateX(-0%)`;

                    // Wait 3 seconds, then move to the next gallery section
                    nextSliderTimeout = setTimeout(() => {
                        currentSliderIndex = (currentSliderIndex + 1) % gallerySliders.length;
                        rollActiveSlider();
                    }, 3000);
                }
            }, 3000); // 3 seconds per slide while active
        }

        // Add chevron click navigation arrows and click listeners
        gallerySliders.forEach((slider, index) => {
            const wrapper = slider.querySelector('.product-slider-wrapper');
            const slides = slider.querySelectorAll('.product-slide');
            const container = slider.closest('.gallery-slider-container') || slider;

            // Create left arrow
            const prevBtn = document.createElement('button');
            prevBtn.className = 'gallery-nav-btn prev';
            prevBtn.innerHTML = "<i class='bx bx-chevron-left'></i>";

            // Create right arrow
            const nextBtn = document.createElement('button');
            nextBtn.className = 'gallery-nav-btn next';
            nextBtn.innerHTML = "<i class='bx bx-chevron-right'></i>";

            container.appendChild(prevBtn);
            container.appendChild(nextBtn);

            // Left arrow click handler
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Avoid triggering card details click
                clearTimers();

                let slideIndex = sliderStates.get(slider) || 0;
                slideIndex = (slideIndex - 1 + slides.length) % slides.length;
                sliderStates.set(slider, slideIndex);
                wrapper.style.transform = `translateX(-${slideIndex * 100}%)`;

                // Pause auto-rolling: wait 3 seconds of idle time, then roll the next section in sequence
                nextSliderTimeout = setTimeout(() => {
                    currentSliderIndex = (index + 1) % gallerySliders.length;
                    rollActiveSlider();
                }, 3000);
            });

            // Right arrow click handler
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                clearTimers();

                let slideIndex = sliderStates.get(slider) || 0;
                slideIndex = (slideIndex + 1) % slides.length;
                sliderStates.set(slider, slideIndex);
                wrapper.style.transform = `translateX(-${slideIndex * 100}%)`;

                // Pause auto-rolling: wait 3 seconds of idle time, then roll the next section in sequence
                nextSliderTimeout = setTimeout(() => {
                    currentSliderIndex = (index + 1) % gallerySliders.length;
                    rollActiveSlider();
                }, 3000);
            });
        });

        // Start the first sequential rolling after an initial 3 seconds on page load
        nextSliderTimeout = setTimeout(() => {
            rollActiveSlider();
        }, 3000);
    }
});
