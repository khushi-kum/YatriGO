// --- 1. THEME TOGGLE FUNCTIONALITY (Dark/Light Mode) ---

const htmlElement = document.documentElement; // The <html> tag

// B. Constants for storage
const THEME_KEY = 'yatri-theme';
const DARK_THEME_CLASS = 'dark-mode';
const AUTH_KEY = 'yatri-auth'; 

// C. Function to apply the theme
function applyTheme(theme) {
    // Hum <html> class aur naye menu ke radio buttons ko update karte hain.
    const isDark = theme === 'dark';
    
    if (isDark) {
        htmlElement.classList.add(DARK_THEME_CLASS);
    } else {
        htmlElement.classList.remove(DARK_THEME_CLASS);
    }

    // Naye menu mein radio buttons ko update karna
    const themeLightRadio = document.getElementById('theme-light');
    const themeDarkRadio = document.getElementById('theme-dark');
    if (themeLightRadio && themeDarkRadio) {
        themeLightRadio.checked = !isDark;
        themeDarkRadio.checked = isDark;
    }
}

// D. Load theme on page load (Preference Cascade: localStorage > OS setting > default)
function loadInitialTheme() {
    let storedTheme = localStorage.getItem(THEME_KEY);

    // Agar koi preference nahi hai, toh operating system ki setting dekhte hain
    if (!storedTheme) {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            storedTheme = 'dark';
        } else {
            // Default: light mode
            storedTheme = 'light';
        }
    }

    applyTheme(storedTheme);
}


// --- 2. SMOOTH SCROLLING FOR NAVIGATION ---

/** Hero section tak smooth scroll karne ke liye function (naye Home icon aur Logout mein upyog hota hai) */
function smoothScrollToHero() {
    const heroEl = document.querySelector('.hero');
    if (heroEl) {
        // Hero section, jo ki top/home view hai, wahaan scroll karte hain
        heroEl.scrollIntoView({
            behavior: 'smooth'
        });
    }
}

// Existing smooth scrolling logic
document.querySelectorAll('.nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});


// --- 3. HERO BUTTON ACTION (Basic Log) ---

const heroButton = document.querySelector('.hero-button');

heroButton.addEventListener('click', () => {
    // Alert ki jagah custom modal ya console.log ka istemaal kiya jaata hai
    console.log("Adventure Awaits! Aapne 'Start Your Journey' par click kiya.");
});


/* ======================================================= */
/* === START: NEW HEADER CONTROLS AND INTERACTIVITY === */
/* ======================================================= */

// --- ELEMENT SELECTORS (Naya Header) ---
const menuToggle = document.querySelector('.menu-toggle');
const slideMenu = document.getElementById('slide-menu');
const menuOverlay = document.querySelector('.menu-overlay');
const closeMenuBtn = document.querySelector('.close-menu-btn');

const profileToggle = document.querySelector('.profile-toggle');
const profilePanel = document.getElementById('profile-panel');
const profileContent = document.querySelector('.profile-auth-content');

const notifToggle = document.querySelector('.notification-toggle');
const notifPanel = document.getElementById('notification-panel');

const homeScrollBtn = document.querySelector('.home-scroll');

const themeLabel = document.querySelector('.theme-toggle-label');
const themeRadios = document.querySelectorAll('input[name="app-theme"]');


// --- AUTH DATA (Simulated) ---
const FAKE_USER = {
    name: 'Yatri Explorer',
    email: 'explorer@yatri.go'
};

// --- CORE MENU FUNCTIONS ---

function closeAllDropdowns() {
    [profileToggle, notifToggle].forEach(btn => {
        const panel = document.getElementById(btn.getAttribute('aria-controls'));
        if (panel && panel.getAttribute('aria-hidden') === 'false') {
            toggleDropdown(btn, panel);
        }
    });
}

function toggleDropdown(toggleBtn, panel) {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    
    if (!isExpanded) {
        closeAllDropdowns();
    }

    toggleBtn.setAttribute('aria-expanded', !isExpanded);
    panel.setAttribute('aria-hidden', isExpanded);
    
    if (!isExpanded) {
        panel.focus();
    }
}

function toggleSlideMenu(forceClose = false) {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    const newState = forceClose ? false : !isExpanded;

    menuToggle.setAttribute('aria-expanded', newState);
    slideMenu.setAttribute('aria-hidden', !newState);
    menuOverlay.setAttribute('aria-hidden', !newState);
    
    if (newState) {
        slideMenu.focus();
        closeAllDropdowns();
    } else {
        menuToggle.focus();
    }
}


// --- AUTH & PROFILE FUNCTIONS ---

function renderProfilePanel() {
    const isAuthenticated = localStorage.getItem(AUTH_KEY) === 'true';
    profileContent.innerHTML = '';

    if (isAuthenticated) {
        profileContent.innerHTML = `
            <div class="profile-info">
                <span class="profile-photo" aria-hidden="true"></span>
                <div class="profile-text">
                    <strong>${FAKE_USER.name}</strong>
                    <span>${FAKE_USER.email}</span>
                </div>
            </div>
            <button class="logout-btn">Logout</button>
        `;
        profileContent.querySelector('.logout-btn').addEventListener('click', handleLogout);

    } else {
        profileContent.innerHTML = `<button class="signin-btn">Sign in to YatriGo</button>`;
        profileContent.querySelector('.signin-btn').addEventListener('click', handleSignin);
    }
}

function handleSignin() {
    localStorage.setItem(AUTH_KEY, 'true');
    renderProfilePanel();
}

function handleLogout() {
    localStorage.setItem(AUTH_KEY, 'false');
    renderProfilePanel();
    toggleDropdown(profileToggle, profilePanel);
    smoothScrollToHero();
}


// --- THEME SWITCHING (Naya UI Logic) ---

function handleThemeChange(event) {
    const newTheme = event.target.value;
    applyTheme(newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
}


/* ======================================================= */
/* === START: NEW MODAL FUNCTIONS AND DATA === */
/* ======================================================= */

const legalModal = document.getElementById('legal-modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.querySelector('.modal-body');
const modalCloseBtn = document.querySelector('.modal-close-btn');

// Policy Content
const POLICY_CONTENT = {
    'terms-modal': {
        title: 'Terms & Conditions',
        text: `
            <p>Welcome to YatriGo, a platform connecting travelers with local storytellers and experiences.</p>
            <p><strong>By using this website, you agree to:</strong></p>
            <p><strong>Fair Use:</strong> Share only genuine, respectful content.</p>
            <p><strong>Account Responsibility:</strong> You’re responsible for your own account use.</p>
            <p><strong>Content Rights:</strong> You own your posts but allow YatriGo to display them.</p>
            <p><strong>Liability:</strong> YatriGo connects users but isn’t responsible for offline interactions.</p>
            <p><strong>Updates:</strong> Terms may change; continued use means acceptance.</p>
        `
    },
    'privacy-modal': {
        title: 'Privacy Policy',
        text: `
            <p>Your privacy matters to us. YatriGo collects limited data (like name, email, and photos) to enhance your travel experience.</p>
            <p><strong>Data Use:</strong> Used only to improve services and personalize content.</p>
            <p><strong>Security:</strong> We protect your data and never sell it.</p>
            <p><strong>Cookies:</strong> Used for better experience; can be disabled.</p>
            <p><strong>User Control:</strong> You can edit or delete your data anytime.</p>
            <p><strong>Policy Updates:</strong> Any future changes will be shown here.</p>
            <p style="margin-top: 20px; font-weight: 600;">Last Updated: November 2025</p>
        `
    }
};

function openModal(type) {
    const content = POLICY_CONTENT[type];
    if (content) {
        modalTitle.textContent = content.title;
        modalBody.innerHTML = content.text;
        legalModal.setAttribute('aria-hidden', 'false');
        legalModal.focus();
        document.body.style.overflow = 'hidden'; // Background scrolling ko rokna
    }
}

function closeModal() {
    legalModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Background scrolling ko wapas shuru karna
}

// Event Listeners for Modal Links
document.querySelectorAll('.footer-link-modal').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const modalType = e.target.getAttribute('data-modal');
        openModal(modalType);
    });
});

modalCloseBtn.addEventListener('click', closeModal);

// Modal ke baahar click karne par band karna
legalModal.addEventListener('click', (e) => {
    if (e.target === legalModal) {
        closeModal();
    }
});

// ESC key se modal band karna
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && legalModal.getAttribute('aria-hidden') === 'false') {
        closeModal();
    }
});

/* ======================================================= */
/* === END: NEW MODAL FUNCTIONS AND DATA === */
/* ======================================================= */


// --- 9. WINDOW LOAD / INITIALIZATION ---

window.onload = function() {
    // 1. Load Theme
    loadInitialTheme();

    // 2. Render Auth/Profile
    renderProfilePanel(); 

    // 3. Event Listeners for Menu and Dropdowns
    menuToggle.addEventListener('click', () => toggleSlideMenu());
    closeMenuBtn.addEventListener('click', () => toggleSlideMenu(true));
    menuOverlay.addEventListener('click', () => toggleSlideMenu(true));

    profileToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown(profileToggle, profilePanel);
    });

    notifToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown(notifToggle, notifPanel);
    });

    // Dropdowns ko kahin aur click karne par band karna
    document.body.addEventListener('click', (e) => {
        // Check karna ki click kisi open dropdown ke baahar hua hai
        if (!e.target.closest('.action-group')) {
            closeAllDropdowns();
        }
    });

    // Panel ke andar click ko stop karna taaki woh band na ho
    [profilePanel, notifPanel].forEach(panel => {
        panel.addEventListener('click', (e) => e.stopPropagation());
    });

    // 4. Header Actions
    homeScrollBtn.addEventListener('click', smoothScrollToHero);
    
    // 5. Theme Menu Toggle (slide-menu ke andar)
    if (themeLabel) {
        themeLabel.addEventListener('click', () => {
            const isExpanded = themeLabel.getAttribute('aria-expanded') === 'true';
            const themeRadiosGroup = document.getElementById('theme-radios');
            themeLabel.setAttribute('aria-expanded', !isExpanded);
            themeRadiosGroup.setAttribute('aria-expanded', !isExpanded);
        });
    }

    // 6. Theme Radio Button Listeners
    themeRadios.forEach(radio => {
        radio.addEventListener('change', handleThemeChange);
    });

    // 7. Initial check of theme radios (agar local storage se load hua ho)
    const currentTheme = localStorage.getItem(THEME_KEY) || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(currentTheme);
};