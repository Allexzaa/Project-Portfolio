document.addEventListener('DOMContentLoaded', () => {
    const raysContainer = document.querySelector('.rays-container');
    const numRays = 20; // Number of rays to create

    // Function to create a single ray
    function createRay() {
        const ray = document.createElement('div');
        ray.classList.add('ray');

        // Randomize starting position (across the width of the screen)
        const startX = Math.random() * 100; // Percentage across the screen
        ray.style.left = `${startX}%`;

        // Randomize animation duration (between 3s and 8s for varied speed)
        const duration = Math.random() * 5 + 3; // 3s to 8s
        ray.style.animationDuration = `${duration}s`;

        // Randomize animation delay (for staggered starts)
        const delay = Math.random() * 5; // 0s to 5s
        ray.style.animationDelay = `${delay}s`;

        // Randomize slight rotation for variety
        const rotation = (Math.random() - 0.5) * 30; // Between -15deg and 15deg
        ray.style.transform = `rotate(${rotation}deg)`;

        // Append to container
        raysContainer.appendChild(ray);

        // Remove the ray after animation completes to prevent DOM clutter
        ray.addEventListener('animationend', () => {
            ray.remove();
            // Create a new ray to keep the effect continuous
            createRay();
        });
    }

    // Create initial rays
    for (let i = 0; i < numRays; i++) {
        createRay();
    }
});
