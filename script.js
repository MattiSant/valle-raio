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

const NUMERO_WHATSAPP = "393279080132"; // con prefisso 39(poi numero)

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
    initShoppingCrate();

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

        // Testo del pulsante nella scheda degustazione
        orderBtn.textContent = `+ Aggiungi alla tua lista (${miele.formatoScelto})`;

        // Azione pulsante: aggiunge il vasetto scelto alla Lista e mostra un feedback
        orderBtn.onclick = () => {
            aggiungiAllaLista(miele.key, miele.formatoScelto);
            const originalText = orderBtn.textContent;
            orderBtn.textContent = `✓ Aggiunto (${miele.nomeBreve} ${miele.formatoScelto})! Scorri o aggiungine altri`;
            orderBtn.style.background = "#D98218";
            setTimeout(() => {
                orderBtn.textContent = originalText;
                orderBtn.style.background = "";
            }, 1600);
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

    if (!navbar || !menuBtn || !navLinks) return;

    let closeTimer = null;

    // Funzione di apertura immediata (cancella eventuali chiusure in corso)
    const openMenu = () => {
        if (closeTimer) clearTimeout(closeTimer);
        navLinks.classList.add('menu-open');
        menuBtn.classList.add('open');
    };

    // Funzione di chiusura ammortizzata
    const scheduleClose = () => {
        closeTimer = setTimeout(() => {
            navLinks.classList.remove('menu-open');
            menuBtn.classList.remove('open');
        }, 220); // 220ms: il tempo perfetto per attraversare lo spazio vuoto
    };

    // 1. Hover su Bottone e su Tendina
    menuBtn.addEventListener('mouseenter', openMenu);
    navLinks.addEventListener('mouseenter', openMenu);

    menuBtn.addEventListener('mouseleave', scheduleClose);
    navLinks.addEventListener('mouseleave', scheduleClose);

    // 2. Click per smartphone / touch (dove l'hover del mouse non esiste)
    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (closeTimer) clearTimeout(closeTimer);
        const isOpen = navLinks.classList.toggle('menu-open');
        menuBtn.classList.toggle('open', isOpen);
    });

    // 3. Chiudi quando l'utente clicca su un link interno
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (closeTimer) clearTimeout(closeTimer);
            navLinks.classList.remove('menu-open');
            menuBtn.classList.remove('open');
        });
    });

    // 4. Chiudi se l'utente clicca in qualsiasi punto esterno
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target)) {
            if (closeTimer) clearTimeout(closeTimer);
            navLinks.classList.remove('menu-open');
            menuBtn.classList.remove('open');
        }
    });

    // 5. Scomparsa intelligente della navbar allo scroll in basso
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

/**
 * ============================================================================
 * LOGICA "LA TUA LISTA" (Multi-varietà, Multi-formato & WhatsApp)
 * ============================================================================
 */
// Array che contiene gli articoli scelti: { key, nomeCompleto, size, prezzoNum, prezzoStr, qty }
let carrelloVasetti = [];

function parsePrezzo(prezzoStr) {
    return parseFloat(prezzoStr.replace("€", "").replace(",", ".").trim()) || 0;
}

function formatEuro(num) {
    return "€ " + num.toFixed(2).replace(".", ",");
}

function initShoppingCrate() {
    const catalogContainer = document.getElementById("quick-picker-catalog");
    if (!catalogContainer) return;

    catalogContainer.innerHTML = "";

    // Crea i pulsanti rapidi "+ 250g", "+ 500g", "+ 1000g" per ogni miele disponibile
    mieliAttivi.forEach(miele => {
        if (!miele.disponibile) return;

        const row = document.createElement("div");
        row.className = "picker-honey-row";

        const formatButtonsHTML = miele.formati
            .filter(f => f.disp)
            .map(f => `<button type="button" class="picker-add-pill" data-key="${miele.key}" data-size="${f.size}">+ ${f.size}</button>`)
            .join("");

        row.innerHTML = `
            <span class="picker-honey-name">
                <span class="color-dot" style="background:${miele.colorePunto}"></span>
                ${miele.nomeBreve}
            </span>
            <div class="picker-format-pills">${formatButtonsHTML}</div>
        `;

        row.querySelectorAll(".picker-add-pill").forEach(btn => {
            btn.addEventListener("click", () => {
                aggiungiAllaLista(btn.getAttribute("data-key"), btn.getAttribute("data-size"));
            });
        });

        catalogContainer.appendChild(row);
    });

    // Bottone invio WhatsApp
    const sendBtn = document.getElementById("btn-send-whatsapp-order");
    if (sendBtn) {
        sendBtn.addEventListener("click", inviaOrdineSuWhatsApp);
    }

    // Bottone reset/modifica lista dopo la conferma
    const resetBtn = document.getElementById("btn-reset-crate");
    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            document.getElementById("crate-confirmation-view").classList.add("hidden");
            document.getElementById("crate-builder-view").classList.remove("hidden");
        });
    }

    aggiornaUICarrello();
}

function aggiungiAllaLista(honeyKey, size) {
    const miele = mieliAttivi.find(m => m.key === honeyKey);
    if (!miele || !miele.disponibile) return;

    const fmt = miele.formati.find(f => f.size === size && f.disp);
    if (!fmt) return;

    const existing = carrelloVasetti.find(item => item.key === honeyKey && item.size === size);
    if (existing) {
        existing.qty += 1;
    } else {
        carrelloVasetti.push({
            key: honeyKey,
            nomeCompleto: miele.nomeCompleto,
            size: fmt.size,
            prezzoStr: fmt.prezzo,
            prezzoNum: parsePrezzo(fmt.prezzo),
            qty: 1
        });
    }

    // Assicura che sia visibile la vista di compilazione
    document.getElementById("crate-confirmation-view")?.classList.add("hidden");
    document.getElementById("crate-builder-view")?.classList.remove("hidden");

    aggiornaUICarrello();
}

function cambiaQuantitaLista(index, delta) {
    if (!carrelloVasetti[index]) return;
    carrelloVasetti[index].qty += delta;
    if (carrelloVasetti[index].qty <= 0) {
        carrelloVasetti.splice(index, 1);
    }
    aggiornaUICarrello();
}

function aggiornaUICarrello() {
    const listEl = document.getElementById("crate-selected-list");
    const totalEl = document.getElementById("crate-total-price");
    if (!listEl || !totalEl) return;

    if (carrelloVasetti.length === 0) {
        listEl.innerHTML = `<div class="empty-crate-msg">La tua lista è ancora vuota. Tocca i formati qui sopra (es. + 500g) per aggiungere i vasetti che desideri!</div>`;
        totalEl.textContent = "€ 0,00";
        return;
    }

    listEl.innerHTML = "";
    let totale = 0;

    carrelloVasetti.forEach((item, idx) => {
        const subtot = item.prezzoNum * item.qty;
        totale += subtot;

        const itemRow = document.createElement("div");
        itemRow.className = "crate-item-row";
        itemRow.innerHTML = `
            <div class="crate-item-info">
                <strong>${item.nomeCompleto} (${item.size})</strong>
                <span>${item.prezzoStr} cad. • Subtotale: ${formatEuro(subtot)}</span>
            </div>
            <div class="crate-qty-controls">
                <button type="button" class="qty-btn" data-idx="${idx}" data-delta="-1">−</button>
                <span class="qty-val">${item.qty}</span>
                <button type="button" class="qty-btn" data-idx="${idx}" data-delta="1">+</button>
            </div>
        `;

        itemRow.querySelectorAll(".qty-btn").forEach(b => {
            b.addEventListener("click", () => {
                cambiaQuantitaLista(parseInt(b.getAttribute("data-idx")), parseInt(b.getAttribute("data-delta")));
            });
        });

        listEl.appendChild(itemRow);
    });

    totalEl.textContent = formatEuro(totale);
}

function inviaOrdineSuWhatsApp() {
    if (carrelloVasetti.length === 0) {
        alert("Aggiungi almeno un vasetto alla tua lista prima di inviare!");
        return;
    }

    const nameInput = document.getElementById("customer-name");
    const notesInput = document.getElementById("customer-notes");
    const nomeCliente = nameInput && nameInput.value.trim() ? nameInput.value.trim() : " ";
    const noteCliente = notesInput && notesInput.value.trim() ? notesInput.value.trim() : "";

    let totale = 0;
    const righeProdotti = carrelloVasetti.map(item => {
        const sub = item.prezzoNum * item.qty;
        totale += sub;
        return `• *${item.qty}x ${item.nomeCompleto}* (${item.size}) — ${formatEuro(sub)}`;
    });

    // Costruisce il messaggio WhatsApp ordinato e professionale
    let testoWA = `Buongiorno *Apicoltura Valle Raio*!\n`;
    testoWA += `Sono *${nomeCliente}* e vorrei prenotare questi vasetti dal vostro sito:\n\n`;
    testoWA += righeProdotti.join("\n");
    testoWA += `\n\n*Totale indicativo:* ${formatEuro(totale)}`;
    if (noteCliente) {
        testoWA += `\n*Note:* ${noteCliente}`;
    }
    testoWA += `\n\nAttendo vostra conferma sulla disponibilità, grazie!`;

    // Mostra subito sulla pagina la schermata di conferma per il cliente
    document.getElementById("conf-customer-name").textContent = nomeCliente;
    document.getElementById("conf-summary-box").innerHTML =
        carrelloVasetti.map(i => `<div>• <strong>${i.qty}x ${i.nomeCompleto} (${i.size})</strong></div>`).join("") +
        `<div style="margin-top:8px; padding-top:6px; border-top:1px solid rgba(0,0,0,0.1);"><strong>Totale stimato: ${formatEuro(totale)}</strong></div>`;

    document.getElementById("crate-builder-view").classList.add("hidden");
    document.getElementById("crate-confirmation-view").classList.remove("hidden");

    // Apre WhatsApp con il messaggio già pronto da inviare
    const urlWA = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(testoWA)}`;
    window.open(urlWA, "_blank");
}