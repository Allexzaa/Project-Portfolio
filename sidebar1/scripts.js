document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.querySelector('.navbar-toggle');
    const navMenu = document.querySelector('.nav-menu');

    // Toggle navbar menu on mobile
    toggleButton.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
});
