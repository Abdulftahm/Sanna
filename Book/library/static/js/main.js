/**
 * Main JavaScript file for the Arabic Stories Platform
 * Contains common functionality used across all pages
 */

document.addEventListener('DOMContentLoaded', function() {
    initThemeSwitch();
    initHamburgerMenu();
    initSearchBar();
});

/**
 * Theme Switch (Dark/Light Mode)
 */
function initThemeSwitch() {
    const themeSwitch = document.getElementById('themeSwitch');
    if (!themeSwitch) return;

    // Check for saved theme preference
    if (localStorage.getItem('darkMode') === 'light') {
        document.body.classList.add('light-mode');
        themeSwitch.checked = true;
    }

    // Toggle theme on change
    themeSwitch.addEventListener('change', function() {
        document.body.classList.toggle('light-mode');

        if (document.body.classList.contains('light-mode')) {
            localStorage.setItem('darkMode', 'light');
        } else {
            localStorage.setItem('darkMode', 'dark');
        }
    });
}

/**
 * Hamburger Menu for Mobile Navigation
 */
function initHamburgerMenu() {
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const navLinksContainer = document.getElementById('navLinksContainer');

    if (!hamburgerMenu || !navLinksContainer) return;

    hamburgerMenu.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinksContainer.classList.toggle('active');

        // Animate hamburger bars to X
        const bars = this.querySelectorAll('.bar');
        if (this.classList.contains('active')) {
            bars[0].style.transform = 'translateY(9px) rotate(45deg)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'translateY(-9px) rotate(-45deg)';
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            hamburgerMenu.classList.remove('active');
            navLinksContainer.classList.remove('active');

            const bars = hamburgerMenu.querySelectorAll('.bar');
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburgerMenu.contains(e.target) && !navLinksContainer.contains(e.target)) {
            hamburgerMenu.classList.remove('active');
            navLinksContainer.classList.remove('active');

            const bars = hamburgerMenu.querySelectorAll('.bar');
            if (bars.length) {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        }
    });
}

/**
 * Search Bar Toggle
 */
function initSearchBar() {
    const searchIcon = document.getElementById('searchIcon');
    const searchBar = document.getElementById('searchBar');

    if (!searchIcon || !searchBar) return;

    searchIcon.addEventListener('click', function() {
        searchBar.classList.toggle('active');
        if (searchBar.classList.contains('active')) {
            searchBar.focus();
        }
    });

    // Close search when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchIcon.contains(e.target) && !searchBar.contains(e.target)) {
            searchBar.classList.remove('active');
        }
    });
}

/**
 * Utility: Duplicate cards for infinite scroll effect
 */
function duplicateCardsUntilFull() {
    const container = document.querySelector('.stories-scroll-container');
    if (!container) return;

    const originalCards = Array.from(container.children);
    if (originalCards.length === 0) return;

    let totalWidth = 0;
    originalCards.forEach(card => {
        totalWidth += card.offsetWidth + 20; // 20 is gap
    });

    // Number of copies needed to cover screen twice
    const neededCopies = Math.ceil((window.innerWidth * 2) / totalWidth);

    for (let i = 0; i < neededCopies; i++) {
        originalCards.forEach(card => {
            const clone = card.cloneNode(true);
            container.appendChild(clone);
        });
    }
}
