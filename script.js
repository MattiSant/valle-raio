/**
 * ============================================================================
 * CONFIGURAZIONE MIELI, IMMAGINI ESAGONALI E DISPONIBILITÀ
 * ============================================================================
 * - immagine: puoi inserire una foto dedicata per ogni miele (es. "acacia.jpg").
 *   Di default usa "vasetti.jpg" così si vede subito!
 * - mostraInPagina: false -> Rimuove quel miele dalla vetrina.
 * - disponibile: false    -> Mostra il miele con il nastro "RACCOLTO ESAURITO".
 * - formati -> disp: false -> Barra quel singolo formato rendendolo non selezionabile.
 */
const CATALOGO_MIELI = [
    {
        key: "acacia",
        mostraInPagina: true,
        disponibile: true,
        nomeBreve: "Acacia",
        nomeCompleto: "Miele di Acacia",
        immagine: "vasetti.jpg", /*INSERISCI FOTO*/
        sottotitolo: "Cristallino, vellutato, dal profumo gentile di fiori bianchi.",
        descrizione: "Raccolto nei boschi puri della Valle Raio a maggio. Naturalmente ricco di fruttosio, resta liquido a lungo e offre al palato delicate note di vaniglia e confetto.",
        sentori: "Fiori di robinia, vaniglia, mandorla",
        abbinamenti: "Formaggi freschi, yogurt, tisane",
        colorePunto: "#F5C338",
        bgHex: "#FAF2DC",
        glowRgba: "rgba(245, 200, 75, 0.55)",
        formatoScelto: "500g",
        formati: [
            { size: "250g", prezzo: "€ 6,50", disp: true },
            { size: "500g", prezzo: "€ 11,00", disp: true },
            { size: "1000g", prezzo: "€ 20,00", disp: true }
        ]
    },
    {
        key: "millefiori",
        mostraInPagina: true,
        disponibile: true,
        nomeBreve: "Millefiori",
        nomeCompleto: "Miele Millefiori",
        immagine: "vasetti.jpg", /*INSERISCI FOTO*/
        sottotitolo: "La sinfonia aromatica dei prati spontanei dell'Appennino.",
        descrizione: "Racchiude l'essenza autentica di Tornimparte (AQ): decine di fioriture montane, lupinella, timo e ginestra per un miele ambrato, rotondo e ricco di micronutrienti.",
        sentori: "Erbe montane, fiori di campo, cera",
        abbinamenti: "Pane rustico, ricotta, colazioni",
        colorePunto: "#DF7A16",
        bgHex: "#F6E3C4",
        glowRgba: "rgba(223, 122, 22, 0.50)",
        formatoScelto: "500g",
        formati: [
            { size: "250g", prezzo: "€ 5,50", disp: true },
            { size: "500g", prezzo: "€ 9,50", disp: true },
            { size: "1000g", prezzo: "€ 18,00", disp: true }
        ]
    },
    {
        key: "castagno",
        mostraInPagina: true,
        disponibile: true,
        nomeBreve: "Castagno",
        nomeCompleto: "Miele di Castagno",
        immagine: "vasetti.jpg",/*INSERISCI FOTO*/
        sottotitolo: "Scuro, incisivo e dal nobile finale amarognolo.",
        descrizione: "Nato all'ombra dei castagneti secolari della Valle Raio. Poco dolce e ricchissimo di ferro, sali minerali e polifenoli, conquista con le sue note legnose e tanniche.",
        sentori: "Legno aromatico, corteccia, caramello",
        abbinamenti: "Pecorino stagionato, carni, polenta",
        colorePunto: "#6E220C",
        bgHex: "#EDE0D4",
        glowRgba: "rgba(130, 45, 20, 0.45)",
        formatoScelto: "500g",
        formati: [
            { size: "250g", prezzo: "€ 6,00", disp: true },
            { size: "500g", prezzo: "€ 10,50", disp: true },
            { size: "1000g", prezzo: "€ 19,00", disp: false } // 1000g esaurito come esempio
        ]
    }
];

gsap.registerPlugin(ScrollTrigger);

const mieliAttivi = CATALOGO_MIELI.filter(m => m.mostraInPagina);
let currentIndex = 0;

// Funzione per emettere uno sciame extra di polline dorato quando si cambia miele
let triggerPollenBurst = null;

document.addEventListener("DOMContentLoaded", () => {
    initEnhancedPollenCanvas();
    initScrollRevealAnimations();
    initSmartNavbar();

    if (mieliAttivi.length === 0) return;

    costruisciSelettoreVarieta();
    selezionaVarieta(0, false);
    initFrecceNavigazione();
});

/**
 * ============================================================================
 * 1. CAMBIO FLUIDO DELLA VARIETÀ DI MIELE (Atmosfera, Foto Esagonale e Scheda)
 * ============================================================================
 */
function selezionaVarieta(index, animateTransition = true) {
    if (index < 0 || index >= mieliAttivi.length) return;
    currentIndex = index;

    const miele = mieliAttivi[index];
    const section = document.getElementById("i-nostri-mieli");
    const ambientGlow = document.getElementById("showcase-ambient-glow");
    const card = document.getElementById("tasting-card");
    const hexFrame = document.getElementById("product-hex-frame");
    const showcaseImg = document.getElementById("showcase-honey-img");

    // Cambia il colore di sfondo della sezione per renderlo omologo al miele
    if (section) section.style.backgroundColor = miele.bgHex;
    if (ambientGlow) {
        ambientGlow.style.background = `radial-gradient(circle, ${miele.glowRgba} 0%, rgba(255, 255, 255, 0) 70%)`;
    }

    // Emette una folata di polline luminoso al cambio varietà
    if (animateTransition && typeof triggerPollenBurst === "function") {
        triggerPollenBurst();
    }

    const updateDOMContent = () => {
        // Aggiorna foto dentro l'esagono
        if (showcaseImg && miele.immagine) {
            showcaseImg.src = miele.immagine;
            showcaseImg.alt = miele.nomeCompleto;
        }

        // Verifica che il formato selezionato sia disponibile
        const validFmt = miele.formati.find(f => f.size === miele.formatoScelto && f.disp);
        if (!validFmt) {
            const firstAvailable = miele.formati.find(f => f.disp);
            if (firstAvailable) miele.formatoScelto = firstAvailable.size;
        }

        const total = String(mieliAttivi.length).padStart(2, "0");
        const curr = String(index + 1).padStart(2, "0");
        document.getElementById("tasting-index").textContent = `COLLEZIONE ${curr} / ${total}`;
        document.getElementById("tasting-title").textContent = miele.nomeCompleto;
        document.getElementById("tasting-subtitle").textContent = miele.sottotitolo;
        document.getElementById("tasting-desc").textContent = miele.descrizione;
        document.getElementById("tasting-notes").textContent = miele.sentori;
        document.getElementById("tasting-pairings").textContent = miele.abbinamenti;

        // Stato Disponibile / Esaurito
        const statusPill = document.getElementById("tasting-status-pill");
        const soldoutBadge = document.getElementById("showcase-soldout-badge");
        const orderBtn = document.getElementById("btn-order-main");

        if (!miele.disponibile) {
            statusPill.textContent = "Raccolto Esaurito";
            statusPill.style.background = "rgba(158, 42, 43, 0.14)";
            statusPill.style.color = "#9E2A2B";
            soldoutBadge.classList.remove("hidden");
            orderBtn.textContent = "Attualmente Esaurito";
            orderBtn.disabled = true;
        } else {
            statusPill.textContent = "Raccolto Disponibile";
            statusPill.style.background = "rgba(27, 107, 58, 0.12)";
            statusPill.style.color = "#1B6B3A";
            soldoutBadge.classList.add("hidden");
            orderBtn.disabled = false;
            orderBtn.textContent = `Prenota ${miele.nomeCompleto} (${miele.formatoScelto})`;
        }

        // Genera i pulsanti dei formati (250g, 500g, 1000g)
        const formatsGrid = document.getElementById("formats-selector-grid");
        formatsGrid.innerHTML = "";

        miele.formati.forEach(fmt => {
            const btn = document.createElement("button");
            btn.type = "button";
            const isSelected = fmt.size === miele.formatoScelto && fmt.disp;
            btn.className = "format-card-btn" + (isSelected ? " selected" : "") + (!fmt.disp ? " unavailable" : "");
            btn.disabled = !fmt.disp || !miele.disponibile;

            btn.innerHTML = `
                <span class="fc-size">Vasetto ${fmt.size}</span>
                <span class="fc-price">${fmt.prezzo}</span>
                <span class="fc-status">${!fmt.disp ? "Esaurito" : (isSelected ? "Selezionato ✓" : "Scegli")}</span>
            `;

            btn.addEventListener("click", () => {
                miele.formatoScelto = fmt.size;
                selezionaVarieta(index, false);
            });

            formatsGrid.appendChild(btn);
        });

        // Azione pulsante Prenota -> Compila il form e scorre giù
        orderBtn.onclick = () => {
            const honeySelect = document.getElementById("honey-select");
            const formatSelect = document.getElementById("format-select");
            const messageBox = document.getElementById("message");

            if (honeySelect) honeySelect.value = miele.nomeCompleto;
            if (formatSelect) formatSelect.value = miele.formatoScelto;
            if (messageBox) {
                messageBox.value = `Buongiorno Apicoltura Valle Raio, vorrei prenotare il vostro ${miele.nomeCompleto} nel formato da ${miele.formatoScelto}.`;
            }
            document.getElementById("contatti").scrollIntoView({ behavior: "smooth" });
        };

        // Aggiorna pillola attiva
        document.querySelectorAll(".jump-btn").forEach((b, idx) => {
            b.classList.toggle("active", idx === index);
        });
    };

    if (animateTransition) {
        // Transizione morbida sulla scheda e sull'esagono fotografico
        gsap.to([card, hexFrame], {
            opacity: 0.25,
            y: 8,
            duration: 0.18,
            ease: "power1.out",
            onComplete: () => {
                updateDOMContent();
                gsap.to([card, hexFrame], {
                    opacity: 1,
                    y: 0,
                    duration: 0.35,
                    ease: "power2.out"
                });
            }
        });
    } else {
        updateDOMContent();
    }
}

function costruisciSelettoreVarieta() {
    const container = document.getElementById("variety-pills-container");
    if (!container) return;
    container.innerHTML = "";

    mieliAttivi.forEach((miele, index) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "jump-btn" + (index === 0 ? " active" : "");
        btn.innerHTML = `<span class="color-dot" style="background:${miele.colorePunto}"></span> ${miele.nomeBreve}`;

        btn.addEventListener("click", () => {
            if (currentIndex !== index) {
                selezionaVarieta(index, true);
            }
        });

        container.appendChild(btn);
    });
}

function initFrecceNavigazione() {
    const prevBtn = document.getElementById("btn-prev-honey");
    const nextBtn = document.getElementById("btn-next-honey");

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            const nextIdx = (currentIndex - 1 + mieliAttivi.length) % mieliAttivi.length;
            selezionaVarieta(nextIdx, true);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            const nextIdx = (currentIndex + 1) % mieliAttivi.length;
            selezionaVarieta(nextIdx, true);
        });
    }
}

/**
 * ============================================================================
 * 2. ANIMAZIONI DI COMPARSA ALLO SCROLL (Eleganti e leggere)
 * ============================================================================
 */
function initScrollRevealAnimations() {
    gsap.utils.toArray(".reveal-up").forEach((elem) => {
        gsap.fromTo(elem,
            { opacity: 0, y: 32 },
            {
                opacity: 1,
                y: 0,
                duration: 0.85,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: elem,
                    start: "top 86%",
                    toggleActions: "play none none none"
                }
            }
        );
    });
}

/**
 * ============================================================================
 * 3. EFFETTO POLLINE POTENZIATO E INTERATTIVO (Multi-livello + Brezza Mouse)
 * ============================================================================
 */
function initEnhancedPollenCanvas() {
    const canvas = document.getElementById("pollen-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const palette = [
        "255, 226, 115", // Giallo polline solare
        "245, 192, 62",  // Oro caldo
        "235, 148, 30",  // Ambra intensa
        "224, 112, 24",  // Arancio miele
        "255, 242, 185"  // Luce crema dorata
    ];

    let mouse = { x: -9999, y: -9999 };
    window.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    function createParticle(isBurst = false) {
        const sizeTier = Math.random();
        const radius = sizeTier > 0.82 ? Math.random() * 3.5 + 3.2 : Math.random() * 2.2 + 1.1;
        return {
            x: Math.random() * canvas.width,
            y: isBurst ? canvas.height * (0.35 + Math.random() * 0.4) : Math.random() * canvas.height,
            r: radius,
            baseDx: (Math.random() - 0.5) * 0.45,
            baseDy: -Math.random() * 0.5 - 0.15,
            swaySpeed: Math.random() * 0.02 + 0.008,
            swayOffset: Math.random() * Math.PI * 2,
            rgb: palette[Math.floor(Math.random() * palette.length)],
            alpha: Math.random() * 0.55 + 0.25,
            pulseSpeed: Math.random() * 0.03 + 0.01
        };
    }

    // 72 granelli di polline sempre attivi su tutta la schermata
    const particles = Array.from({ length: 72 }, () => createParticle(false));

    // Funzione richiamata al cambio di miele per creare una folata dorata
    triggerPollenBurst = () => {
        particles.forEach(p => {
            p.baseDy -= 0.9;
            setTimeout(() => {
                p.baseDy = -Math.random() * 0.5 - 0.15;
            }, 700);
        });
    };

    let tick = 0;
    function draw() {
        tick++;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p) => {
            // Oscillazione naturale come polline trasportato dalla brezza
            const swayX = Math.sin(tick * p.swaySpeed + p.swayOffset) * 0.35;
            const currentAlpha = p.alpha + Math.sin(tick * p.pulseSpeed + p.swayOffset) * 0.12;

            // Lieve repulsione/brezza quando passa il mouse vicino
            const distX = p.x - mouse.x;
            const distY = p.y - mouse.y;
            const dist = Math.sqrt(distX * distX + distY * distY);
            if (dist < 110 && dist > 0) {
                p.x += (distX / dist) * 0.85;
                p.y += (distY / dist) * 0.85;
            }

            const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.4);
            grad.addColorStop(0, `rgba(${p.rgb}, ${Math.max(0.1, currentAlpha)})`);
            grad.addColorStop(0.5, `rgba(${p.rgb}, ${Math.max(0.05, currentAlpha * 0.45)})`);
            grad.addColorStop(1, `rgba(${p.rgb}, 0)`);

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r * 2.4, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();

            p.x += p.baseDx + swayX;
            p.y += p.baseDy;

            if (p.y < -20) p.y = canvas.height + 20;
            if (p.x < -20) p.x = canvas.width + 20;
            if (p.x > canvas.width + 20) p.x = -20;
        });

        requestAnimationFrame(draw);
    }
    draw();
}

/**
 * ============================================================================
 * GESTIONE NAVBAR A SCOMPARSA E MENU MOBILE
 * ============================================================================
 */
function initSmartNavbar() {
    const navbar = document.getElementById('main-navbar');
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');

    if (!menuBtn || !navLinks) return;

    // Apertura/Chiusura al click sull'hamburger
    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = navLinks.classList.toggle('menu-open');
        menuBtn.classList.toggle('open', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Chiude il menu cliccando su qualsiasi link interno
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('menu-open');
            menuBtn.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // Scomparsa intelligente della navbar allo scroll in basso
    let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
    window.addEventListener('scroll', () => {
        if (navLinks.classList.contains('menu-open')) return;

        const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            navbar.classList.add('nav-hidden');
        } else if (currentScrollY < lastScrollY) {
            navbar.classList.remove('nav-hidden');
        }
        lastScrollY = Math.max(0, currentScrollY);
    }, { passive: true });
}