/* ==========================================================================
   RUSHIKESH JADHAV - HIGH STANDARD MECHATRONICS PORTFOLIO INTERACTION ENGINE
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    
    // ----------------------------------------------------------------------
    // 1. BACKGROUND PARTICLE CANVAS SIMULATION
    // ----------------------------------------------------------------------
    const canvas = document.getElementById("bg-canvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const particles = [];
        const particleCount = Math.min(Math.floor(width / 18), 75);

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.radius = Math.random() * 1.8 + 0.8;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(0, 242, 254, 0.4)";
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0, 242, 254, ${0.15 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(animateCanvas);
        }

        animateCanvas();

        window.addEventListener("resize", () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });
    }


    // ----------------------------------------------------------------------
    // 2. VIEW MODE SWITCHER (FUTURISTIC WEB <-> 3D FLIPBOOK)
    // ----------------------------------------------------------------------
    const futuristicView = document.getElementById("futuristic-view");
    const flipbookView = document.getElementById("flipbook-view");
    const viewSwitchBtn = document.getElementById("view-switch-btn");
    const heroFlipbookBtn = document.getElementById("hero-flipbook-btn");
    const bookBackToWebBtn = document.getElementById("book-back-to-web");
    const switchText = viewSwitchBtn ? viewSwitchBtn.querySelector(".switch-text") : null;

    let isFlipbookMode = false;

    function showToast(message) {
        const container = document.getElementById("toast-container");
        if (!container) return;

        const toast = document.createElement("div");
        toast.className = "toast";
        toast.innerHTML = `<i class='bx bx-check-circle' style='color: var(--accent-cyan); font-size: 1.3rem;'></i> <span>${message}</span>`;
        
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transform = "translateX(100%)";
            toast.style.transition = "all 0.3s ease-out";
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    function toggleViewMode(targetMode) {
        if (targetMode === "flipbook") {
            isFlipbookMode = true;
            futuristicView.classList.remove("active");
            flipbookView.classList.add("active");
            if (switchText) switchText.textContent = "Futuristic View";
            if (viewSwitchBtn) {
                const icon = viewSwitchBtn.querySelector("i");
                if (icon) icon.className = "bx bx-laptop";
            }
            window.scrollTo({ top: 0, behavior: "smooth" });
            showToast("Switched to 3D Flipbook View 📖");
        } else {
            isFlipbookMode = false;
            flipbookView.classList.remove("active");
            futuristicView.classList.add("active");
            if (switchText) switchText.textContent = "3D Flipbook";
            if (viewSwitchBtn) {
                const icon = viewSwitchBtn.querySelector("i");
                if (icon) icon.className = "bx bx-book-open";
            }
            window.scrollTo({ top: 0, behavior: "smooth" });
            showToast("Switched to Futuristic View ⚡");
        }
    }

    if (viewSwitchBtn) {
        viewSwitchBtn.addEventListener("click", (e) => {
            e.preventDefault();
            toggleViewMode(isFlipbookMode ? "futuristic" : "flipbook");
        });
    }

    if (heroFlipbookBtn) {
        heroFlipbookBtn.addEventListener("click", (e) => {
            e.preventDefault();
            toggleViewMode("flipbook");
        });
    }

    if (bookBackToWebBtn) {
        bookBackToWebBtn.addEventListener("click", (e) => {
            e.preventDefault();
            toggleViewMode("futuristic");
        });
    }


    // ----------------------------------------------------------------------
    // 3. NAVIGATION & MOBILE MENU
    // ----------------------------------------------------------------------
    const navToggle = document.getElementById("nav-toggle");
    const navMenu = document.getElementById("nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");

    if (navToggle && navMenu) {
        navToggle.addEventListener("click", () => {
            navMenu.classList.toggle("active");
        });
    }

    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            if (isFlipbookMode) {
                toggleViewMode("futuristic");
            }
            if (navMenu) navMenu.classList.remove("active");
            navLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");
        });
    });


    // ----------------------------------------------------------------------
    // 4. ANIMATED TYPING TEXT IN HERO
    // ----------------------------------------------------------------------
    const typingTextEl = document.getElementById("typing-text");
    if (typingTextEl) {
        const roles = [
            "Mechatronics Engineer",
            "Tata Motors Trainee",
            "1000T Press Machine Specialist",
            "CATIA V5 3D CAD Designer",
            "CNC Press Brake Operator"
        ];
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function typeEffect() {
            const currentRole = roles[roleIndex];
            
            if (isDeleting) {
                typingTextEl.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingTextEl.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 40 : 80;

            if (!isDeleting && charIndex === currentRole.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typeSpeed = 500;
            }

            setTimeout(typeEffect, typeSpeed);
        }

        typeEffect();
    }


    // ----------------------------------------------------------------------
    // 5. STATS COUNTER ANIMATION
    // ----------------------------------------------------------------------
    const statNumbers = document.querySelectorAll(".stat-number");
    let animatedStats = false;

    function checkStatsScroll() {
        const statsSection = document.getElementById("stats");
        if (!statsSection || animatedStats) return;

        const rect = statsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            animatedStats = true;
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute("data-target"), 10);
                let count = 0;
                const speed = target > 500 ? target / 50 : target / 20;

                const updateCount = () => {
                    count += speed;
                    if (count < target) {
                        stat.textContent = Math.floor(count);
                        setTimeout(updateCount, 30);
                    } else {
                        stat.textContent = target;
                    }
                };
                updateCount();
            });
        }
    }

    window.addEventListener("scroll", checkStatsScroll);
    checkStatsScroll();


    // ----------------------------------------------------------------------
    // 6. TIMELINE TAB SWITCHING
    // ----------------------------------------------------------------------
    const timelineTabs = document.querySelectorAll(".timeline-tab");
    const timelineContents = document.querySelectorAll(".timeline-content");

    timelineTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const tabTarget = tab.getAttribute("data-tab");
            
            timelineTabs.forEach(t => t.classList.remove("active"));
            timelineContents.forEach(c => c.classList.remove("active"));

            tab.classList.add("active");
            const activeContent = document.getElementById(`tab-${tabTarget}`);
            if (activeContent) activeContent.classList.add("active");
        });
    });


    // ----------------------------------------------------------------------
    // 7. COMPETENCIES FILTERING & MODAL POPUPS
    // ----------------------------------------------------------------------
    const filterBtns = document.querySelectorAll(".filter-btn");
    const compCards = document.querySelectorAll(".comp-card");

    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const filter = btn.getAttribute("data-filter");
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            compCards.forEach(card => {
                const category = card.getAttribute("data-category");
                if (filter === "all" || category === filter) {
                    card.style.display = "flex";
                } else {
                    card.style.display = "none";
                }
            });
        });
    });

    const competencyData = {
        "modal-quality": {
            title: "Quality Inspection & Zero-Defect Control",
            body: `
                <p><strong>Quality Department Training @ Tata Motors CVBU Pune:</strong></p>
                <ul style="margin-top:10px; line-height: 1.8;">
                    <li>• Inspecting manufactured components for strict quality compliance and tolerance standards.</li>
                    <li>• Monitoring production lines for defect prevention and zero-defect manufacturing.</li>
                    <li>• Documenting quality inspection checks, non-conformities, and corrective action reports.</li>
                    <li>• Quality inspection of CNC Press Brake and 300T/500T/1000T Forming Press operations.</li>
                </ul>
            `
        },
        "modal-dim": {
            title: "Dimensional Accuracy Verification & Proto Shop Audits",
            body: `
                <p><strong>Proto Shop & Production Quality Audits:</strong></p>
                <ul style="margin-top:10px; line-height: 1.8;">
                    <li>• Dimensional accuracy verification of complex sheet metal parts in Proto shop.</li>
                    <li>• Precision measurement using vernier calipers, micrometers, height gauges, and fixtures.</li>
                    <li>• Participating in production process quality audits to ensure line stability.</li>
                    <li>• Identifying and reporting non-conformities with high attention to detail.</li>
                </ul>
            `
        },
        "modal-sop": {
            title: "SOP Adherence & Leadership Qualities",
            body: `
                <p><strong>Standard Operating Procedure (SOP) & Workplace Excellence:</strong></p>
                <ul style="margin-top:10px; line-height: 1.8;">
                    <li>• Strict adherence to Standard Operating Procedures (SOPs) for quality excellence.</li>
                    <li>• Classroom and shop floor training in leadership, communication, and presentation skills.</li>
                    <li>• Verification of assembly part precision and tool maintenance for high-accuracy production.</li>
                    <li>• Active implementation of 5S methodologies across shop floor lines.</li>
                </ul>
            `
        },
        "modal-press": {
            title: "Forming Press Machine Operation (300T, 500T, 1000T)",
            body: `
                <p><strong>Hands-on Industrial Experience at Tata Motors CVBU Pune:</strong></p>
                <ul style="margin-top:10px; line-height: 1.8;">
                    <li>• Operating high-tonnage hydraulic and mechanical forming presses rated up to 1000 Tons.</li>
                    <li>• Performing die setup, alignment, pressure calibration, and shut-height adjustments.</li>
                    <li>• Sheet metal deep drawing, blanking, trimming, and piercing process execution.</li>
                    <li>• Visual inspection of sheet metal panels for burrs, wrinkles, cracks, and spring-back defects.</li>
                    <li>• Adherence to line cycle times and component throughput targets.</li>
                </ul>
            `
        },
        "modal-cnc": {
            title: "CNC Press Brake Machine Operation",
            body: `
                <p><strong>Precision Bending & Prototype Shaping:</strong></p>
                <ul style="margin-top:10px; line-height: 1.8;">
                    <li>• Setting CNC parameters, back-gauge positions, and tooling angles.</li>
                    <li>• Executing multi-stage precision sheet metal bending operations based on part blueprints.</li>
                    <li>• Material thickness compensation and bend allowance calculations.</li>
                    <li>• Prototype component fabrication with high dimensional tolerance accuracy.</li>
                </ul>
            `
        },
        "modal-catia": {
            title: "CATIA V5 3D CAD Modeling & Engineering Drawing",
            body: `
                <p><strong>CAD & Design Visualization:</strong></p>
                <ul style="margin-top:10px; line-height: 1.8;">
                    <li>• Part design workbench modeling for mechanical components and sheet metal brackets.</li>
                    <li>• Reading and interpreting complex first/third-angle engineering drawings.</li>
                    <li>• Understanding GD&T (Geometric Dimensioning and Tolerancing) symbols and shop standards.</li>
                    <li>• Basic surface modeling and 3D assembly visualization.</li>
                </ul>
            `
        },
        "modal-safety": {
            title: "Industrial Safety, EHS & 5S Implementation",
            body: `
                <p><strong>Shop Floor Safety Standards:</strong></p>
                <ul style="margin-top:10px; line-height: 1.8;">
                    <li>• Strict implementation of 5S (Sort, Set in order, Shine, Standardize, Sustain).</li>
                    <li>• Compliance with Tata Motors Environment, Health & Safety (EHS) policies.</li>
                    <li>• Fire safety protocols, emergency stop procedures, and hazard identification.</li>
                    <li>• Daily PPE (Personal Protective Equipment) compliance audits.</li>
                </ul>
            `
        }
    };

    const compModal = document.getElementById("competency-modal");
    const compModalTitle = document.getElementById("comp-modal-title");
    const compModalBody = document.getElementById("comp-modal-body");
    const closeCompModal = document.getElementById("close-comp-modal");

    document.querySelectorAll(".comp-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const key = btn.getAttribute("data-modal");
            if (competencyData[key] && compModal) {
                compModalTitle.textContent = competencyData[key].title;
                compModalBody.innerHTML = competencyData[key].body;
                compModal.classList.add("active");
            }
        });
    });

    if (closeCompModal) {
        closeCompModal.addEventListener("click", () => {
            if (compModal) compModal.classList.remove("active");
        });
    }

    document.querySelectorAll(".modal-btn-close").forEach(btn => {
        btn.addEventListener("click", () => {
            if (compModal) compModal.classList.remove("active");
        });
    });


    // ----------------------------------------------------------------------
    // 8. RESUME VIEWER MODAL
    // ----------------------------------------------------------------------
    const resumeModal = document.getElementById("resume-modal");
    const openResumeBtn = document.getElementById("open-resume-btn");
    const closeResumeModal = document.getElementById("close-resume-modal");

    if (openResumeBtn && resumeModal) {
        openResumeBtn.addEventListener("click", () => {
            resumeModal.classList.add("active");
        });
    }

    const menuResumeLink = document.getElementById("menu-resume-link");
    if (menuResumeLink && resumeModal) {
        menuResumeLink.addEventListener("click", (e) => {
            e.preventDefault();
            if (navMenu) navMenu.classList.remove("active");
            resumeModal.classList.add("active");
        });
    }

    const heroResumeBtn = document.getElementById("hero-resume-btn");
    if (heroResumeBtn && resumeModal) {
        heroResumeBtn.addEventListener("click", (e) => {
            e.preventDefault();
            resumeModal.classList.add("active");
        });
    }

    if (closeResumeModal && resumeModal) {
        closeResumeModal.addEventListener("click", () => {
            resumeModal.classList.remove("active");
        });
    }

    window.addEventListener("click", (e) => {
        if (e.target === compModal) compModal.classList.remove("active");
        if (e.target === resumeModal) resumeModal.classList.remove("active");
    });


    // ----------------------------------------------------------------------
    // 9. COPY TO CLIPBOARD & FORM HANDLING
    // ----------------------------------------------------------------------
    document.querySelectorAll(".copy-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const textToCopy = btn.getAttribute("data-copy");
            navigator.clipboard.writeText(textToCopy).then(() => {
                showToast(`Copied "${textToCopy}" to clipboard!`);
            });
        });
    });

    const contactForm = document.getElementById("portfolio-contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            showToast("Thank you! Your message has been sent successfully. 🚀");
            contactForm.reset();
        });
    }

    const bookContactForm = document.getElementById("book-contact-form");
    if (bookContactForm) {
        bookContactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            showToast("Message sent from 3D Flipbook! 📩");
            bookContactForm.reset();
        });
    }


    // ----------------------------------------------------------------------
    // 10. REALISTIC 3D FLIPBOOK ENGINE
    // ----------------------------------------------------------------------
    const pageTurnBtn = document.querySelectorAll(".nextprev-btn");
    const pages = document.querySelectorAll(".book-page.page-right");
    const totalPages = pages.length;

    const btnNextPage = document.getElementById("btn-next-page");
    const btnPrevPage = document.getElementById("btn-prev-page");
    const soundToggleBtn = document.getElementById("sound-toggle-btn");
    const bookResetBtn = document.getElementById("book-reset-btn");
    const contactMeBtn = document.querySelector(".btn.contact-me");
    const backProfileButton = document.querySelector(".back-profile");

    let soundEnabled = true;

    function playFlipSound() {
        if (!soundEnabled) return;
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = "sine";
            osc.frequency.setValueAtTime(150, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.15);

            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.15);
        } catch (err) {}
    }

    if (soundToggleBtn) {
        soundToggleBtn.addEventListener("click", () => {
            soundEnabled = !soundEnabled;
            soundToggleBtn.classList.toggle("active", soundEnabled);
            showToast(soundEnabled ? "Page Sound Enabled 🔊" : "Page Sound Muted 🔇");
        });
    }

    function setInitialBookState() {
        const coverRight = document.querySelector(".cover.cover-right");
        const pageLeft = document.querySelector(".book-page.page-left");

        if (coverRight && pageLeft) {
            coverRight.classList.remove("turn");
            coverRight.style.zIndex = 100;

            setTimeout(() => {
                coverRight.classList.add("turn");
            }, 600);

            setTimeout(() => {
                coverRight.style.zIndex = -1;
            }, 1300);

            setTimeout(() => {
                pageLeft.style.zIndex = 20;
            }, 1500);
        }

        let pIndex = totalPages;
        pages.forEach((page, index) => {
            setTimeout(() => {
                pIndex--;
                if (pIndex >= 0 && pages[pIndex]) {
                    pages[pIndex].classList.remove("turn");
                    setTimeout(() => {
                        if (pages[pIndex]) pages[pIndex].style.zIndex = 10 + index;
                    }, 300);
                }
            }, (index + 1) * 200 + 1300);
        });
    }

    setInitialBookState();

    pageTurnBtn.forEach((el, index) => {
        el.onclick = (e) => {
            e.stopPropagation();
            const pageTurnId = el.getAttribute("data-page");
            const pageTurn = document.getElementById(pageTurnId);

            playFlipSound();

            if (pageTurn.classList.contains("turn")) {
                pageTurn.classList.remove("turn");
                setTimeout(() => {
                    pageTurn.style.zIndex = 20 - index;
                }, 500);
            } else {
                pageTurn.classList.add("turn");
                setTimeout(() => {
                    pageTurn.style.zIndex = 20 + index;
                }, 500);
            }
        };
    });

    if (contactMeBtn) {
        contactMeBtn.onclick = (e) => {
            e.preventDefault();
            playFlipSound();
            pages.forEach((page, index) => {
                setTimeout(() => {
                    page.classList.add("turn");
                    setTimeout(() => {
                        page.style.zIndex = 20 + index;
                    }, 500);
                }, (index + 1) * 200);
            });
        };
    }

    if (backProfileButton) {
        backProfileButton.onclick = (e) => {
            e.preventDefault();
            playFlipSound();
            for (let i = pages.length - 1; i >= 0; i--) {
                setTimeout(() => {
                    pages[i].classList.remove("turn");
                    setTimeout(() => {
                        pages[i].style.zIndex = 10 + (pages.length - 1 - i);
                    }, 500);
                }, (pages.length - 1 - i) * 200);
            }
        };
    }

    if (btnNextPage) {
        btnNextPage.addEventListener("click", () => {
            const unturned = Array.from(pages).find(p => !p.classList.contains("turn"));
            if (unturned) {
                playFlipSound();
                unturned.classList.add("turn");
            }
        });
    }

    if (btnPrevPage) {
        btnPrevPage.addEventListener("click", () => {
            const turned = Array.from(pages).filter(p => p.classList.contains("turn"));
            if (turned.length > 0) {
                playFlipSound();
                turned[turned.length - 1].classList.remove("turn");
            }
        });
    }

    if (bookResetBtn) {
        bookResetBtn.addEventListener("click", () => {
            playFlipSound();
            setInitialBookState();
        });
    }

    window.addEventListener("keydown", (e) => {
        if (!isFlipbookMode) return;
        if (e.key === "ArrowRight") {
            const unturned = Array.from(pages).find(p => !p.classList.contains("turn"));
            if (unturned) {
                playFlipSound();
                unturned.classList.add("turn");
            }
        } else if (e.key === "ArrowLeft") {
            const turned = Array.from(pages).filter(p => p.classList.contains("turn"));
            if (turned.length > 0) {
                playFlipSound();
                turned[turned.length - 1].classList.remove("turn");
            }
        }
    });

});
