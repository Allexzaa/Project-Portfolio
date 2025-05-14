// JavaScript foor Advanced Circle Image Wrapper Effect (V5 - from Designer Preview)

document.addEventListener("DOMContentLoaded", () => {
    const animationStage = document.querySelector(".animation-stage-v5");
    const playButton = document.getElementById("playAnimationV5");
    if (!animationStage || !playButton) {
        console.error("V5: Required elements (animation-stage-v5 or playAnimationV5) not found!");
        return;
    }

    const numCircles = 5;
    const baseCircleSize = 100; // Base size for circles
    const imageUrls = [
        // Using diverse, high-quality placeholder images
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=200&q=80",
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=200&q=80",
        "https://images.unsplash.com/photo-1530785602389-07594beb8b73?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHBvcnRyYWl0fGVufDB8fDB8fHww&auto=format&fit=crop&w=200&q=80",
        "https://images.unsplash.com/photo-1521119989659-a83eee488004?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBvcnRyYWl0fGVufDB8fDB8fHww&auto=format&fit=crop&w=200&q=80",
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fHBvcnRyYWl0fGVufDB8fDB8fHww&auto=format&fit=crop&w=200&q=80"
    ];

    let circles = [];
    let activeAnimations = [];

    // Function to create a single circle element
    function createCircle(index) {
        const circle = document.createElement("div");
        // Using a class name that might be found in Webflow, or a generic one
        circle.classList.add("hero-visual_media-item-v5"); 
        const size = baseCircleSize + (Math.random() * 40 - 20); // Size variation: 80px to 120px
        circle.style.width = `${size}px`;
        circle.style.height = `${size}px`;
        
        // Initial state: center of the stage, very small, transparent
        circle.style.left = `calc(50% - ${size / 2}px)`;
        circle.style.top = `calc(50% - ${size / 2}px)`;
        circle.style.transform = "scale(0.01) rotate(0deg)";
        circle.style.opacity = "0";
        // Stacking order: higher index on top during reveal, will be reversed for closing
        circle.style.zIndex = numCircles - index; 

        const img = document.createElement("img");
        img.src = imageUrls[index % imageUrls.length];
        img.alt = `Dynamic Circle Image ${index + 1}`;
        circle.appendChild(img);
        animationStage.appendChild(circle);
        return circle;
    }

    // Function to clear old circles and create new ones
    function setupCircles() {
        activeAnimations.forEach(anim => anim.cancel());
        activeAnimations = [];
        animationStage.innerHTML = "";
        circles = [];
        for (let i = 0; i < numCircles; i++) {
            circles.push(createCircle(i));
        }
    }

    // Main animation sequence function
    async function playFullAnimation() {
        setupCircles();
        playButton.disabled = true;

        const stageCenterX = animationStage.offsetWidth / 2;
        const stageCenterY = animationStage.offsetHeight / 2;
        // Radius for the circular formation of the images
        const formationRadius = Math.min(animationStage.offsetWidth, animationStage.offsetHeight) * 0.35;

        // --- 1. Pop-in and Expand to Formation ---
        // Circles appear from the center, scale up, and move to their designated spots in a circular formation.
        // They also rotate during this phase.
        const popInPromises = circles.map(async (circle, i) => {
            const angle = (i / numCircles) * (2 * Math.PI) - (Math.PI / 2); // Start from top, distribute clockwise
            const targetX = stageCenterX + formationRadius * Math.cos(angle) - parseFloat(circle.style.width) / 2;
            const targetY = stageCenterY + formationRadius * Math.sin(angle) - parseFloat(circle.style.height) / 2;
            const initialRotation = (Math.random() - 0.5) * 45; // Small random initial tilt
            const finalFormationRotation = (Math.random() * 120 - 60) + (i * 20); // Varied rotation at formation

            const anim = circle.animate([
                { opacity: 0, transform: `translate(${stageCenterX - parseFloat(circle.style.left) - parseFloat(circle.style.width)/2}px, ${stageCenterY - parseFloat(circle.style.top) - parseFloat(circle.style.height)/2}px) scale(0.01) rotate(${initialRotation}deg)` },
                { opacity: 1, transform: `translate(${targetX - parseFloat(circle.style.left)}px, ${targetY - parseFloat(circle.style.top)}px) scale(1.2) rotate(${finalFormationRotation * 0.7}deg)`, offset: 0.75, easing: "cubic-bezier(0.22, 1.3, 0.55, 1)" }, // Strong pop/overshoot
                { opacity: 1, transform: `translate(${targetX - parseFloat(circle.style.left)}px, ${targetY - parseFloat(circle.style.top)}px) scale(1) rotate(${finalFormationRotation}deg)` }
            ], {
                duration: 1300, // Duration for pop-in
                delay: i * 220,    // Staggered entry for each circle
                fill: "forwards"
            });
            activeAnimations.push(anim);
            return anim.finished;
        });
        await Promise.all(popInPromises).catch(e => console.warn("V5 Pop-in animation issue:", e));

        await new Promise(resolve => setTimeout(resolve, 400)); // Pause after formation

        // --- 2. Coordinated Rotation / "Follow" Illusion ---
        // Circles perform a synchronized rotation. A true "follow" is harder; this is an approximation.
        // The original effect might involve a leading element whose motion others track.
        const rotationPhaseDuration = 2800;
        const followPromises = circles.map(async (circle, i) => {
            const currentTransform = getComputedStyle(circle).transform;
            const currentRotation = parseFloat(currentTransform.match(/rotate\(([^deg]+)deg\)/)?.[1] || 0);
            // Each circle rotates further, and their collective movement gives a sense of flow.
            // The key is the stagger and the slightly different end rotations.
            const anim = circle.animate([
                { transform: currentTransform, offset: 0 },
                { transform: `${currentTransform.replace(/rotate\([^)]+\)/, ``)} rotate(${currentRotation + 270 + (i * 25)}deg) scale(1.05)`, offset: 0.5 },
                { transform: `${currentTransform.replace(/rotate\([^)]+\)/, ``)} rotate(${currentRotation + 360 + (i * 45)}deg) scale(1)`, offset: 1 }
            ], {
                duration: rotationPhaseDuration,
                easing: "cubic-bezier(0.65, 0.05, 0.36, 1)", // Smooth and responsive easing
                delay: i * 150, // Stagger for the "follow" feel
                fill: "forwards"
            });
            activeAnimations.push(anim);
            return anim.finished;
        });
        await Promise.all(followPromises).catch(e => console.warn("V5 Follow animation issue:", e));
        await new Promise(resolve => setTimeout(resolve, 600)); // Pause before closing

        // --- 3. Close Up - Slide and Stack ---
        // Circles move back to the center, scale down, and fade, stacking with the top one last.
        const closeUpPromises = circles.slice().reverse().map(async (circle, i) => { // Reverse for stacking (last in, first out visually)
            const currentTransform = getComputedStyle(circle).transform;
            const currentRotation = parseFloat(currentTransform.match(/rotate\(([^deg]+)deg\)/)?.[1] || 0);
            const closingRotation = currentRotation + 75 + (i * -15); // Rotate while closing, fanning out slightly
            
            // Ensure zIndex brings the currently animating circle to the top of the closing stack
            circle.style.zIndex = numCircles + i + 10; 

            const anim = circle.animate([
                { opacity: 1, transform: currentTransform },
                { opacity: 0.6, transform: `translate(${stageCenterX - parseFloat(circle.style.left) - parseFloat(circle.style.width)/2}px, ${stageCenterY - parseFloat(circle.style.top) - parseFloat(circle.style.height)/2}px) scale(0.35) rotate(${closingRotation * 0.6}deg)`, offset: 0.65, easing: "cubic-bezier(0.55, 0.055, 0.675, 0.19)" }, // Sharp ease-in
                { opacity: 0, transform: `translate(${stageCenterX - parseFloat(circle.style.left) - parseFloat(circle.style.width)/2}px, ${stageCenterY - parseFloat(circle.style.top) - parseFloat(circle.style.height)/2}px) scale(0.01) rotate(${closingRotation}deg)` }
            ], {
                duration: 900, // Faster closing animation
                delay: i * 180,   // Staggered closing for the slide/stack effect
                fill: "forwards"
            });
            activeAnimations.push(anim);
            return anim.finished;
        });
        await Promise.all(closeUpPromises).catch(e => console.warn("V5 Closing animation issue:", e));

        playButton.disabled = false;
    }

    playButton.addEventListener("click", playFullAnimation);
    // Optional: play on load for quick preview
    // setTimeout(playFullAnimation, 700);
});

