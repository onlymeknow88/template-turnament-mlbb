// Normalisasi nama hero agar sesuai dengan nama file di folder images/HeroBan dan images/HeroPick
function getHeroImageName(heroName, type) {
    if (!heroName) return "idle.png";
    
    // Konversi nama dasar ke lowercase
    let cleaned = heroName.toLowerCase().trim();
    
    // Atur mapping khusus untuk perbedaan nama file
    if (type === "ban") {
        const banMapping = {
            "baxia": "Baxia",
            "belerick": "Beleric",
            "benedetta": "Benedeta",
            "cecilion": "Cecilion",
            "chang'e": "Change",
            "paquito": "Pauqito",
            "arlott": "arlot",
            "carmilla": "carmila",
            "fredrinn": "fredrin",
            "karrie": "karie",
            "lapu-lapu": "lapu lapu",
            "luo yi": "luoyi",
            "minotaur": "minotour",
            "pharsa": "parsha",
            "popol and kupa": "popol",
            "silvanna": "silvana",
            "x.borg": "xborg",
            "yi sun-shin": "yisunshin",
            "yu zhong": "yuzhong",
            "dyrroth": "dyroth",
            "kalea": "kalea.webp",
            "marcel": "marcel.webp",
            "obsidia": "Obsidia.webp",
            "sora": "sora.webp"
        };
        if (banMapping[cleaned]) {
            const val = banMapping[cleaned];
            return val.includes(".") ? val : val + ".png";
        }
    } else { // type === "pick"
        const pickMapping = {
            "belerick": "beleric",
            "benedetta": "benedetta",
            "chang'e": "chang'e",
            "paquito": "paquito",
            "lapu-lapu": "lapu lapu",
            "luo yi": "luo yi",
            "minotaur": "minotour",
            "natan": "nathan",
            "popol and kupa": "popol and kupa",
            "x.borg": "xborg",
            "yi sun-shin": "yisunshin",
            "yu zhong": "yuzhong",
            "arlott": "arlot",
            "carmilla": "carmila",
            "fredrinn": "fredrin",
            "pharsa": "parsha",
            "dyrroth": "dyroth",
            "kalea": "kalea.webp",
            "marcel": "marcel.webp",
            "obsidia": "Obsidia.webp",
            "sora": "sora.webp",
            "zetian": "zetian.jpg",
            "lukas": "lukas.jpg"
        };
        if (pickMapping[cleaned]) {
            const val = pickMapping[cleaned];
            return val.includes(".") ? val : val + ".png";
        }
    }
    
    // Default fallback normalisasi umum:
    // hilangkan titik (.), petik ('), hubungkan spasi atau tanda hubung jika ada
    cleaned = cleaned
        .replace(/\./g, "")
        .replace(/'/g, "");
    
    return cleaned + ".png";
}

// Fungsi pembantu untuk fallback ekstensi file gambar (.png -> .webp -> .jpg -> svg placeholder)
function handleImageError(img) {
    if (!img || !img.src) return;
    const currentSrc = img.src;
    
    if (currentSrc.endsWith(".png")) {
        // Coba ganti ke .webp
        img.src = currentSrc.substring(0, currentSrc.lastIndexOf(".png")) + ".webp";
    } else if (currentSrc.endsWith(".webp")) {
        // Coba ganti ke .jpg
        img.src = currentSrc.substring(0, currentSrc.lastIndexOf(".webp")) + ".jpg";
    } else {
        // Fallback terakhir jika semua ekstensi di atas tidak ada
        const heroName = img.alt || "Hero";
        img.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="106" viewBox="0 0 80 106"><rect width="80" height="106" fill="%231e293b"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-size="10">${heroName.substring(0,2)}</text></svg>`;
    }
}


document.addEventListener("DOMContentLoaded", async () => {

    // Inisialisasi draft manager & penampung hero
    const draft = new DraftManager();
    let allHeroes = [];
    let activeRoleFilter = "all";
    let activeSearchQuery = "";

    const isController = document.body.classList.contains("controller-body");

    // Load data hero dari API atau fallback
    allHeroes = await fetchHeroes();
    allHeroes.sort((a, b) => a.name.localeCompare(b.name));

    if (isController) {
        // ==========================================
        //  LOGIKA HALAMAN OPERATOR (CONTROLLER)
        // ==========================================
        
        // DOM Elements
        const heroesGrid = document.getElementById("heroes-grid-container");
        const searchInput = document.getElementById("search-heroes");
        const filterContainer = document.getElementById("role-filters-container");
        
        const stepBanner = document.getElementById("step-banner-display");
        const timerCtrlDisplay = document.getElementById("timer-ctrl-display");
        
        const btnStart = document.getElementById("btn-start-draft");
        const btnPause = document.getElementById("btn-pause-timer");
        const btnUndo = document.getElementById("btn-undo");
        const btnReset = document.getElementById("btn-reset");

        // Form inputs
        const blueNameCtrl = document.getElementById("blue-name-ctrl");
        const blueCoachCtrl = document.getElementById("blue-coach-ctrl");
        const redNameCtrl = document.getElementById("red-name-ctrl");
        const redCoachCtrl = document.getElementById("red-coach-ctrl");

        const playerInputsBlue = document.querySelectorAll(".player-input-blue");
        const playerInputsRed = document.querySelectorAll(".player-input-red");

        // Set awal data input dari storage jika ada
        syncFormInputsFromManager();

        // Bind events untuk text inputs agar langsung menyimpan data ke state & storage
        blueNameCtrl.addEventListener("input", (e) => {
            draft.blueTeam.name = e.target.value.trim() || "BLUE TEAM";
            draft.saveToStorage();
            draft.notifyStateChange();
        });
        blueCoachCtrl.addEventListener("input", (e) => {
            draft.blueTeam.coach = e.target.value.trim() || "GIEE Coach";
            draft.saveToStorage();
            draft.notifyStateChange();
        });
        redNameCtrl.addEventListener("input", (e) => {
            draft.redTeam.name = e.target.value.trim() || "RED TEAM";
            draft.saveToStorage();
            draft.notifyStateChange();
        });
        redCoachCtrl.addEventListener("input", (e) => {
            draft.redTeam.coach = e.target.value.trim() || "BOOYO Coach";
            draft.saveToStorage();
            draft.notifyStateChange();
        });

        playerInputsBlue.forEach(input => {
            input.addEventListener("input", (e) => {
                const idx = parseInt(e.target.dataset.index);
                draft.blueTeam.players[idx] = e.target.value.trim() || `Player ${idx+1}`;
                draft.saveToStorage();
                draft.notifyStateChange();
            });
        });

        playerInputsRed.forEach(input => {
            input.addEventListener("input", (e) => {
                const idx = parseInt(e.target.dataset.index);
                draft.redTeam.players[idx] = e.target.value.trim() || `Player ${idx+1}`;
                draft.saveToStorage();
                draft.notifyStateChange();
            });
        });

        // Setup Search & Filter
        searchInput.addEventListener("input", (e) => {
            activeSearchQuery = e.target.value;
            renderHeroPool();
        });

        filterContainer.addEventListener("click", (e) => {
            if (e.target.classList.contains("filter-btn")) {
                filterContainer.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
                e.target.classList.add("active");
                activeRoleFilter = e.target.dataset.role;
                renderHeroPool();
            }
        });

        // Setup Button Controls
        btnStart.addEventListener("click", () => {
            draft.startDraft();
        });

        btnPause.addEventListener("click", () => {
            draft.togglePauseTimer();
        });

        btnUndo.addEventListener("click", () => {
            draft.undo();
        });

        btnReset.addEventListener("click", () => {
            if (confirm("Reset seluruh draft? Semua pilihan hero dan nama akan diulang.")) {
                draft.reset(true);
                syncFormInputsFromManager();
                
                // Reset form pencarian & filter hero pool
                searchInput.value = "";
                activeSearchQuery = "";
                activeRoleFilter = "all";
                filterContainer.querySelectorAll(".filter-btn").forEach(btn => {
                    btn.classList.remove("active");
                    if (btn.dataset.role === "all") btn.classList.add("active");
                });

                timerCtrlDisplay.textContent = "30";
                timerCtrlDisplay.classList.remove("urgent");
            }
        });

        // Render functions
        function renderHeroPool() {
            heroesGrid.innerHTML = "";
            const filtered = allHeroes.filter(hero => {
                const matchesRole = activeRoleFilter === "all" || hero.role.toLowerCase() === activeRoleFilter.toLowerCase();
                const matchesSearch = hero.name.toLowerCase().includes(activeSearchQuery.toLowerCase());
                return matchesRole && matchesSearch;
            });

            if (filtered.length === 0) {
                heroesGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px 0;">No heroes found</div>`;
                return;
            }

            filtered.forEach(hero => {
                const card = document.createElement("div");
                card.className = "hero-card";
                if (draft.usedHeroIds.has(hero.id)) {
                    card.classList.add("disabled");
                }

                const img = document.createElement("img");
                img.src = "images/HeroPick/" + getHeroImageName(hero.name, "pick");
                img.alt = hero.name;
                img.loading = "lazy";
                img.onerror = () => {
                    handleImageError(img);
                };


                const nameLabel = document.createElement("div");
                nameLabel.className = "hero-card-name";
                nameLabel.textContent = hero.name;

                card.appendChild(img);
                card.appendChild(nameLabel);

                card.addEventListener("click", () => {
                    if (draft.status !== "ACTIVE") return;
                    if (draft.usedHeroIds.has(hero.id)) return;
                    draft.selectHero(hero);
                });

                heroesGrid.appendChild(card);
            });
        }

        function syncFormInputsFromManager() {
            blueNameCtrl.value = draft.blueTeam.name;
            blueCoachCtrl.value = draft.blueTeam.coach;
            redNameCtrl.value = draft.redTeam.name;
            redCoachCtrl.value = draft.redTeam.coach;

            playerInputsBlue.forEach(input => {
                const idx = parseInt(input.dataset.index);
                input.value = draft.blueTeam.players[idx] || "";
            });
            playerInputsRed.forEach(input => {
                const idx = parseInt(input.dataset.index);
                input.value = draft.redTeam.players[idx] || "";
            });
        }

        // Attach callbacks ke DraftManager
        draft.onStateChange = (state) => {
            // Update Banner & Buttons
            if (state.status === "IDLE") {
                stepBanner.textContent = "Waiting to Start";
                btnStart.disabled = false;
                btnPause.disabled = true;
                btnUndo.disabled = true;
            } else if (state.status === "ACTIVE") {
                const step = state.currentStep;
                stepBanner.textContent = `${step.phase} - ${step.team.toUpperCase()} ${step.type.toUpperCase()}`;
                btnStart.disabled = true;
                btnPause.disabled = false;
                btnPause.textContent = state.isTimerPaused ? "▶ Resume" : "⏸ Pause";
                btnUndo.disabled = !state.canUndo;
            } else if (state.status === "DONE") {
                stepBanner.textContent = "DRAFT COMPLETED";
                btnStart.disabled = true;
                btnPause.disabled = true;
                btnUndo.disabled = !state.canUndo;
            }

            // Render ulang status slot di halaman controller
            updateTeamControllerSlots("blue", state.blueTeam, state.currentStep, state.status);
            updateTeamControllerSlots("red", state.redTeam, state.currentStep, state.status);
            renderHeroPool();
        };

        draft.onTimerTick = (time) => {
            timerCtrlDisplay.textContent = time;
            if (time < 10) {
                timerCtrlDisplay.classList.add("urgent");
            } else {
                timerCtrlDisplay.classList.remove("urgent");
            }
        };

        function updateTeamControllerSlots(team, teamData, currentStep, draftStatus) {
            // Update Ban slots di controller
            const banSlots = document.querySelectorAll(`.${team}-side .ban-slot`);
            banSlots.forEach((slot, index) => {
                const hero = teamData.bans[index];
                slot.className = "ban-slot";
                slot.innerHTML = "";
                if (hero) {
                    slot.classList.add("filled");
                    const img = document.createElement("img");
                    img.src = "images/HeroBan/" + getHeroImageName(hero.name, "ban");
                    img.alt = hero.name;
                    img.onerror = () => {
                        handleImageError(img);
                    };
                    slot.appendChild(img);

                }
                if (draftStatus === "ACTIVE" && currentStep && currentStep.team === team && currentStep.type === "ban" && currentStep.slotIndex === index) {
                    slot.classList.add("active");
                }
            });

            // Update Pick slots di controller
            const pickSlots = document.querySelectorAll(`.${team}-side .pick-slot`);
            pickSlots.forEach((slot, index) => {
                const hero = teamData.picks[index];
                const nameEl = slot.querySelector(".hero-name");
                const roleEl = slot.querySelector(".role-badge");
                const bgEl = slot.querySelector(".hero-bg");
                slot.className = "pick-slot";

                if (hero) {
                    slot.classList.add("filled");
                    nameEl.textContent = hero.name;
                    roleEl.textContent = hero.role;
                    bgEl.src = "images/HeroPick/" + getHeroImageName(hero.name, "pick");
                    bgEl.alt = hero.name;
                    bgEl.onerror = () => {
                        handleImageError(bgEl);
                    };

                } else {
                    nameEl.textContent = `Slot ${index + 1}`;
                    roleEl.textContent = "-";
                    bgEl.src = "";
                }

                if (draftStatus === "ACTIVE" && currentStep && currentStep.team === team && currentStep.type === "pick" && currentStep.slotIndex === index) {
                    slot.classList.add("active");
                }
            });
        }

        // Panggil render controller awal
        renderHeroPool();
        draft.notifyStateChange();

    } else {
        // ==========================================
        //  LOGIKA HALAMAN OVERLAY (INDEX.HTML / OBS)
        // ==========================================

        const blueTeamAbbrev = document.getElementById("blue-team-abbrev");
        const redTeamAbbrev = document.getElementById("red-team-abbrev");
        const blueCoachName = document.getElementById("blue-coach-name");
        const redCoachName = document.getElementById("red-coach-name");
        const timerBox = document.getElementById("timer-box");

        function renderOverlay() {
            // Load state terbaru dari LocalStorage
            draft.loadFromStorage();
            const state = {
                status: draft.status,
                currentStep: draft.getCurrentStep(),
                blueTeam: draft.blueTeam,
                redTeam: draft.redTeam,
                timerValue: draft.timerValue
            };

            // 1. Update Header Team Names
            blueTeamAbbrev.textContent = state.blueTeam.name;
            redTeamAbbrev.textContent = state.redTeam.name;

            // 2. Update Coach Names
            blueCoachName.textContent = state.blueTeam.coach;
            redCoachName.textContent = state.redTeam.coach;

            // 3. Update Timer Display
            const time = state.timerValue;
            timerBox.textContent = `LAST 0:${time < 10 ? '0' + time : time}`;
            if (time < 10 && state.status === "ACTIVE") {
                timerBox.classList.add("urgent");
            } else {
                timerBox.classList.remove("urgent");
            }

            // 4. Render Blue Team Ban & Picks
            updateOverlayTeamSlots("blue", state.blueTeam, state.currentStep, state.status);
            
            // 5. Render Red Team Ban & Picks
            updateOverlayTeamSlots("red", state.redTeam, state.currentStep, state.status);
        }

        function updateOverlayTeamSlots(team, teamData, currentStep, draftStatus) {
            // Ban slots di overlay
            const banSlots = document.querySelectorAll(`.${team}-side-m6 .ban-slot-m6`);
            banSlots.forEach((slot, index) => {
                const hero = teamData.bans[index];
                slot.className = "ban-slot-m6";
                slot.innerHTML = "";
                
                if (hero) {
                    slot.classList.add("filled");
                    const img = document.createElement("img");
                    img.src = "images/HeroBan/" + getHeroImageName(hero.name, "ban");
                    img.alt = hero.name;
                    img.onerror = () => {
                        handleImageError(img);
                    };
                    slot.appendChild(img);

                }
                
                if (draftStatus === "ACTIVE" && currentStep && currentStep.team === team && currentStep.type === "ban" && currentStep.slotIndex === index) {
                    slot.classList.add("active");
                }
            });

            // Pick cards (M6 vertical cards) di overlay
            const pickCards = document.querySelectorAll(`.${team}-side-m6 .pick-card-m6`);
            pickCards.forEach((card, index) => {
                const hero = teamData.picks[index];
                const portraitImg = card.querySelector(".hero-portrait-m6");
                const playerNameEl = card.querySelector(".player-name-m6");
                const heroNameEl = card.querySelector(".hero-name-m6");

                card.className = "pick-card-m6"; // Reset class

                // Set player name dari input konfigurasi controller
                playerNameEl.textContent = teamData.players[index] || `Player ${index + 1}`;

                if (hero) {
                    card.classList.add("filled");
                    heroNameEl.textContent = hero.name;
                    portraitImg.src = "images/HeroPick/" + getHeroImageName(hero.name, "pick");
                    portraitImg.alt = hero.name;
                    portraitImg.onerror = () => {
                        handleImageError(portraitImg);
                    };

                } else {
                    heroNameEl.textContent = "-";
                    portraitImg.src = "";
                }

                // Efek border pulse jika giliran memilih slot pick ini
                if (draftStatus === "ACTIVE" && currentStep && currentStep.team === team && currentStep.type === "pick" && currentStep.slotIndex === index) {
                    card.classList.add("active");
                }
            });
        }

        // Loop polling 100ms agar update real-time di OBS
        setInterval(renderOverlay, 100);

        // Backup listener jika ada event storage
        window.addEventListener("storage", (e) => {
            if (e.key === "mlbb_draft_state") {
                renderOverlay();
            }
        });

        // Panggil render pertama kali
        renderOverlay();
    }
});
