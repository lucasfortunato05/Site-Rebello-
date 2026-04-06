document.addEventListener("DOMContentLoaded", () => {
    const whatsappNumber = "555125005310";
    const whatsappMessage = "Ol\u00e1! Vim pelo site da Rebello Sa\u00fade & Seguros e gostaria de falar com um especialista sobre uma cota\u00e7\u00e3o.";
    const crossPageScrollKey = "rebello-scroll-target";
    const navbar = document.querySelector(".navbar");
    const navToggle = document.querySelector(".nav-toggle");
    const mobileNavMedia = window.matchMedia("(max-width: 760px)");
    const reducedMotionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
    const navLinks = Array.from(document.querySelectorAll('.menu a[href^="#"]'));
    const sections = navLinks
        .map(link => document.querySelector(link.getAttribute("href")))
        .filter(Boolean);

    const getStoredScrollTarget = () => {
        try{
            return window.sessionStorage.getItem(crossPageScrollKey);
        } catch(error){
            return "";
        }
    };

    const setStoredScrollTarget = targetId => {
        try{
            window.sessionStorage.setItem(crossPageScrollKey, targetId);
        } catch(error){
            // Ignore storage restrictions and fall back to the URL hash.
        }
    };

    const clearStoredScrollTarget = () => {
        try{
            window.sessionStorage.removeItem(crossPageScrollKey);
        } catch(error){
            // Ignore storage restrictions.
        }
    };

    const getHashScrollTarget = () => {
        const rawHash = window.location.hash.replace("#", "");

        if(!rawHash){
            return "";
        }

        try{
            return decodeURIComponent(rawHash);
        } catch(error){
            return rawHash;
        }
    };

    const closeMenu = () => {
        if(!navbar || !navToggle){
            return;
        }

        navbar.classList.remove("is-open");
        document.body.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Abrir menu de navega\u00e7\u00e3o");
    };

    const openMenu = () => {
        if(!navbar || !navToggle){
            return;
        }

        navbar.classList.add("is-open");
        document.body.classList.add("nav-open");
        navToggle.setAttribute("aria-expanded", "true");
        navToggle.setAttribute("aria-label", "Fechar menu de navega\u00e7\u00e3o");
    };

    if(navbar && navToggle){
        navToggle.addEventListener("click", event => {
            event.stopPropagation();

            if(navbar.classList.contains("is-open")){
                closeMenu();
            } else {
                openMenu();
            }
        });

        navbar.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                if(mobileNavMedia.matches){
                    closeMenu();
                }
            });
        });

        document.addEventListener("click", event => {
            if(!mobileNavMedia.matches || !navbar.classList.contains("is-open")){
                return;
            }

            if(!navbar.contains(event.target)){
                closeMenu();
            }
        });

        document.addEventListener("keydown", event => {
            if(event.key === "Escape"){
                closeMenu();
            }
        });

        const handleMobileNavChange = event => {
            if(!event.matches){
                closeMenu();
            }
        };

        if(typeof mobileNavMedia.addEventListener === "function"){
            mobileNavMedia.addEventListener("change", handleMobileNavChange);
        } else {
            mobileNavMedia.addListener(handleMobileNavChange);
        }
    }

    const getNavbarHeight = () => navbar ? navbar.offsetHeight : 0;
    const scrollToSection = (target, behavior = "smooth") => {
        if(!target){
            return;
        }

        const top = target.id === "inicio"
            ? 0
            : target.getBoundingClientRect().top + window.scrollY - getNavbarHeight();

        window.scrollTo({
            top: Math.max(0, top),
            behavior
        });

        if(target.id){
            setActiveLink(target.id);
        }
    };

    const setActiveLink = sectionId => {
        const hasMatchingLink = navLinks.some(link => link.getAttribute("href") === `#${sectionId}`);

        if(!hasMatchingLink){
            return;
        }

        navLinks.forEach(link => {
            const isActive = link.getAttribute("href") === `#${sectionId}`;

            link.classList.toggle("gold", isActive);

            if(isActive){
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    };

    const updateActiveSection = () => {
        if(!sections.length){
            return;
        }

        const referencePoint = window.scrollY + getNavbarHeight() + 12;
        let activeSection = sections[0];

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;

            if(referencePoint >= sectionTop && referencePoint < sectionBottom){
                activeSection = section;
            }
        });

        const lastSection = sections[sections.length - 1];

        if(referencePoint >= lastSection.offsetTop){
            activeSection = lastSection;
        }

        setActiveLink(activeSection.id);
    };

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function(e) {
            const targetSelector = this.getAttribute("href");

            if(!targetSelector || targetSelector === "#" || !targetSelector.startsWith("#")){
                return;
            }

            const target = document.querySelector(targetSelector);

            if(target){
                e.preventDefault();
                scrollToSection(target);
            }
        });
    });

    document.querySelectorAll('a[href^="index.html#"]').forEach(link => {
        link.addEventListener("click", event => {
            const url = new URL(link.href, window.location.href);
            const targetId = url.hash.replace("#", "");

            if(!targetId){
                return;
            }

            event.preventDefault();
            setStoredScrollTarget(targetId);
            window.location.href = `index.html#${targetId}`;
        });
    });

    const initialTargetId = getStoredScrollTarget() || getHashScrollTarget();

    if(initialTargetId){
        const initialTarget = document.getElementById(initialTargetId);
        let initialScrollHandled = false;
        const runInitialScroll = () => {
            if(initialScrollHandled || !initialTarget){
                return;
            }

            initialScrollHandled = true;
            scrollToSection(initialTarget, "auto");
            clearStoredScrollTarget();
        };

        if(initialTarget){
            requestAnimationFrame(() => {
                requestAnimationFrame(runInitialScroll);
            });

            window.addEventListener("load", runInitialScroll, { once: true });
        } else {
            clearStoredScrollTarget();
        }
    }

    const reveals = Array.from(document.querySelectorAll(".reveal"));
    document.querySelectorAll("[data-stagger]").forEach(group => {
        Array.from(group.querySelectorAll("[data-stagger-item]")).forEach((item, index) => {
            item.style.setProperty("--stagger-delay", `${index * 120}ms`);
        });
    });

    const revealElement = element => {
        if(element.classList.contains("show")){
            return;
        }

        element.classList.add("show");
        element.querySelectorAll("[data-stagger-item]").forEach(item => {
            item.classList.add("is-stagger-visible");
        });
    };

    const revealOnScroll = () => {
        if(reducedMotionMedia.matches){
            reveals.forEach(el => {
                revealElement(el);
            });

            return;
        }

        reveals.forEach(el => {
            const top = el.getBoundingClientRect().top;

            if(top < window.innerHeight * 0.86){
                revealElement(el);
            }
        });
    };

    if(!reducedMotionMedia.matches && "IntersectionObserver" in window){
        const revealObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if(!entry.isIntersecting){
                    return;
                }

                revealElement(entry.target);
                revealObserver.unobserve(entry.target);
            });
        }, {
            threshold: 0.16,
            rootMargin: "0px 0px -8% 0px"
        });

        reveals.forEach(el => {
            revealObserver.observe(el);
        });
    } else {
        revealOnScroll();
    }

    const handlePageScroll = () => {
        updateActiveSection();
    };

    window.addEventListener("scroll", handlePageScroll, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    revealOnScroll();
    updateActiveSection();

    const heroSlider = document.querySelector(".hero-slider");
    const heroSlides = Array.from(document.querySelectorAll(".hero-slide"));
    const heroIndicators = Array.from(document.querySelectorAll(".hero-slider-indicator"));

    if(heroSlides.length){
        let currentHeroSlide = Math.max(heroSlides.findIndex(slide => slide.classList.contains("is-active")), 0);
        let heroSliderTimer = null;

        const setHeroSlide = nextIndex => {
            heroSlides.forEach((slide, index) => {
                const isActive = index === nextIndex;
                slide.classList.toggle("is-active", isActive);
                slide.setAttribute("aria-hidden", String(!isActive));
            });

            heroIndicators.forEach((indicator, index) => {
                const isActive = index === nextIndex;
                indicator.classList.toggle("is-active", isActive);
                indicator.setAttribute("aria-pressed", String(isActive));
            });

            currentHeroSlide = nextIndex;
        };

        const stopHeroAutoplay = () => {
            if(heroSliderTimer){
                window.clearInterval(heroSliderTimer);
                heroSliderTimer = null;
            }
        };

        const startHeroAutoplay = () => {
            stopHeroAutoplay();

            if(heroSlides.length < 2){
                return;
            }

            const heroAutoplayDelay = reducedMotionMedia.matches ? 7000 : 5200;

            heroSliderTimer = window.setInterval(() => {
                setHeroSlide((currentHeroSlide + 1) % heroSlides.length);
            }, heroAutoplayDelay);
        };

        heroIndicators.forEach((indicator, index) => {
            indicator.addEventListener("click", () => {
                setHeroSlide(index);
                startHeroAutoplay();
            });
        });

        const handleReducedMotionChange = () => {
            startHeroAutoplay();
        };

        if(typeof reducedMotionMedia.addEventListener === "function"){
            reducedMotionMedia.addEventListener("change", handleReducedMotionChange);
        } else {
            reducedMotionMedia.addListener(handleReducedMotionChange);
        }

        setHeroSlide(currentHeroSlide);
        startHeroAutoplay();
        heroSlider?.classList.add("is-enhanced");
    }

    const banner = document.querySelector(".banner");
    const bannerTrack = document.querySelector(".banner-track");

    if(banner && bannerTrack){
        const slides = Array.from(bannerTrack.children);
        const totalSlides = slides.length;
        const step = 100 / totalSlides;
        const lastSlideIndex = totalSlides - 1;
        const visualSlideCount = totalSlides > 1 ? totalSlides - 1 : totalSlides;
        const bannerTransitionDuration = 1100;
        let currentSlide = 0;
        let bannerSliderTimer = null;
        let bannerResetTimer = null;

        bannerTrack.style.width = `${totalSlides * 100}%`;
        slides.forEach(slide => {
            slide.style.flex = `0 0 ${100 / totalSlides}%`;
        });

        const shouldAnimateBanner = () => !reducedMotionMedia.matches;
        const clearBannerReset = () => {
            if(bannerResetTimer){
                window.clearTimeout(bannerResetTimer);
                bannerResetTimer = null;
            }
        };

        const moveBanner = (withTransition = shouldAnimateBanner()) => {
            bannerTrack.style.transition = withTransition ? `transform ${bannerTransitionDuration}ms ease-in-out` : "none";
            bannerTrack.style.transform = `translateX(-${currentSlide * step}%)`;
        };

        const resetBannerToStart = () => {
            clearBannerReset();
            currentSlide = 0;
            moveBanner(false);
        };

        const scheduleBannerReset = () => {
            clearBannerReset();

            if(!shouldAnimateBanner() || currentSlide !== lastSlideIndex){
                return;
            }

            // Keep the loop resilient even if the browser throttles or skips transition events.
            bannerResetTimer = window.setTimeout(() => {
                resetBannerToStart();
            }, bannerTransitionDuration + 80);
        };

        const stopBannerAutoplay = () => {
            if(bannerSliderTimer){
                window.clearInterval(bannerSliderTimer);
                bannerSliderTimer = null;
            }

            clearBannerReset();
        };

        const nextBannerSlide = () => {
            if(visualSlideCount < 2){
                return;
            }

            if(shouldAnimateBanner()){
                if(currentSlide >= lastSlideIndex){
                    resetBannerToStart();
                }

                currentSlide += 1;
                moveBanner(true);
                scheduleBannerReset();
                return;
            }

            currentSlide = (currentSlide + 1) % visualSlideCount;
            moveBanner(false);
        };

        const startBannerAutoplay = () => {
            stopBannerAutoplay();

            if(visualSlideCount < 2){
                return;
            }

            const bannerAutoplayDelay = reducedMotionMedia.matches ? 9500 : 8000;

            bannerSliderTimer = window.setInterval(nextBannerSlide, bannerAutoplayDelay);
        };

        const handleBannerVisibilityChange = () => {
            if(document.hidden){
                stopBannerAutoplay();
                return;
            }

            if(currentSlide >= lastSlideIndex){
                resetBannerToStart();
            } else {
                moveBanner(false);
            }

            startBannerAutoplay();
        };

        const handleBannerReducedMotionChange = () => {
            resetBannerToStart();
            startBannerAutoplay();
        };

        document.addEventListener("visibilitychange", handleBannerVisibilityChange);

        if(typeof reducedMotionMedia.addEventListener === "function"){
            reducedMotionMedia.addEventListener("change", handleBannerReducedMotionChange);
        } else {
            reducedMotionMedia.addListener(handleBannerReducedMotionChange);
        }

        moveBanner(false);
        startBannerAutoplay();
    }

    const specialistCtas = document.querySelectorAll(".specialist-cta");
    const whatsapp = document.querySelector(".whatsapp");

    if(whatsappNumber){
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

        specialistCtas.forEach(link => {
            link.href = whatsappUrl;
        });

        if(whatsapp){
            whatsapp.href = whatsappUrl;
        }
    } else {
        specialistCtas.forEach(link => {
            link.removeAttribute("target");
            link.removeAttribute("rel");
            link.setAttribute("aria-disabled", "true");
            link.title = "Adicione o n\u00famero do WhatsApp da empresa para ativar este bot\u00e3o.";
            link.style.opacity = "0.72";
            link.style.cursor = "not-allowed";

            link.addEventListener("click", event => {
                event.preventDefault();
            });
        });

        if(whatsapp){
            whatsapp.removeAttribute("target");
            whatsapp.removeAttribute("rel");
            whatsapp.setAttribute("aria-disabled", "true");
            whatsapp.title = "Adicione o n\u00famero do WhatsApp da empresa para ativar este bot\u00e3o.";
            whatsapp.style.opacity = "0.88";
            whatsapp.style.cursor = "not-allowed";

            whatsapp.addEventListener("click", event => {
                event.preventDefault();
            });
        }
    }
});
