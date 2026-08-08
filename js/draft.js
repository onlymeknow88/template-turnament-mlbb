// Konfigurasi urutan langkah Draft Pick MLBB Kompetitif (5v5)
// Total 20 aksi (10 ban + 10 pick)
const DRAFT_STEPS = [
    // --- BAN FASE 1 (6 Ban) ---
    { step: 1, phase: "BAN PHASE 1", type: "ban", team: "blue", slotIndex: 0 },
    { step: 2, phase: "BAN PHASE 1", type: "ban", team: "red",  slotIndex: 0 },
    { step: 3, phase: "BAN PHASE 1", type: "ban", team: "blue", slotIndex: 1 },
    { step: 4, phase: "BAN PHASE 1", type: "ban", team: "red",  slotIndex: 1 },
    { step: 5, phase: "BAN PHASE 1", type: "ban", team: "blue", slotIndex: 2 },
    { step: 6, phase: "BAN PHASE 1", type: "ban", team: "red",  slotIndex: 2 },

    // --- PICK FASE 1 (6 Pick) ---
    { step: 7,  phase: "PICK PHASE 1", type: "pick", team: "blue", slotIndex: 0 },
    { step: 8,  phase: "PICK PHASE 1", type: "pick", team: "red",  slotIndex: 0 },
    { step: 9,  phase: "PICK PHASE 1", type: "pick", team: "red",  slotIndex: 1 },
    { step: 10, phase: "PICK PHASE 1", type: "pick", team: "blue", slotIndex: 1 },
    { step: 11, phase: "PICK PHASE 1", type: "pick", team: "blue", slotIndex: 2 },
    { step: 12, phase: "PICK PHASE 1", type: "pick", team: "red",  slotIndex: 2 },

    // --- BAN FASE 2 (4 Ban) ---
    { step: 13, phase: "BAN PHASE 2", type: "ban", team: "red",  slotIndex: 3 },
    { step: 14, phase: "BAN PHASE 2", type: "ban", team: "blue", slotIndex: 3 },
    { step: 15, phase: "BAN PHASE 2", type: "ban", team: "red",  slotIndex: 4 },
    { step: 16, phase: "BAN PHASE 2", type: "ban", team: "blue", slotIndex: 4 },

    // --- PICK FASE 2 (4 Pick) ---
    { step: 17, phase: "PICK PHASE 2", type: "pick", team: "red",  slotIndex: 3 },
    { step: 18, phase: "PICK PHASE 2", type: "pick", team: "blue", slotIndex: 3 },
    { step: 19, phase: "PICK PHASE 2", type: "pick", team: "blue", slotIndex: 4 },
    { step: 20, phase: "PICK PHASE 2", type: "pick", team: "red",  slotIndex: 4 }
];

class DraftManager {
    constructor() {
        this.reset(false); // don't clear localStorage on init if it exists
        this.loadFromStorage();
    }

    reset(clearStorage = true) {
        this.stopTimer(); // Hentikan interval timer yang sedang berjalan agar tidak bocor
        this.currentStepIndex = 0; // 0 sampai 19
        this.status = "IDLE"; // IDLE, ACTIVE, DONE
        this.history = []; // Stack untuk undo
        this.timerValue = 30;
        this.isTimerPaused = false;

        // Data hasil draft & Tournament Metadata (Coach + Player names)
        this.blueTeam = {
            name: "BLUE TEAM",
            coach: "Giee",
            players: ["Dont", "Loveeely", "Reaper", "Yustinian", "Maniak"],
            bans: [null, null, null, null, null], 
            picks: [null, null, null, null, null]
        };
        this.redTeam = {
            name: "RED TEAM",
            coach: "Booyo",
            players: ["Bankai", "Zetsu", "Mayki", "Shenlynn", "Rynxk"],
            bans: [null, null, null, null, null],
            picks: [null, null, null, null, null]
        };

        this.usedHeroIds = new Set();

        if (clearStorage) {
            this.saveToStorage();
            this.notifyStateChange();
        }
    }

    startDraft() {
        this.status = "ACTIVE";
        this.currentStepIndex = 0;
        this.startTimer();
        this.saveToStorage();
        this.notifyStateChange();
    }

    getCurrentStep() {
        if (this.status !== "ACTIVE" || this.currentStepIndex >= DRAFT_STEPS.length) {
            return null;
        }
        return DRAFT_STEPS[this.currentStepIndex];
    }

    selectHero(hero) {
        if (this.status !== "ACTIVE") return false;
        if (this.usedHeroIds.has(hero.id)) return false;

        const currentStep = this.getCurrentStep();
        if (!currentStep) return false;

        // Simpan snapshot state untuk Undo
        const snapshot = {
            stepIndex: this.currentStepIndex,
            blueTeam: JSON.parse(JSON.stringify(this.blueTeam)),
            redTeam: JSON.parse(JSON.stringify(this.redTeam)),
            usedHeroIds: Array.from(this.usedHeroIds)
        };
        this.history.push(snapshot);

        // Update data tim
        const targetTeam = currentStep.team === "blue" ? this.blueTeam : this.redTeam;
        if (currentStep.type === "ban") {
            targetTeam.bans[currentStep.slotIndex] = hero;
        } else {
            targetTeam.picks[currentStep.slotIndex] = hero;
        }

        this.usedHeroIds.add(hero.id);
        this.nextStep();
        return true;
    }

    nextStep() {
        this.currentStepIndex++;
        if (this.currentStepIndex >= DRAFT_STEPS.length) {
            this.status = "DONE";
            this.stopTimer();
        } else {
            this.resetTimer();
        }
        this.saveToStorage();
        this.notifyStateChange();
    }

    skipTurn() {
        if (this.status !== "ACTIVE") return;
        const currentStep = this.getCurrentStep();
        if (!currentStep) return;

        const snapshot = {
            stepIndex: this.currentStepIndex,
            blueTeam: JSON.parse(JSON.stringify(this.blueTeam)),
            redTeam: JSON.parse(JSON.stringify(this.redTeam)),
            usedHeroIds: Array.from(this.usedHeroIds)
        };
        this.history.push(snapshot);

        this.nextStep();
    }

    undo() {
        if (this.history.length === 0) return false;

        const lastState = this.history.pop();
        this.currentStepIndex = lastState.stepIndex;
        this.blueTeam = lastState.blueTeam;
        this.redTeam = lastState.redTeam;
        this.usedHeroIds = new Set(lastState.usedHeroIds);
        this.status = "ACTIVE";

        this.resetTimer();
        this.saveToStorage();
        this.notifyStateChange();
        return true;
    }

    // --- TIMER LOGIC ---
    startTimer() {
        this.stopTimer();
        this.timerValue = 30;
        this.isTimerPaused = false;
        
        if (this.onTimerTick) this.onTimerTick(this.timerValue);

        this.timerInterval = setInterval(() => {
            if (!this.isTimerPaused) {
                this.timerValue--;
                if (this.onTimerTick) this.onTimerTick(this.timerValue);
                this.saveToStorage(); // simpan sisa waktu timer ke storage

                if (this.timerValue <= 0) {
                    this.skipTurn();
                }
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    resetTimer() {
        this.timerValue = 30;
        if (this.onTimerTick) this.onTimerTick(this.timerValue);
        this.saveToStorage();
    }

    togglePauseTimer() {
        this.isTimerPaused = !this.isTimerPaused;
        this.saveToStorage();
        this.notifyStateChange();
    }

    // --- STORAGE SYNC ---
    saveToStorage() {
        const state = {
            status: this.status,
            currentStepIndex: this.currentStepIndex,
            timerValue: this.timerValue,
            isTimerPaused: this.isTimerPaused,
            blueTeam: this.blueTeam,
            redTeam: this.redTeam,
            usedHeroIds: Array.from(this.usedHeroIds),
            history: this.history
        };
        localStorage.setItem("mlbb_draft_state", JSON.stringify(state));
    }

    loadFromStorage() {
        try {
            const raw = localStorage.getItem("mlbb_draft_state");
            if (!raw) return;
            const state = JSON.parse(raw);
            
            this.status = state.status || "IDLE";
            this.currentStepIndex = state.currentStepIndex || 0;
            this.timerValue = state.timerValue !== undefined ? state.timerValue : 30;
            this.isTimerPaused = !!state.isTimerPaused;
            this.blueTeam = state.blueTeam || this.blueTeam;
            this.redTeam = state.redTeam || this.redTeam;
            this.usedHeroIds = new Set(state.usedHeroIds || []);
            this.history = state.history || [];

            // Jika status active dan timer interval tidak menyala di admin controller, nyalakan
            // (Tetapi halaman OBS overlay tidak boleh menyalakan setInterval sendiri, ia hanya membaca state)
        } catch (e) {
            console.error("Gagal memuat state dari storage:", e);
        }
    }

    notifyStateChange() {
        if (this.onStateChange) {
            this.onStateChange({
                status: this.status,
                currentStep: this.getCurrentStep(),
                blueTeam: this.blueTeam,
                redTeam: this.redTeam,
                usedHeroIds: this.usedHeroIds,
                isTimerPaused: this.isTimerPaused,
                canUndo: this.history.length > 0
            });
        }
    }
}
