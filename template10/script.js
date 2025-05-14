// Ensure DOM is fully loaded before running scriptss
document.addEventListener('DOMContentLoaded', () => {
    // Select all process blocks for animation
    const processBlocks = document.querySelectorAll('.process-block');
    const readMoreLinks = document.querySelectorAll('.process-readmore');

    // GSAP animations (assuming GSAP is included via CDN or local file)
    // Animate process blocks on page load: fade-in and slide-up effect
    processBlocks.forEach((block, index) => {
        gsap.from(block, {
            opacity: 0,
            y: 50, // Slide up from 50px below
            duration: 0.8,
            delay: index * 0.2, // Stagger animation for each block
            ease: 'power2.out',
            onStart: () => {
                block.style.opacity = '0.8'; // Match initial CSS opacity
            }
        });

        // Animate block-stroke on hover
        const blockStroke = block.querySelector('.block-stroke');
        if (blockStroke) {
            block.addEventListener('mouseenter', () => {
                gsap.to(blockStroke, {
                    scale: 1, // Scale to full size
                    opacity: 0.5,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            });
            block.addEventListener('mouseleave', () => {
                gsap.to(blockStroke, {
                    scale: 0.8, // Return to original scale
                    opacity: 0,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            });
        }
    });

    // Add hover effect to read-more links
    readMoreLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            gsap.to(link, {
                scale: 1.1, // Slight scale-up on hover
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        link.addEventListener('mouseleave', () => {
            gsap.to(link, {
                scale: 1, // Return to original size
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        // Handle click on read-more links (placeholder for navigation or modal)
        link.addEventListener('click', (e) => {
            e.preventDefault();
            console.log(`Read More clicked for ${link.closest('.process-block').querySelector('.process-title').textContent}`);
            // Example: Redirect to a URL or open a modal
            // window.location.href = link.href;
        });
    });

    // Optional: Animate process count numbers (if they should increment)
    const processCounts = document.querySelectorAll('.process-count');
    processCounts.forEach((count, index) => {
        gsap.fromTo(count, 
            { innerText: 0 }, 
            { 
                innerText: index + 1, 
                duration: 1, 
                snap: { innerText: 1 }, // Increment as whole numbers
                delay: index * 0.2,
                ease: 'power1.inOut',
                onUpdate: function() {
                    count.innerText = Math.round(count.innerText);
                }
            }
        );
    });
});
