/**
 * Auth Pages JavaScript
 * Handles login/register form switching
 */

document.addEventListener('DOMContentLoaded', function() {
    initAuthTabs();
    initThemeSwitch();
});

/**
 * Tab switching between login and register forms
 */
function initAuthTabs() {
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form-container');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetForm = this.getAttribute('data-form');

            // Update tabs
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // Update forms
            forms.forEach(form => {
                form.classList.remove('active');
                if (form.id === targetForm) {
                    form.classList.add('active');
                }
            });
        });
    });
}

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

    themeSwitch.addEventListener('change', function() {
        document.body.classList.toggle('light-mode');

        if (document.body.classList.contains('light-mode')) {
            localStorage.setItem('darkMode', 'light');
        } else {
            localStorage.setItem('darkMode', 'dark');
        }
    });
}
