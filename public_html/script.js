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

    document.querySelectorAll('a[href^="/index.html#"], a[href^="index.html#"]').forEach(link => {
        link.addEventListener("click", event => {
            const url = new URL(link.href, window.location.href);
            const targetId = url.hash.replace("#", "");

            if(!targetId){
                return;
            }

            event.preventDefault();
            setStoredScrollTarget(targetId);
            window.location.href = `${url.pathname}${url.hash}`;
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

    const partnersMarquees = Array.from(document.querySelectorAll(".partners-marquee"));

    if(partnersMarquees.length){
        const partnerTravelDurationMs = 20000;
        let partnersMarqueeFrame = 0;

        const updatePartnersMarqueeSpeed = () => {
            partnersMarquees.forEach(marquee => {
                const track = marquee.querySelector(".partners-track");
                const firstList = marquee.querySelector(".partners-list");
                const marqueeWidth = marquee.clientWidth;
                const trackLoopWidth = firstList?.scrollWidth ?? 0;

                if(!track || !marqueeWidth || !trackLoopWidth){
                    return;
                }

                const durationSeconds = (trackLoopWidth / marqueeWidth) * (partnerTravelDurationMs / 1000);
                track.style.setProperty("--partners-marquee-duration", `${durationSeconds.toFixed(2)}s`);
            });
        };

        const schedulePartnersMarqueeSpeedUpdate = () => {
            if(partnersMarqueeFrame){
                return;
            }

            partnersMarqueeFrame = window.requestAnimationFrame(() => {
                partnersMarqueeFrame = 0;
                updatePartnersMarqueeSpeed();
            });
        };

        if("ResizeObserver" in window){
            const partnersResizeObserver = new ResizeObserver(() => {
                schedulePartnersMarqueeSpeedUpdate();
            });

            partnersMarquees.forEach(marquee => {
                partnersResizeObserver.observe(marquee);

                const firstList = marquee.querySelector(".partners-list");

                if(firstList){
                    partnersResizeObserver.observe(firstList);
                }
            });
        }

        partnersMarquees.forEach(marquee => {
            const partnerImages = Array.from(marquee.querySelectorAll("img"));

            partnerImages.forEach(image => {
                if(image.complete){
                    return;
                }

                image.addEventListener("load", schedulePartnersMarqueeSpeedUpdate, { once: true });
                image.addEventListener("error", schedulePartnersMarqueeSpeedUpdate, { once: true });
            });
        });

        window.addEventListener("load", schedulePartnersMarqueeSpeedUpdate);
        window.addEventListener("resize", schedulePartnersMarqueeSpeedUpdate);
        schedulePartnersMarqueeSpeedUpdate();
    }

    const buildWhatsappUrl = message => {
        if(!whatsappNumber){
            return "";
        }

        return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message || whatsappMessage)}`;
    };

    const disableWhatsappLink = (link, opacity = "0.72") => {
        if(!link){
            return;
        }

        link.removeAttribute("target");
        link.removeAttribute("rel");
        link.setAttribute("aria-disabled", "true");
        link.title = "Adicione o n\u00famero do WhatsApp da empresa para ativar este bot\u00e3o.";
        link.style.opacity = opacity;
        link.style.cursor = "not-allowed";

        if(link.dataset.whatsappDisabledBound === "true"){
            return;
        }

        link.addEventListener("click", event => {
            if(link.getAttribute("aria-disabled") === "true"){
                event.preventDefault();
            }
        });

        link.dataset.whatsappDisabledBound = "true";
    };

    const enableWhatsappLink = link => {
        if(!link){
            return;
        }

        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
        link.removeAttribute("aria-disabled");
        link.removeAttribute("title");
        link.style.opacity = "";
        link.style.cursor = "";
    };

    const productCatalog = {
        "plano-saude": {
            description: "Ao contratar um plano de saude, voce garante acesso a consultas, exames e internacoes com mais rapidez e previsibilidade de custos. Nos analisamos seu perfil (individual, familiar ou empresarial) e indicamos as melhores operadoras, coberturas e redes credenciadas, sempre buscando o equilibrio entre preco e qualidade.",
            whatsappMessage: "Ola! Vim pelo site da Rebello Saude & Seguros e gostaria de falar sobre Plano de Saude."
        },
        "plano-odontologico": {
            description: "O plano odontologico cobre atendimentos como consultas, limpezas, urgencias e diversos procedimentos dentarios. E uma solucao acessivel para manter a saude bucal em dia, com ampla rede credenciada e sem surpresas no orcamento.",
            whatsappMessage: "Ola! Vim pelo site da Rebello Saude & Seguros e gostaria de falar sobre Plano Odontologico."
        },
        "cartoes-beneficios": {
            description: "Geralmente sao cartoes pre-pagos carregados pela empresa. As categorias (VA/VR) podem ser flexiveis, permitindo que o funcionario escolha onde usar o saldo.",
            whatsappMessage: "Ola! Vim pelo site da Rebello Saude & Seguros e gostaria de falar sobre Cartoes de Beneficios."
        },
        "seguro-vida": {
            description: "O seguro de vida garante protecao financeira para voce e sua familia em casos de imprevistos, como falecimento, invalidez ou doencas graves. Tambem pode incluir coberturas adicionais e assistencia em vida, trazendo mais tranquilidade no presente e seguranca para o futuro.",
            whatsappMessage: "Ola! Vim pelo site da Rebello Saude & Seguros e gostaria de falar sobre Seguro de Vida."
        },
        "seguro-viagem": {
            description: "O seguro viagem oferece suporte durante viagens nacionais ou internacionais, cobrindo despesas medicas, extravio de bagagem, cancelamentos e outros imprevistos. E essencial para viajar com tranquilidade e evitar altos custos fora do seu pais ou cidade.",
            whatsappMessage: "Ola! Vim pelo site da Rebello Saude & Seguros e gostaria de falar sobre Seguro Viagem."
        },
        "seguro-auto": {
            description: "O seguro auto protege seu veiculo contra roubos, furtos, colisoes e danos a terceiros. A cobertura e personalizada de acordo com seu perfil e uso do carro, garantindo protecao completa e assistencia 24h quando voce precisar.",
            whatsappMessage: "Ola! Vim pelo site da Rebello Saude & Seguros e gostaria de falar sobre Seguro Auto."
        },
        "seguro-residencial": {
            description: "O seguro residencial protege sua casa contra riscos como incendio, roubo, danos eletricos e eventos naturais. Alem disso, pode incluir servicos como chaveiro, eletricista e encanador, trazendo seguranca e praticidade no dia a dia.",
            whatsappMessage: "Ola! Vim pelo site da Rebello Saude & Seguros e gostaria de falar sobre Seguro Residencial."
        },
        "seguro-empresarial": {
            description: "O seguro empresarial protege o seu negocio contra diversos riscos, como incendios, roubos, danos eletricos e responsabilidade civil. As coberturas sao adaptadas ao tipo de empresa, garantindo continuidade das operacoes mesmo diante de imprevistos.",
            whatsappMessage: "Ola! Vim pelo site da Rebello Saude & Seguros e gostaria de falar sobre Seguro Empresarial."
        },
        "seguro-responsabilidade-civil-profissional": {
            description: "Protege empresas e profissionais liberais contra prejuizos financeiros causados a terceiros por falhas, negligencia ou omissoes involuntarias na prestacao de servicos. Tambem conhecido como seguro do profissional, cobre custos de defesa judicial, acordos e indenizacoes.",
            whatsappMessage: "Ola! Vim pelo site da Rebello Saude & Seguros e gostaria de falar sobre Seguro de Responsabilidade Civil Profissional."
        },
        "seguro-condominio": {
            description: "O seguro condominio e obrigatorio e protege a estrutura do predio contra danos como incendios, explosoes e outros riscos. Tambem pode incluir coberturas adicionais para areas comuns e responsabilidade civil, garantindo mais seguranca para sindicos e moradores.",
            whatsappMessage: "Ola! Vim pelo site da Rebello Saude & Seguros e gostaria de falar sobre Seguro Condominio."
        }
    };

    const productCards = Array.from(document.querySelectorAll(".product-card"));
    const productDetailSection = document.getElementById("produto-detalhe");
    const productDetailIcon = document.getElementById("product-detail-icon");
    const productDetailTitle = document.getElementById("product-detail-title");
    const productDetailSummary = document.getElementById("product-detail-summary");
    const productDetailDescription = document.getElementById("product-detail-description");
    const productDetailContactCopy = document.getElementById("product-detail-contact-copy");
    const productDetailWhatsapp = document.getElementById("product-detail-whatsapp");

    if(productCards.length && productDetailSection && productDetailIcon && productDetailTitle && productDetailSummary && productDetailDescription && productDetailContactCopy && productDetailWhatsapp){
        const openProductDetail = productCard => {
            const productKey = productCard.dataset.productKey || "";
            const productCopy = productCatalog[productKey] || {};
            const productImage = productCard.querySelector(".circle img");
            const productTitle = productCard.querySelector(".product-card-title")?.textContent.trim() || "Produto";
            const productSummary = productCard.querySelector(".product-card-summary")?.textContent.trim() || "";
            const productMessage = productCopy.whatsappMessage || `Ola! Vim pelo site da Rebello Saude & Seguros e gostaria de falar sobre ${productTitle}.`;

            if(productImage){
                productDetailIcon.src = productImage.getAttribute("src") || productDetailIcon.src;
            }

            productDetailTitle.textContent = productTitle;
            productDetailSummary.textContent = productSummary;
            productDetailDescription.textContent = productCopy.description || `Esta area foi preparada para receber um conteudo exclusivo sobre ${productTitle}. Enquanto isso, a equipe da Rebello pode orientar voce pelo WhatsApp.`;
            productDetailContactCopy.textContent = `Fale com a equipe da Rebello para receber orientacao personalizada sobre ${productTitle}.`;

            if(whatsappNumber){
                enableWhatsappLink(productDetailWhatsapp);
                productDetailWhatsapp.href = buildWhatsappUrl(productMessage);
            } else {
                disableWhatsappLink(productDetailWhatsapp, "0.72");
            }

            productCards.forEach(card => {
                const isActive = card === productCard;
                card.classList.toggle("is-active", isActive);
                card.setAttribute("aria-expanded", String(isActive));
            });

            productDetailSection.hidden = false;

            window.requestAnimationFrame(() => {
                scrollToSection(productDetailSection);

                try{
                    productDetailSection.focus({ preventScroll: true });
                } catch(error){
                    productDetailSection.focus();
                }
            });
        };

        productCards.forEach(card => {
            card.addEventListener("click", () => {
                openProductDetail(card);
            });
        });
    }

    const specialistCtas = Array.from(document.querySelectorAll(".specialist-cta")).filter(link => !link.classList.contains("whatsapp"));
    const whatsapp = document.querySelector(".whatsapp");

    if(whatsappNumber){
        const whatsappUrl = buildWhatsappUrl(whatsappMessage);

        specialistCtas.forEach(link => {
            enableWhatsappLink(link);
            link.href = whatsappUrl;
        });

        if(whatsapp){
            enableWhatsappLink(whatsapp);
            whatsapp.href = whatsappUrl;
        }
    } else {
        specialistCtas.forEach(link => {
            disableWhatsappLink(link, "0.72");
        });

        if(whatsapp){
            disableWhatsappLink(whatsapp, "0.88");
        }
    }
});
