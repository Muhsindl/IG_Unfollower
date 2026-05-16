(() => {
    "use strict";

    // --- Developer Greeting ---
    console.log(
        "%c⚡ MUHSIN DOLU %c| IG Unfollower Script Started",
        "color: #00f2fe; background: #15171d; font-size: 14px; font-weight: bold; padding: 4px 8px; border-radius: 4px;",
        "color: #4facfe; font-size: 14px; font-weight: bold;"
    );

    if (location.hostname !== "www.instagram.com") {
        alert("Önce https://www.instagram.com adresini açın, ardından bu betiği tekrar yapıştırın.");
        return;
    }

    const APP_ID = "iu-app";
    const STYLE_ID = "iu-style";
    const STORAGE_KEY = "iu_state_v3";

    const IG_HEADERS = {
        "x-ig-app-id": "936619743392459",
        "x-requested-with": "XMLHttpRequest"
    };

    const DEFAULT_TIMINGS = {
        scanDelayMin: 700,
        scanDelayMax: 1500,
        scanPauseEveryPages: 5,
        scanPauseMs: 8000,
        unfollowDelayMin: 5000,
        unfollowDelayMax: 9000,
        unfollowPauseEvery: 5,
        unfollowPauseMs: 300000
    };

    const PANEL_WIDTH = 380;
    const PANEL_MARGIN = 18;
    const MAX_RETRIES = 3;

    const I18N = {
        en: {
            title: "IG Unfollower",
            subtitle: "Muhsin DOLU",
            welcomeTitle: "Ready when you are, Dev",
            welcomeBody: "We'll scan only the people you follow and use Instagram's follow-back status to keep the scan fast. Nothing is changed on your account during the scan.",
            scanBtn: "Scan now",
            scanning: "Scanning",
            loadingFollowing: "Loading the people you follow",
            loadingFollowers: "Checking follow-back status",
            paused: "Paused",
            pause: "Pause",
            resume: "Resume",
            cancel: "Cancel",
            ofTotal: "{current} of {total}",
            ofUnknown: "{current} so far",
            scanCompletedToast: "{count} non-followers found",
            scanFailed: "Scan failed",
            retry: "Try again",
            goBack: "Back to results",
            search: "Search by name or username",
            filterVerified: "Verified",
            filterPrivate: "Private",
            filterNoAvatar: "No profile picture",
            filterShowHidden: "Hidden users",
            foundCount: "{count} non-followers",
            foundOne: "1 non-follower",
            foundNone: "Nice — everyone you follow follows you back.",
            noMatches: "No users match your filters.",
            hide: "Hide",
            unhide: "Unhide",
            hideTooltip: "Hide from this list",
            unhideTooltip: "Show again",
            openProfile: "Open profile",
            copy: "Copy",
            copyAll: "Copy all",
            copiedToast: "Copied {count} usernames",
            selectAll: "Select all",
            selectNone: "Clear",
            selectedCount: "{count} selected",
            unfollow: "Unfollow",
            unfollowConfirmTitle: "Unfollow {count} users?",
            unfollowConfirmBody: "This will run slowly to protect your account from rate limiting. You can pause at any time, but already-completed unfollows cannot be reversed from this tool.",
            unfollowConfirmBtn: "Yes, unfollow {count}",
            unfollowing: "Unfollowing",
            currently: "Currently",
            nextActionIn: "Next action in {seconds}s",
            cooldownIn: "Cooldown — {seconds}s",
            idle: "Ready",
            unfollowDoneTitle: "Done",
            unfollowDoneBody: "{ok} unfollowed, {fail} failed",
            settings: "Settings",
            settingsTitle: "Timing settings",
            settingsBody: "Lower delays make Instagram more likely to throttle or block your account. Keep these conservative.",
            minScanDelay: "Min scan delay (ms)",
            maxScanDelay: "Max scan delay (ms)",
            scanPauseEvery: "Long pause every N pages",
            scanPauseLength: "Long pause length (ms)",
            minUnfollowDelay: "Min unfollow delay (ms)",
            maxUnfollowDelay: "Max unfollow delay (ms)",
            unfollowPauseEvery: "Cooldown every N unfollows",
            unfollowPauseLength: "Cooldown length (ms)",
            restoreDefaults: "Restore defaults",
            save: "Save",
            saved: "Settings saved",
            cookieMissing: "Could not read your login cookie. Make sure you are signed in.",
            csrfMissing: "Could not read csrftoken cookie.",
            requestFailed: "Request failed: {status}",
            tooManyRequests: "Instagram is rate-limiting requests. Try again later or increase delays in settings.",
            close: "Close",
            minimize: "Minimize",
            expand: "Expand",
            langCode: "TR",
            pillScanning: "Scanning {current}/{total}",
            pillUnfollowing: "Unfollowing {current}/{total}",
            pillResults: "{count} non-followers",
            pillIdle: "Open"
        },
        tr: {
            title: "IG Takip Etmeyenler",
            subtitle: "Muhsin DOLU",
            welcomeTitle: "Hazır olduğunda başlat, Dev",
            welcomeBody: "Sadece takip ettiklerin taranır ve Instagram'ın geri takip durumuyla hızlıca kontrol edilir. Tarama sırasında hesabında hiçbir şey değişmez.",
            scanBtn: "Taramayı Başlat 🚀",
            scanning: "Taranıyor",
            loadingFollowing: "Takip ettiklerin yükleniyor",
            loadingFollowers: "Geri takip durumu kontrol ediliyor",
            paused: "Duraklatıldı",
            pause: "Duraklat",
            resume: "Devam et",
            cancel: "İptal",
            ofTotal: "{current} / {total}",
            ofUnknown: "Şu ana kadar {current}",
            scanCompletedToast: "{count} takip etmeyen bulundu",
            scanFailed: "Tarama başarısız",
            retry: "Tekrar dene",
            goBack: "Sonuçlara dön",
            search: "İsim veya kullanıcı adı ara",
            filterVerified: "Onaylı",
            filterPrivate: "Gizli",
            filterNoAvatar: "Profil resmi yok",
            filterShowHidden: "Gizlenen kullanıcılar",
            foundCount: "{count} takip etmeyen",
            foundOne: "1 takip etmeyen",
            foundNone: "Harika — takip ettiğin herkes seni takip ediyor.",
            noMatches: "Filtrelerinle eşleşen kullanıcı yok.",
            hide: "Gizle",
            unhide: "Göster",
            hideTooltip: "Bu listeden gizle",
            unhideTooltip: "Tekrar göster",
            openProfile: "Profili aç",
            copy: "Kopyala",
            copyAll: "Tümünü kopyala",
            copiedToast: "{count} kullanıcı adı kopyalandı",
            selectAll: "Tümünü seç",
            selectNone: "Temizle",
            selectedCount: "{count} seçili",
            unfollow: "Takibi bırak",
            unfollowConfirmTitle: "{count} kullanıcının takibi bırakılsın mı?",
            unfollowConfirmBody: "Hesabını korumak için işlem yavaş çalışır. İstediğin zaman duraklatabilirsin, ama tamamlanan işlemler bu araçtan geri alınamaz.",
            unfollowConfirmBtn: "Evet, {count} kişiyi bırak",
            unfollowing: "Takip bırakılıyor",
            currently: "Şu an",
            nextActionIn: "Sonraki işlem {seconds} sn sonra",
            cooldownIn: "Mola — {seconds} sn",
            idle: "Hazır",
            unfollowDoneTitle: "Tamamlandı",
            unfollowDoneBody: "{ok} başarılı, {fail} başarısız",
            settings: "Ayarlar",
            settingsTitle: "Hız ayarları",
            settingsBody: "Düşük gecikmeler Instagram'ın hesabını kısıtlamasına neden olabilir. Yavaş tut.",
            minScanDelay: "Min tarama gecikmesi (ms)",
            maxScanDelay: "Maks tarama gecikmesi (ms)",
            scanPauseEvery: "Her N sayfada uzun mola",
            scanPauseLength: "Uzun mola süresi (ms)",
            minUnfollowDelay: "Min takip bırakma gecikmesi (ms)",
            maxUnfollowDelay: "Maks takip bırakma gecikmesi (ms)",
            unfollowPauseEvery: "Her N takip bırakmada mola",
            unfollowPauseLength: "Mola süresi (ms)",
            restoreDefaults: "Varsayılana dön",
            save: "Kaydet",
            saved: "Ayarlar kaydedildi",
            cookieMissing: "Giriş çerezi okunamadı. Giriş yaptığından emin ol.",
            csrfMissing: "csrftoken çerezi okunamadı.",
            requestFailed: "İstek başarısız: {status}",
            tooManyRequests: "Instagram istekleri kısıtlıyor. Sonra dene veya ayarlardan gecikmeleri artır.",
            close: "Kapat",
            minimize: "Küçült",
            expand: "Aç",
            langCode: "EN",
            pillScanning: "Taranıyor {current}/{total}",
            pillUnfollowing: "Bırakılıyor {current}/{total}",
            pillResults: "{count} takip etmeyen",
            pillIdle: "Muhsin Panel"
        }
    };

    const SVG = {
        minimize: '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><rect x="3" y="7.25" width="10" height="1.5" rx="0.75" fill="currentColor"/></svg>',
        close: '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
        gear: '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zm6.7 2.5a6.7 6.7 0 0 0-.1-1.1l1.4-1.1-1.5-2.6-1.7.7a6.6 6.6 0 0 0-1.9-1.1L10.5 1h-3l-.4 1.8a6.6 6.6 0 0 0-1.9 1.1l-1.7-.7L1.9 5.8 3.3 6.9a6.7 6.7 0 0 0 0 2.2L1.9 10.2l1.5 2.6 1.7-.7a6.6 6.6 0 0 0 1.9 1.1L7.5 15h3l.4-1.8a6.6 6.6 0 0 0 1.9-1.1l1.7.7 1.5-2.6-1.4-1.1c.1-.4.1-.7.1-1.1z"/></svg>',
        open: '<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M6 3h7v7M13 3L6.5 9.5M9 13H3V7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
        sparkle: '<svg viewBox="0 0 24 24" width="36" height="36" aria-hidden="true"><path fill="url(#neonGrad)" d="M12 2l1.8 5.4L19 9l-5.2 1.6L12 16l-1.8-5.4L5 9l5.2-1.6L12 2zm6 11l1 2.8L22 17l-3 .8L18 21l-1-3.2L14 17l3-1.2 1-2.8z"/><defs><linearGradient id="neonGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#00f2fe"/><stop offset="100%" stop-color="#4facfe"/></linearGradient></defs></svg>',
        alert: '<svg viewBox="0 0 24 24" width="36" height="36" aria-hidden="true"><path fill="currentColor" d="M12 2 1 21h22L12 2zm0 6 7.5 13h-15L12 8zm-1 4v4h2v-4h-2zm0 5v2h2v-2h-2z"/></svg>',
        check: '<svg viewBox="0 0 16 16" width="36" height="36" aria-hidden="true"><path fill="currentColor" d="M14 4.5L6 12.5l-4-4L3 7.5l3 3 7-7z"/></svg>'
    };

    const persisted = loadStored();
    const state = {
        mode: "idle",
        scanPaused: false,
        scanCancelled: false,
        unfollowPaused: false,
        progress: { current: 0, total: 0, label: "scanning", note: "" },
        waitUntil: 0,
        waitReason: "",
        users: [],
        followingCount: 0,
        followersCount: 0,
        selected: new Set(),
        hidden: new Set(persisted.hidden || []),
        log: [],
        search: "",
        // FİLTRELER HER ZAMAN TRUE BAŞLAR, KAYITLI AYARLAR YOK SAYILIR
        filters: { verified: true, private: true, noAvatar: true, showHidden: true },
        timings: { ...DEFAULT_TIMINGS, ...(persisted.timings || {}) },
        panelPos: persisted.panelPos || null,
        minimized: Boolean(persisted.minimized),
        language: persisted.language === "en" ? "en" : "tr",
        error: ""
    };

    let countdownTimer = null;
    let toastTimer = null;

    function loadStored() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch { return {}; }
    }

    function persist() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                hidden: [...state.hidden], timings: state.timings, filters: state.filters,
                panelPos: state.panelPos, minimized: state.minimized, language: state.language
            }));
        } catch {}
    }

    function t(key, vars) {
        const dict = I18N[state.language] || I18N.tr;
        const template = dict[key] ?? I18N.tr[key] ?? key;
        if (!vars) return template;
        return template.replace(/\{(\w+)\}/g, (_, name) => vars[name] ?? "");
    }

    function cleanupExisting() {
        if (typeof window.__iuCleanup === "function") {
            try { window.__iuCleanup(); } catch {}
        }
        document.getElementById(APP_ID)?.remove();
        document.getElementById(STYLE_ID)?.remove();
    }

    function injectStyles() {
        const style = document.createElement("style");
        style.id = STYLE_ID;
        style.textContent = CSS;
        document.head.appendChild(style);
    }

    function mount() {
        const root = document.createElement("div");
        root.id = APP_ID;
        document.body.appendChild(root);
        window.__iuCleanup = unmount;
        renderShell();
    }

    function unmount() {
        stopCountdown();
        if (toastTimer) { clearTimeout(toastTimer); toastTimer = null; }
        document.getElementById(APP_ID)?.remove();
        document.getElementById(STYLE_ID)?.remove();
        if (window.__iuCleanup === unmount) window.__iuCleanup = null;
    }

    function renderShell() {
        const root = document.getElementById(APP_ID);
        if (!root) return;

        if (state.minimized) {
            root.innerHTML = `
                <button class="iu-pill" data-action="expand" type="button" aria-label="${escapeAttr(t("expand"))}">
                    <span class="iu-pill-dot ${pillStateClass()}"></span>
                    <span data-pill-label>${escapeHTML(pillLabel())}</span>
                </button>
            `;
            root.querySelector("[data-action='expand']")?.addEventListener("click", () => setMinimized(false));
            applyPanelPosition();
            return;
        }

        root.innerHTML = `
            <section class="iu-panel glass-panel" role="dialog" aria-label="${escapeAttr(t("title"))}">
                <header class="iu-header" data-drag>
                    <div class="iu-brand">
                        <span class="iu-brand-dot"></span>
                        <div class="iu-brand-text">
                            <strong>${escapeHTML(t("title"))}</strong>
                            <span data-subtitle>${escapeHTML(t("subtitle"))}</span>
                        </div>
                    </div>
                    <div class="iu-header-actions">
                        <button type="button" data-action="settings" aria-label="${escapeAttr(t("settings"))}" title="${escapeAttr(t("settings"))}">${SVG.gear}</button>
                        <button type="button" data-action="language" aria-label="${escapeAttr(t("langCode"))}" title="${escapeAttr(t("langCode"))}"><span data-lang>${escapeHTML(t("langCode"))}</span></button>
                        <button type="button" data-action="minimize" aria-label="${escapeAttr(t("minimize"))}" title="${escapeAttr(t("minimize"))}">${SVG.minimize}</button>
                        <button type="button" data-action="close" aria-label="${escapeAttr(t("close"))}" title="${escapeAttr(t("close"))}">${SVG.close}</button>
                    </div>
                </header>
                <div class="iu-body" data-body></div>
                <footer class="iu-footer">
                    <a href="https://muhsindolu.com.tr" target="_blank" rel="noopener noreferrer">muhsindolu.com.tr</a>
                    <span class="iu-footer-sep">|</span>
                    <span>Muhsin DOLU ©</span>
                </footer>
            </section>
        `;
        bindHeader(root);
        bindDrag(root.querySelector("[data-drag]"));
        applyPanelPosition();
        renderBody();
    }

    function bindHeader(root) {
        root.querySelector("[data-action='close']")?.addEventListener("click", () => unmount());
        root.querySelector("[data-action='minimize']")?.addEventListener("click", () => setMinimized(true));
        root.querySelector("[data-action='settings']")?.addEventListener("click", showSettings);
        root.querySelector("[data-action='language']")?.addEventListener("click", toggleLanguage);
    }

    function applyPanelPosition() {
        const root = document.getElementById(APP_ID);
        if (!root) return;
        const node = root.querySelector(".iu-panel") || root.querySelector(".iu-pill");
        if (!node) return;
        const pos = state.panelPos;
        if (pos && Number.isFinite(pos.x) && Number.isFinite(pos.y)) {
            const max = panelBounds(node);
            node.style.left = clamp(pos.x, 0, max.x) + "px";
            node.style.top = clamp(pos.y, 0, max.y) + "px";
            node.style.right = "auto";
            node.style.bottom = "auto";
        } else {
            node.style.left = "auto";
            node.style.top = "auto";
            node.style.right = PANEL_MARGIN + "px";
            node.style.bottom = PANEL_MARGIN + "px";
        }
    }

    function panelBounds(node) {
        const rect = node.getBoundingClientRect();
        return {
            x: Math.max(0, window.innerWidth - rect.width),
            y: Math.max(0, window.innerHeight - rect.height)
        };
    }

    function bindDrag(handle) {
        if (!handle) return;
        const panel = handle.closest(".iu-panel");
        if (!panel) return;
        let startX = 0, startY = 0, originX = 0, originY = 0, dragging = false;

        handle.addEventListener("pointerdown", (event) => {
            if (event.target.closest("button")) return;
            dragging = true;
            const rect = panel.getBoundingClientRect();
            originX = rect.left; originY = rect.top;
            startX = event.clientX; startY = event.clientY;
            panel.style.left = originX + "px"; panel.style.top = originY + "px";
            panel.style.right = "auto"; panel.style.bottom = "auto";
            handle.setPointerCapture(event.pointerId);
            handle.classList.add("iu-dragging");
        });

        handle.addEventListener("pointermove", (event) => {
            if (!dragging) return;
            const max = panelBounds(panel);
            const x = clamp(originX + (event.clientX - startX), 0, max.x);
            const y = clamp(originY + (event.clientY - startY), 0, max.y);
            panel.style.left = x + "px";
            panel.style.top = y + "px";
        });

        const stop = (event) => {
            if (!dragging) return;
            dragging = false;
            handle.releasePointerCapture?.(event.pointerId);
            handle.classList.remove("iu-dragging");
            const rect = panel.getBoundingClientRect();
            state.panelPos = { x: rect.left, y: rect.top };
            persist();
        };

        handle.addEventListener("pointerup", stop);
        handle.addEventListener("pointercancel", stop);
    }

    function setMinimized(value) {
        state.minimized = Boolean(value);
        persist();
        renderShell();
    }

    function pillLabel() {
        if (state.mode === "scanning") return t("pillScanning", { current: state.progress.current, total: state.progress.total || "?" });
        if (state.mode === "unfollowing") return t("pillUnfollowing", { current: state.progress.current, total: state.progress.total });
        if (state.mode === "results" && state.users.length) return t("pillResults", { count: state.users.filter((u) => !u.follows_viewer && !state.hidden.has(u.id)).length });
        return t("pillIdle");
    }

    function pillStateClass() {
        if (state.mode === "scanning" || state.mode === "unfollowing") return "iu-pill-dot--active";
        if (state.error) return "iu-pill-dot--error";
        return "";
    }

    function renderBody() {
        const body = document.querySelector(`#${APP_ID} [data-body]`);
        if (!body) return;

        if (state.mode === "scanning") {
            body.innerHTML = renderScanView();
            bindScan(body);
        } else if (state.mode === "results") {
            body.innerHTML = renderResultsView();
            bindResults(body);
        } else if (state.mode === "unfollowing" || state.mode === "unfollowDone") {
            body.innerHTML = renderUnfollowView();
            bindUnfollow(body);
        } else {
            body.innerHTML = renderIdleView();
            bindIdle(body);
        }
        if (state.mode === "scanning" || state.mode === "unfollowing") startCountdown();
        else stopCountdown();
    }

    function renderIdleView() {
        if (state.error) {
            return `
                <div class="iu-welcome">
                    <div class="iu-welcome-icon iu-welcome-icon--error">${SVG.alert}</div>
                    <h2>${escapeHTML(t("scanFailed"))}</h2>
                    <p>${escapeHTML(state.error)}</p>
                    <button type="button" class="iu-btn iu-btn--primary" data-action="scan">${escapeHTML(t("retry"))}</button>
                </div>
            `;
        }
        return `
            <div class="iu-welcome">
                <div class="iu-welcome-icon glowing-icon">${SVG.sparkle}</div>
                <h2>${escapeHTML(t("welcomeTitle"))}</h2>
                <p>${escapeHTML(t("welcomeBody"))}</p>
                <button type="button" class="iu-btn iu-btn--primary iu-btn--lg glow-btn" data-action="scan">${escapeHTML(t("scanBtn"))}</button>
            </div>
        `;
    }

    function bindIdle(body) {
        body.querySelector("[data-action='scan']")?.addEventListener("click", startScan);
    }

    function renderScanView() {
        const { current, total, label, note } = state.progress;
        const percent = total ? Math.min(100, Math.round((current / total) * 100)) : 0;
        const counter = total ? t("ofTotal", { current, total }) : t("ofUnknown", { current });
        return `
            <div class="iu-progress">
                <div class="iu-progress-head">
                    <h2 data-progress-label>${escapeHTML(state.scanPaused ? t("paused") : t(label))}</h2>
                    <p data-progress-note>${escapeHTML(note)}</p>
                </div>
                <div class="iu-bar"><span data-progress-bar style="width:${percent}%"></span></div>
                <div class="iu-progress-meta">
                    <span data-progress-counter>${escapeHTML(counter)}</span>
                    <span data-countdown class="iu-muted"></span>
                </div>
                <div class="iu-progress-actions">
                    <button type="button" class="iu-btn" data-action="pause-scan">${escapeHTML(t(state.scanPaused ? "resume" : "pause"))}</button>
                    <button type="button" class="iu-btn iu-btn--ghost" data-action="cancel-scan">${escapeHTML(t("cancel"))}</button>
                </div>
            </div>
        `;
    }

    function bindScan(body) {
        body.querySelector("[data-action='pause-scan']")?.addEventListener("click", () => {
            state.scanPaused = !state.scanPaused;
            const btn = body.querySelector("[data-action='pause-scan']");
            if (btn) btn.textContent = t(state.scanPaused ? "resume" : "pause");
            const label = body.querySelector("[data-progress-label]");
            if (label) label.textContent = state.scanPaused ? t("paused") : t(state.progress.label);
        });
        body.querySelector("[data-action='cancel-scan']")?.addEventListener("click", () => {
            state.scanCancelled = true;
            state.scanPaused = false;
        });
    }

    function renderResultsView() {
        const display = getDisplayUsers();
        const totalNonFollowers = state.users.filter((u) => !u.follows_viewer && !state.hidden.has(u.id)).length;
        const visibleSelected = display.filter((u) => state.selected.has(u.id)).length;
        let summary;
        if (totalNonFollowers === 0) summary = t("foundNone");
        else if (totalNonFollowers === 1) summary = t("foundOne");
        else summary = t("foundCount", { count: totalNonFollowers });
        return `
            <div class="iu-results">
                <div class="iu-results-summary">${escapeHTML(summary)}</div>
                <div class="iu-search-row">
                    <input class="iu-search" type="search" data-search placeholder="${escapeAttr(t("search"))}" value="${escapeAttr(state.search)}" autocomplete="off" spellcheck="false" >
                </div>
                <div class="iu-filters">
                    ${filterChip("verified", t("filterVerified"))}
                    ${filterChip("private", t("filterPrivate"))}
                    ${filterChip("noAvatar", t("filterNoAvatar"))}
                    ${filterChip("showHidden", t("filterShowHidden"))}
                </div>
                <div class="iu-list" data-list>${renderUserList(display)}</div>
                <div class="iu-actionbar">
                    <div class="iu-actionbar-left">
                        <button type="button" class="iu-btn iu-btn--small" data-action="select-all" ${display.length ? "" : "disabled"}>
                            ${escapeHTML(visibleSelected === display.length && display.length ? t("selectNone") : t("selectAll"))}
                        </button>
                        <span class="iu-muted" data-selected-label>${escapeHTML(t("selectedCount", { count: state.selected.size }))}</span>
                    </div>
                    <div class="iu-actionbar-right">
                        <button type="button" class="iu-btn iu-btn--small" data-action="copy" ${display.length ? "" : "disabled"}>${escapeHTML(state.selected.size ? t("copy") : t("copyAll"))}</button>
                        <button type="button" class="iu-btn iu-btn--danger iu-btn--small" data-action="unfollow" ${state.selected.size ? "" : "disabled"}>${escapeHTML(t("unfollow"))}${state.selected.size ? " (" + state.selected.size + ")" : ""}</button>
                    </div>
                </div>
            </div>
        `;
    }

    function filterChip(key, label) {
        const active = state.filters[key];
        return `
            <button type="button" class="iu-chip ${active ? "iu-chip--on" : ""}" data-filter="${escapeAttr(key)}" aria-pressed="${active ? "true" : "false"}">
                <span class="iu-chip-indicator"></span>
                <span>${escapeHTML(label)}</span>
            </button>
        `;
    }

    function renderUserList(display) {
        if (!display.length) { return `<div class="iu-list-empty">${escapeHTML(t("noMatches"))}</div>`; }
        return display.map(renderUserRow).join("");
    }

    function renderUserRow(user) {
        const hidden = state.hidden.has(user.id);
        const checked = state.selected.has(user.id);
        const tags = [];
        if (user.is_verified) tags.push(`<span class="iu-tag iu-tag--cyan">${escapeHTML(t("filterVerified"))}</span>`);
        if (user.is_private) tags.push(`<span class="iu-tag">${escapeHTML(t("filterPrivate"))}</span>`);
        return `
            <div class="iu-row ${hidden ? "iu-row--hidden" : ""} ${checked ? "iu-row--selected" : ""}" data-row="${escapeAttr(user.id)}" role="button" tabindex="0">
                <input type="checkbox" class="iu-row-check" data-select="${escapeAttr(user.id)}" ${checked ? "checked" : ""} aria-label="${escapeAttr(user.username)}">
                <img class="iu-avatar" src="${escapeAttr(user.profile_pic_url || "")}" alt="" loading="lazy" onerror="this.style.visibility='hidden'">
                <div class="iu-row-text">
                    <div class="iu-row-name">@${escapeHTML(user.username)}</div>
                    <div class="iu-row-sub">${escapeHTML(user.full_name || "")}</div>
                </div>
                <div class="iu-row-tags">${tags.join(" ")}</div>
                <div class="iu-row-actions">
                    <a class="iu-icon-btn" href="/${encodeURIComponent(user.username)}/" target="_blank" rel="noopener noreferrer" data-stop title="${escapeAttr(t("openProfile"))}" aria-label="${escapeAttr(t("openProfile"))}">${SVG.open}</a>
                    <button type="button" class="iu-icon-btn iu-text-btn" data-hide="${escapeAttr(user.id)}" data-stop title="${escapeAttr(hidden ? t("unhideTooltip") : t("hideTooltip"))}">${escapeHTML(hidden ? t("unhide") : t("hide"))}</button>
                </div>
            </div>
        `;
    }

    function bindResults(body) {
        const search = body.querySelector("[data-search]");
        if (search) {
            search.addEventListener("input", (event) => {
                state.search = event.target.value;
                const list = body.querySelector("[data-list]");
                if (list) list.innerHTML = renderUserList(getDisplayUsers());
            });
        }

        body.querySelectorAll("[data-filter]").forEach((el) => {
            el.addEventListener("click", () => {
                const key = el.getAttribute("data-filter");
                state.filters[key] = !state.filters[key];
                persist();
                renderBody();
            });
        });

        body.addEventListener("change", (event) => {
            const checkbox = event.target.closest("[data-select]");
            if (!checkbox) return;
            const id = checkbox.getAttribute("data-select");
            if (checkbox.checked) state.selected.add(id);
            else state.selected.delete(id);
            const row = checkbox.closest("[data-row]");
            if (row) row.classList.toggle("iu-row--selected", checkbox.checked);
            updateSelectedLabel(body);
        });

        body.addEventListener("click", (event) => {
            const hideBtn = event.target.closest("[data-hide]");
            if (hideBtn) {
                event.preventDefault();
                event.stopPropagation();
                const id = hideBtn.getAttribute("data-hide");
                if (state.hidden.has(id)) state.hidden.delete(id);
                else { state.hidden.add(id); state.selected.delete(id); }
                persist(); renderBody(); return;
            }
            if (event.target.closest("[data-stop]")) { event.stopPropagation(); return; }
            const row = event.target.closest("[data-row]");
            if (!row || event.target.closest(".iu-row-check")) return;
            const id = row.getAttribute("data-row");
            const checkbox = row.querySelector("[data-select]");
            if (!checkbox) return;
            if (state.selected.has(id)) { state.selected.delete(id); checkbox.checked = false; }
            else { state.selected.add(id); checkbox.checked = true; }
            row.classList.toggle("iu-row--selected", checkbox.checked);
            updateSelectedLabel(body);
        });

        body.addEventListener("keydown", (event) => {
            if (event.key !== " " && event.key !== "Enter") return;
            const row = event.target.closest("[data-row]");
            if (!row || event.target.tagName === "INPUT" || event.target.tagName === "A" || event.target.tagName === "BUTTON") return;
            event.preventDefault(); row.click();
        });

        body.querySelector("[data-action='select-all']")?.addEventListener("click", () => {
            const display = getDisplayUsers();
            const allSelected = display.length && display.every((u) => state.selected.has(u.id));
            if (allSelected) display.forEach((u) => state.selected.delete(u.id));
            else display.forEach((u) => state.selected.add(u.id));
            renderBody();
        });

        body.querySelector("[data-action='copy']")?.addEventListener("click", copyUsernames);
        body.querySelector("[data-action='unfollow']")?.addEventListener("click", confirmUnfollow);
    }

    function updateSelectedLabel(body) {
        const root = body || document.querySelector(`#${APP_ID} [data-body]`);
        if (!root) return;
        const label = root.querySelector("[data-selected-label]");
        if (label) label.textContent = t("selectedCount", { count: state.selected.size });
        const unfollowBtn = root.querySelector("[data-action='unfollow']");
        if (unfollowBtn) {
            unfollowBtn.disabled = state.selected.size === 0;
            unfollowBtn.textContent = t("unfollow") + (state.selected.size ? " (" + state.selected.size + ")" : "");
        }
        const copyBtn = root.querySelector("[data-action='copy']");
        if (copyBtn) copyBtn.textContent = state.selected.size ? t("copy") : t("copyAll");
    }

    function renderUnfollowView() {
        const total = state.progress.total;
        const done = state.progress.current;
        const percent = total ? Math.round((done / total) * 100) : 0;
        const last = state.log[state.log.length - 1];
        const summary = state.mode === "unfollowDone" ? t("unfollowDoneBody", { ok: state.log.filter((e) => e.ok).length, fail: state.log.filter((e) => !e.ok).length }) : t("ofTotal", { current: done, total });
        return `
            <div class="iu-progress">
                <div class="iu-progress-head">
                    <h2>${escapeHTML(state.mode === "unfollowDone" ? t("unfollowDoneTitle") : (state.unfollowPaused ? t("paused") : t("unfollowing")))}</h2>
                    <p data-progress-note>${escapeHTML(state.progress.note || "")}</p>
                </div>
                <div class="iu-bar"><span style="width:${percent}%"></span></div>
                <div class="iu-progress-meta">
                    <span>${escapeHTML(summary)}</span>
                    <span data-countdown class="iu-muted"></span>
                </div>
                ${last ? `
                <div class="iu-current glass-panel">
                    <span class="iu-muted">${escapeHTML(t("currently"))}</span>
                    <strong>@${escapeHTML(last.user.username)}</strong>
                    <span class="iu-tag ${last.ok ? "iu-tag--green" : "iu-tag--red"}">${last.ok ? "✓" : "✕"}</span>
                </div>` : ""}
                <div class="iu-progress-actions">
                    ${state.mode === "unfollowing" ? `
                    <button type="button" class="iu-btn" data-action="pause-unfollow">${escapeHTML(t(state.unfollowPaused ? "resume" : "pause"))}</button>
                    <button type="button" class="iu-btn iu-btn--ghost" data-action="cancel-unfollow">${escapeHTML(t("cancel"))}</button>
                    ` : `
                    <button type="button" class="iu-btn iu-btn--primary" data-action="back-results">${escapeHTML(t("goBack"))}</button>
                    `}
                </div>
            </div>
        `;
    }

    function bindUnfollow(body) {
        body.querySelector("[data-action='pause-unfollow']")?.addEventListener("click", () => {
            state.unfollowPaused = !state.unfollowPaused; renderBody();
        });
        body.querySelector("[data-action='cancel-unfollow']")?.addEventListener("click", () => {
            state.unfollowCancelled = true; state.unfollowPaused = false;
        });
        body.querySelector("[data-action='back-results']")?.addEventListener("click", () => {
            state.mode = "results"; state.log = []; state.unfollowCancelled = false; renderBody();
        });
    }

    async function startScan() {
        state.error = ""; state.mode = "scanning"; state.scanPaused = false; state.scanCancelled = false;
        state.users = []; state.followingCount = 0; state.followersCount = 0;
        state.selected.clear(); state.log = [];
        state.progress = { current: 0, total: 0, label: "loadingFollowing", note: "" };
        renderBody();

        try {
            const viewerId = getCookie("ds_user_id");
            if (!viewerId) throw new Error(t("cookieMissing"));
            const onPage = (results, totalGuess) => {
                state.progress = { current: results.length, total: totalGuess || 0, label: "loadingFollowing", note: "" };
                updateProgressDOM();
            };
            const following = await fetchFollowingWithBackStatus(viewerId, onPage);
            if (state.scanCancelled) return resetToIdle();
            state.followingCount = following.length;
            state.followersCount = following.filter((user) => user.follows_viewer).length;
            state.users = following;
            state.mode = "results";
            const nonFollowers = state.users.filter((u) => !u.follows_viewer && !state.hidden.has(u.id)).length;
            toast(t("scanCompletedToast", { count: nonFollowers }));
            renderBody();
        } catch (error) {
            console.error("[iu] scan failed:", error);
            state.error = error?.message || String(error) || t("scanFailed");
            state.mode = "idle";
            renderBody();
        }
    }

    function resetToIdle() {
        state.mode = "idle"; state.users = []; state.scanCancelled = false; state.error = ""; renderBody();
    }

    async function fetchFollowingWithBackStatus(viewerId, onPage) {
        const results = []; let cursor = ""; let page = 0; let totalGuess = 0;
        while (true) {
            await waitWhile(() => state.scanPaused && !state.scanCancelled);
            if (state.scanCancelled) return results;
            const variables = { id: viewerId, include_reel: true, fetch_mutual: false, first: 24 };
            if (cursor) variables.after = cursor;
            const url = `/graphql/query/?query_hash=3dec7e2c57367ef3da3d987d89f9dbc8&variables=${encodeURIComponent(JSON.stringify(variables))}`;
            const json = await igFetch(url);
            const edge = json?.data?.user?.edge_follow;
            if (!edge?.edges) throw new Error(t("scanFailed"));
            const users = edge.edges.map((item) => normalizeUser(item.node)).filter((u) => u.id && u.username);
            results.push(...users);
            if (!totalGuess && typeof edge.count === "number") totalGuess = edge.count;
            onPage(results, totalGuess);
            cursor = edge.page_info?.end_cursor || "";
            page += 1;
            if (!edge.page_info?.has_next_page || !cursor) break;
            await sleep(randomBetween(state.timings.scanDelayMin, state.timings.scanDelayMax));
            if (state.timings.scanPauseEveryPages > 0 && page % state.timings.scanPauseEveryPages === 0) {
                await sleepWithCountdown(state.timings.scanPauseMs, "scanPause");
            }
        }
        return dedupe(results);
    }

    async function igFetch(url, init = {}) {
        let attempt = 0;
        while (true) {
            const response = await fetch(url, { credentials: "include", headers: { ...IG_HEADERS, ...(init.headers || {}) }, ...init });
            if (response.ok) return response.json();
            if (response.status === 429 || (response.status >= 500 && response.status < 600)) {
                if (attempt >= MAX_RETRIES) {
                    if (response.status === 429) throw new Error(t("tooManyRequests"));
                    throw new Error(t("requestFailed", { status: response.status }));
                }
                const retryAfter = parseRetryAfter(response.headers.get("retry-after"));
                const wait = retryAfter || Math.min(60000, 5000 * Math.pow(2, attempt));
                await sleepWithCountdown(wait, "cooldownIn");
                attempt += 1;
                continue;
            }
            throw new Error(t("requestFailed", { status: response.status }));
        }
    }

    function parseRetryAfter(value) {
        if (!value) return 0;
        const seconds = Number(value);
        if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
        const date = Date.parse(value);
        if (!Number.isNaN(date)) return Math.max(0, date - Date.now());
        return 0;
    }

    function confirmUnfollow() {
        if (!state.selected.size) return;
        const count = state.selected.size;
        showDialog({
            title: t("unfollowConfirmTitle", { count }),
            body: t("unfollowConfirmBody"),
            confirmLabel: t("unfollowConfirmBtn", { count }),
            destructive: true,
            onConfirm: () => startUnfollow()
        });
    }

    async function startUnfollow() {
        const targets = state.users.filter((u) => state.selected.has(u.id));
        if (!targets.length) return;
        const csrf = getCookie("csrftoken");
        if (!csrf) { toast(t("csrfMissing")); return; }
        
        state.mode = "unfollowing"; state.unfollowPaused = false; state.unfollowCancelled = false;
        state.log = []; state.progress = { current: 0, total: targets.length, label: "unfollowing", note: "" };
        renderBody();

        let processed = 0;
        for (let i = 0; i < targets.length; i += 1) {
            await waitWhile(() => state.unfollowPaused && !state.unfollowCancelled);
            if (state.unfollowCancelled) break;
            const user = targets[i]; let ok = false;
            try { ok = await unfollowUser(user.id, csrf); } catch (error) { console.error("[iu] unfollow failed for", user.username, error); }
            state.log.push({ user, ok });
            if (ok) {
                state.selected.delete(user.id);
                const userRef = state.users.find((u) => u.id === user.id);
                if (userRef) userRef.unfollowed = true;
            }
            processed += 1;
            state.progress = { current: processed, total: targets.length, label: "unfollowing", note: "" };
            renderBody();
            const isLast = i === targets.length - 1;
            if (!isLast) {
                await sleepWithCountdown(randomBetween(state.timings.unfollowDelayMin, state.timings.unfollowDelayMax), "nextActionIn");
                if (state.timings.unfollowPauseEvery > 0 && (i + 1) % state.timings.unfollowPauseEvery === 0) {
                    await sleepWithCountdown(state.timings.unfollowPauseMs, "cooldownIn");
                }
            }
        }
        state.users = state.users.filter((u) => !u.unfollowed);
        state.mode = "unfollowDone"; state.waitUntil = 0; state.waitReason = "";
        renderBody();
    }

    async function unfollowUser(id, csrf) {
        const headers = { "content-type": "application/x-www-form-urlencoded", "x-csrftoken": csrf };
        let response = await fetch(`/api/v1/friendships/destroy/${id}/`, { method: "POST", credentials: "include", headers: { ...IG_HEADERS, ...headers } });
        if (response.ok) return true;
        response = await fetch(`/web/friendships/${id}/unfollow/`, { method: "POST", credentials: "include", headers: { ...IG_HEADERS, ...headers } });
        return response.ok;
    }

    async function copyUsernames() {
        const display = getDisplayUsers();
        const target = state.selected.size ? display.filter((u) => state.selected.has(u.id)) : display;
        if (!target.length) return;
        const text = target.map((u) => u.username).sort().join("\n");
        try {
            await navigator.clipboard.writeText(text);
            toast(t("copiedToast", { count: target.length }));
        } catch (error) {
            console.error("[iu] copy failed:", error);
            const ta = document.createElement("textarea");
            ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
            document.body.appendChild(ta); ta.select();
            try { document.execCommand("copy"); toast(t("copiedToast", { count: target.length })); } catch {}
            ta.remove();
        }
    }

    function showSettings() {
        const fields = [
            ["scanDelayMin", "minScanDelay", 100], ["scanDelayMax", "maxScanDelay", 100],
            ["scanPauseEveryPages", "scanPauseEvery", 1], ["scanPauseMs", "scanPauseLength", 1000],
            ["unfollowDelayMin", "minUnfollowDelay", 1000], ["unfollowDelayMax", "maxUnfollowDelay", 1000],
            ["unfollowPauseEvery", "unfollowPauseEvery", 1], ["unfollowPauseMs", "unfollowPauseLength", 1000]
        ];
        const formHTML = fields.map(([key, label, step]) => `
            <label class="iu-field">
                <span>${escapeHTML(t(label))}</span>
                <input type="number" min="0" step="${step}" data-setting="${escapeAttr(key)}" value="${Number(state.timings[key])}">
            </label>
        `).join("");
        showDialog({
            title: t("settingsTitle"), body: t("settingsBody"), contentHTML: `<div class="iu-form">${formHTML}</div>`,
            confirmLabel: t("save"), extraButton: { label: t("restoreDefaults"), action: "restore" },
            onConfirm: (dialog) => {
                dialog.querySelectorAll("[data-setting]").forEach((input) => {
                    const key = input.getAttribute("data-setting"); const val = Number(input.value);
                    if (Number.isFinite(val) && val >= 0) state.timings[key] = val;
                });
                persist(); toast(t("saved"));
            },
            onExtra: (dialog) => {
                Object.assign(state.timings, DEFAULT_TIMINGS);
                dialog.querySelectorAll("[data-setting]").forEach((input) => {
                    const key = input.getAttribute("data-setting"); input.value = state.timings[key];
                });
            }
        });
    }

    function showDialog({ title, body, contentHTML, confirmLabel, destructive, extraButton, onConfirm, onExtra }) {
        const overlay = document.createElement("div");
        overlay.className = "iu-overlay";
        overlay.innerHTML = `
            <div class="iu-dialog glass-panel" role="dialog" aria-modal="true">
                <h3>${escapeHTML(title)}</h3>
                ${body ? `<p>${escapeHTML(body)}</p>` : ""}
                ${contentHTML || ""}
                <div class="iu-dialog-actions">
                    ${extraButton ? `<button type="button" class="iu-btn iu-btn--ghost iu-btn--small" data-extra>${escapeHTML(extraButton.label)}</button>` : ""}
                    <button type="button" class="iu-btn iu-btn--small" data-cancel>${escapeHTML(t("cancel"))}</button>
                    <button type="button" class="iu-btn iu-btn--small ${destructive ? "iu-btn--danger" : "iu-btn--primary"}" data-confirm>${escapeHTML(confirmLabel)}</button>
                </div>
            </div>
        `;
        document.getElementById(APP_ID).appendChild(overlay);
        const close = () => overlay.remove();
        overlay.addEventListener("click", (event) => { if (event.target === overlay) close(); });
        overlay.querySelector("[data-cancel]").addEventListener("click", close);
        overlay.querySelector("[data-confirm]").addEventListener("click", () => {
            try { onConfirm?.(overlay.querySelector(".iu-dialog")); } finally { close(); }
        });
        if (extraButton && onExtra) {
            overlay.querySelector("[data-extra]").addEventListener("click", () => onExtra(overlay.querySelector(".iu-dialog")));
        }
    }

    function toggleLanguage() {
        state.language = state.language === "tr" ? "en" : "tr";
        persist(); renderShell();
    }

    function getDisplayUsers() {
        const query = state.search.trim().toLowerCase();
        return state.users
            .filter((u) => !u.follows_viewer)
            .filter((u) => state.filters.showHidden ? true : !state.hidden.has(u.id))
            .filter((u) => state.filters.verified || !u.is_verified)
            .filter((u) => state.filters.private || !u.is_private)
            .filter((u) => state.filters.noAvatar || !isDefaultAvatar(u))
            .filter((u) => !query || (u.username + " " + (u.full_name || "")).toLowerCase().includes(query))
            .sort((a, b) => a.username.localeCompare(b.username));
    }

    function normalizeUser(raw) {
        return {
            id: String(raw.id || raw.pk || raw.pk_id || ""),
            username: String(raw.username || ""),
            full_name: String(raw.full_name || ""),
            profile_pic_url: String(raw.profile_pic_url || raw.profile_pic_url_hd || ""),
            is_verified: Boolean(raw.is_verified),
            is_private: Boolean(raw.is_private),
            follows_viewer: Boolean(raw.follows_viewer ?? raw.friendship_status?.followed_by ?? raw.followed_by)
        };
    }

    function dedupe(list) {
        const seen = new Set();
        return list.filter((u) => { if (!u.id || seen.has(u.id)) return false; seen.add(u.id); return true; });
    }

    function isDefaultAvatar(user) {
        const url = user.profile_pic_url || "";
        return /44884218_345707102882519|464760996_1254146839119862/.test(url);
    }

    function getCookie(name) {
        const match = document.cookie.match(new RegExp("(^|; )" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "=([^;]*)"));
        return match ? decodeURIComponent(match[2]) : null;
    }

    function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, Math.max(0, ms))); }

    function randomBetween(min, max) {
        const lo = Math.min(min, max); const hi = Math.max(min, max);
        return Math.floor(Math.random() * (hi - lo + 1)) + lo;
    }

    async function waitWhile(predicate, interval = 200) {
        while (predicate()) await sleep(interval);
    }

    async function sleepWithCountdown(ms, reasonKey) {
        state.waitUntil = Date.now() + ms; state.waitReason = reasonKey; updateCountdownDOM();
        const start = Date.now();
        while (Date.now() - start < ms) {
            if (state.scanCancelled || state.unfollowCancelled) break;
            await sleep(Math.min(250, ms - (Date.now() - start)));
            if (state.scanPaused || state.unfollowPaused) {
                const pauseStart = Date.now();
                await waitWhile(() => state.scanPaused || state.unfollowPaused);
                state.waitUntil += Date.now() - pauseStart;
                updateCountdownDOM();
            }
        }
        state.waitUntil = 0; state.waitReason = ""; updateCountdownDOM();
    }

    function startCountdown() {
        if (countdownTimer) return;
        countdownTimer = setInterval(updateCountdownDOM, 500);
    }

    function stopCountdown() {
        if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null; }
    }

    function updateCountdownDOM() {
        const node = document.querySelector(`#${APP_ID} [data-countdown]`);
        if (!node) return;
        if (!state.waitUntil) { node.textContent = ""; return; }
        const remaining = Math.max(0, Math.ceil((state.waitUntil - Date.now()) / 1000));
        const reason = state.waitReason || "nextActionIn";
        node.textContent = t(reason, { seconds: remaining });
    }

    function updateProgressDOM() {
        const root = document.querySelector(`#${APP_ID} [data-body]`);
        if (!root) return;
        const { current, total, label, note } = state.progress;
        const percent = total ? Math.min(100, Math.round((current / total) * 100)) : 0;
        const bar = root.querySelector("[data-progress-bar]");
        if (bar) bar.style.width = percent + "%";
        const counter = root.querySelector("[data-progress-counter]");
        if (counter) counter.textContent = total ? t("ofTotal", { current, total }) : t("ofUnknown", { current });
        const labelEl = root.querySelector("[data-progress-label]");
        if (labelEl) labelEl.textContent = state.scanPaused ? t("paused") : t(label);
        const noteEl = root.querySelector("[data-progress-note]");
        if (noteEl) noteEl.textContent = note || "";
        if (state.minimized) {
            const pillLabelEl = document.querySelector(`#${APP_ID} [data-pill-label]`);
            if (pillLabelEl) pillLabelEl.textContent = pillLabel();
        }
    }

    function toast(message) {
        const root = document.getElementById(APP_ID);
        if (!root) return;
        root.querySelector(".iu-toast")?.remove();
        if (toastTimer) { clearTimeout(toastTimer); toastTimer = null; }
        const node = document.createElement("div");
        node.className = "iu-toast"; node.textContent = message;
        root.appendChild(node);
        toastTimer = setTimeout(() => { node.remove(); toastTimer = null; }, 3500);
    }

    function clamp(value, min, max) { return Math.min(Math.max(value, min), max); }

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
    }
    function escapeAttr(value) { return escapeHTML(value); }

    // --- CYBERPUNK & GLASSMORPHISM CSS ---
    const CSS = `
    #${APP_ID}, #${APP_ID} * { box-sizing: border-box; font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif; }
    #${APP_ID} {
        --iu-bg: rgba(18, 20, 26, 0.75);
        --iu-bg-2: rgba(30, 34, 45, 0.6);
        --iu-bg-3: rgba(40, 45, 60, 0.8);
        --iu-line: rgba(255,255,255,0.08);
        --iu-line-strong: rgba(0, 242, 254, 0.3);
        --iu-text: #f1f3f5;
        --iu-muted: #8b94a3;
        --iu-accent: #00f2fe;
        --iu-accent-2: #4facfe;
        --iu-danger: #ff4b4b;
        --iu-success: #00e676;
        position: fixed; inset: 0; pointer-events: none; z-index: 2147483647; color: var(--iu-text); font-size: 14px;
    }
    #${APP_ID} > * { pointer-events: auto; }
    #${APP_ID} button, #${APP_ID} input, #${APP_ID} a { font: inherit; color: inherit; }
    #${APP_ID} a { text-decoration: none; }

    .glass-panel {
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.05);
    }

    #${APP_ID} .iu-panel {
        position: absolute; width: ${PANEL_WIDTH}px; max-width: calc(100vw - 24px); max-height: calc(100vh - 24px);
        display: flex; flex-direction: column; background: var(--iu-bg); border-radius: 16px; overflow: hidden;
        animation: iu-pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    @keyframes iu-pop { from { opacity: 0; transform: translateY(15px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }

    #${APP_ID} .iu-header {
        flex-shrink: 0; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 16px;
        border-bottom: 1px solid var(--iu-line); cursor: grab; user-select: none;
        background: linear-gradient(180deg, rgba(255,255,255,0.05), transparent);
    }
    #${APP_ID} .iu-header.iu-dragging { cursor: grabbing; }
    #${APP_ID} .iu-brand { display: flex; align-items: center; gap: 12px; min-width: 0; }
    #${APP_ID} .iu-brand-dot { width: 12px; height: 12px; border-radius: 50%; background: linear-gradient(135deg, var(--iu-accent), var(--iu-accent-2)); flex-shrink: 0; box-shadow: 0 0 10px var(--iu-accent); }
    #${APP_ID} .iu-brand-text { min-width: 0; }
    #${APP_ID} .iu-brand-text strong { display: block; font-size: 15px; font-weight: 700; text-shadow: 0 0 8px rgba(0,242,254,0.3); }
    #${APP_ID} .iu-brand-text span { display: block; font-size: 11px; color: var(--iu-accent-2); text-transform: uppercase; letter-spacing: 0.5px;}
    #${APP_ID} .iu-header-actions { display: flex; gap: 6px; flex-shrink: 0; }
    #${APP_ID} .iu-header-actions button { width: 30px; height: 30px; display: grid; place-items: center; border: none; background: rgba(255,255,255,0.05); border-radius: 8px; color: var(--iu-muted); transition: all 0.2s; font-size: 11px; font-weight: 600; }
    #${APP_ID} .iu-header-actions button:hover { background: var(--iu-accent); color: #000; box-shadow: 0 0 10px var(--iu-accent); }

    #${APP_ID} .iu-body { flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; overflow-y: auto; }
    #${APP_ID} .iu-body::-webkit-scrollbar { width: 4px; }
    #${APP_ID} .iu-body::-webkit-scrollbar-track { background: transparent; }
    #${APP_ID} .iu-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }
    #${APP_ID} .iu-body::-webkit-scrollbar-thumb:hover { background: var(--iu-accent); }

    #${APP_ID} .iu-welcome { padding: 35px 22px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 12px; }
    #${APP_ID} .glowing-icon { filter: drop-shadow(0 0 12px rgba(0,242,254,0.6)); }
    #${APP_ID} .iu-welcome h2 { margin: 0; font-size: 18px; font-weight: 700; color: #fff; }
    #${APP_ID} .iu-welcome p { margin: 0; color: var(--iu-muted); font-size: 13px; max-width: 300px; line-height: 1.6; }

    #${APP_ID} .iu-btn { border: 1px solid var(--iu-line); background: var(--iu-bg-2); color: var(--iu-text); padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; transition: all 0.2s; }
    #${APP_ID} .iu-btn:hover:not(:disabled) { background: rgba(255,255,255,0.1); border-color: var(--iu-accent-2); }
    #${APP_ID} .iu-btn:active:not(:disabled) { transform: scale(0.95); }
    #${APP_ID} .iu-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    
    #${APP_ID} .iu-btn--primary { background: linear-gradient(135deg, var(--iu-accent), var(--iu-accent-2)); border: none; color: #000; }
    #${APP_ID} .glow-btn:hover { box-shadow: 0 0 15px rgba(0, 242, 254, 0.6); transform: translateY(-1px); }
    #${APP_ID} .iu-btn--danger { background: rgba(255, 75, 75, 0.15); border-color: var(--iu-danger); color: var(--iu-danger); }
    #${APP_ID} .iu-btn--danger:hover:not(:disabled) { background: var(--iu-danger); color: #fff; box-shadow: 0 0 12px rgba(255, 75, 75, 0.6); }

    #${APP_ID} .iu-progress { padding: 25px 20px; display: flex; flex-direction: column; gap: 16px; }
    #${APP_ID} .iu-progress-head h2 { margin: 0; font-size: 16px; font-weight: 600; color: var(--iu-accent); text-shadow: 0 0 5px rgba(0,242,254,0.3); }
    #${APP_ID} .iu-bar { height: 8px; border-radius: 4px; background: rgba(0,0,0,0.5); overflow: hidden; box-shadow: inset 0 1px 3px rgba(0,0,0,0.5); }
    #${APP_ID} .iu-bar > span { display: block; height: 100%; background: linear-gradient(90deg, var(--iu-accent), var(--iu-accent-2)); transition: width 0.3s ease; box-shadow: 0 0 10px rgba(0,242,254,0.5); }
    #${APP_ID} .iu-current { padding: 12px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.05); }

    #${APP_ID} .iu-search { width: 100%; height: 40px; padding: 0 14px; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; background: rgba(0,0,0,0.3); color: #fff; outline: none; transition: all 0.2s; font-size: 13px; }
    #${APP_ID} .iu-search:focus { border-color: var(--iu-accent); box-shadow: 0 0 8px rgba(0,242,254,0.2); }

    /* Filtre çipleri */
    #${APP_ID} .iu-chip {
        display: inline-flex; align-items: center; gap: 6px;
        padding: 6px 12px;
        border-radius: 20px;
        border: 1px solid rgba(255,255,255,0.15);
        background: rgba(255,255,255,0.03);
        font-size: 12px; font-weight: 500;
        transition: all 0.25s ease;
        cursor: pointer;
        color: var(--iu-muted);
        white-space: nowrap;
    }
    #${APP_ID} .iu-chip:hover {
        border-color: var(--iu-accent-2);
        background: rgba(255,255,255,0.06);
    }
    #${APP_ID} .iu-chip--on {
        background: rgba(0,242,254,0.12);
        border-color: var(--iu-accent);
        color: var(--iu-accent);
        text-shadow: 0 0 6px rgba(0,242,254,0.4);
        box-shadow: 0 0 12px rgba(0,242,254,0.15);
    }
    #${APP_ID} .iu-chip-indicator {
        width: 8px; height: 8px; border-radius: 50%;
        background: rgba(255,255,255,0.2);
        transition: background 0.25s, box-shadow 0.25s;
    }
    #${APP_ID} .iu-chip--on .iu-chip-indicator {
        background: var(--iu-accent);
        box-shadow: 0 0 6px var(--iu-accent);
    }

    /* KULLANICI SATIRI */
    #${APP_ID} .iu-row {
        display: flex; align-items: center; gap: 10px; padding: 8px 12px;
        border-bottom: 1px solid rgba(255,255,255,0.03);
        transition: background 0.15s ease;
        cursor: pointer;
    }
    #${APP_ID} .iu-row:hover { background: rgba(255,255,255,0.04); }
    #${APP_ID} .iu-row--selected { background: rgba(0,242,254,0.08); border-left: 2px solid var(--iu-accent); }

    #${APP_ID} .iu-row-check {
        accent-color: var(--iu-accent);
        width: 16px; height: 16px; margin: 0; flex-shrink: 0;
    }
    #${APP_ID} .iu-avatar {
        width: 32px; height: 32px; border-radius: 50%; object-fit: cover;
        flex-shrink: 0; background: rgba(255,255,255,0.1);
    }
    #${APP_ID} .iu-row-text {
        flex: 1 1 auto; min-width: 0;
        display: flex; flex-direction: column; gap: 1px;
    }
    #${APP_ID} .iu-row-name {
        font-size: 13px; font-weight: 600; color: #fff;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    #${APP_ID} .iu-row-name a { color: inherit; }
    #${APP_ID} .iu-row-name a:hover { color: var(--iu-accent); }
    #${APP_ID} .iu-row-sub {
        font-size: 11px; color: var(--iu-muted);
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    #${APP_ID} .iu-row-tags {
        display: flex; gap: 4px; flex-shrink: 0; margin-left: auto;
    }
    #${APP_ID} .iu-row-actions {
        display: flex; gap: 4px; flex-shrink: 0; opacity: 0.6; transition: opacity 0.2s;
    }
    #${APP_ID} .iu-row:hover .iu-row-actions { opacity: 1; }

    #${APP_ID} .iu-tag {
        font-size: 10px; padding: 2px 6px; border-radius: 10px;
        background: rgba(255,255,255,0.08); color: var(--iu-muted);
    }
    #${APP_ID} .iu-tag--cyan { background: rgba(0,242,254,0.15); color: var(--iu-accent); }

    #${APP_ID} .iu-actionbar { background: rgba(18,20,26,0.9); backdrop-filter: blur(10px); border-top: 1px solid rgba(255,255,255,0.08); }

    #${APP_ID} .iu-toast { background: rgba(18,20,26,0.9); border: 1px solid var(--iu-accent); box-shadow: 0 0 15px rgba(0,242,254,0.3); color: var(--iu-accent); font-weight: 600; padding: 10px 18px; }

    #${APP_ID} .iu-pill { background: rgba(18,20,26,0.8); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.1); }
    #${APP_ID} .iu-pill:hover { border-color: var(--iu-accent); box-shadow: 0 0 12px rgba(0,242,254,0.2); }
    #${APP_ID} .iu-pill-dot--active { background: var(--iu-accent); box-shadow: 0 0 8px var(--iu-accent); }

    /* FOOTER */
    #${APP_ID} .iu-footer {
        flex-shrink: 0;
        padding: 6px 16px;
        border-top: 1px solid rgba(255,255,255,0.05);
        display: flex; align-items: center; justify-content: center; gap: 8px;
        font-size: 11px; color: var(--iu-muted);
    }
    #${APP_ID} .iu-footer a {
        color: var(--iu-accent-2);
        font-weight: 500;
        transition: color 0.2s;
    }
    #${APP_ID} .iu-footer a:hover { color: var(--iu-accent); text-decoration: underline; }
    `;

    cleanupExisting();
    injectStyles();
    mount();
})();
