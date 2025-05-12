document.addEventListener('DOMContentLoaded', () => {
    const orbitItems = document.querySelectorAll('.orbit-item');
    
    // Pause animation on hover
    orbitItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.animationPlayState = 'paused';
        });
        item.addEventListener('mouseleave', () => {
            item.style.animationPlayState = 'running';
        });
    });
});
