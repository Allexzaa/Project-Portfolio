try {
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('networkCanvas');
    const ctx = canvas.getContext('2d');
    
    // First declare all variables at the top
    let nodes = [];
    let lights = [];
    let animationId;
    
    // Configuration - moved to top
    const config = {
        nodeCount: 7,
        lightCount: 10,
        colors: {
            white: 'rgba(255, 255, 255, 0.9)',
            blue: 'rgba(100, 120, 255, 0.8)',
            purple: 'rgba(180, 100, 255, 0.8)',
            darkBlue: 'rgba(20, 30, 80, 0.9)'
        },
        minSpeed: 0.003,
        maxSpeed: 0.008,
        minNodeSize: 8,
        maxNodeSize: 14
    };

    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initNodes(); // Now safe to call after nodes is declared
    }
    
    window.addEventListener('resize', resizeCanvas);
    
    // Rest of your code remains the same...
    class Node { /* ... */ }
    class Light { /* ... */ }
    
    function initNodes() {
        nodes = []; // Now properly modifies the already-declared variable
        lights = [];
        
        const minDistance = Math.min(canvas.width, canvas.height) * 0.2;
        
        while (nodes.length < config.nodeCount) {
            const x = Math.random() * (canvas.width - 100) + 50;
            const y = Math.random() * (canvas.height - 100) + 50;
            
            let validPosition = true;
            for (const node of nodes) {
                const distance = Math.sqrt(Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2));
                if (distance < minDistance) {
                    validPosition = false;
                    break;
                }
            }
            
            if (validPosition) {
                nodes.push(new Node(x, y));
            }
        }
        
        for (let i = 0; i < config.lightCount; i++) {
            lights.push(new Light());
        }
    }
    
    function animate() {
        ctx.fillStyle = 'rgba(10, 10, 18, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        nodes.forEach(node => {
            node.update();
            node.draw();
        });
        
        lights.forEach(light => {
            light.update();
            light.draw();
        });
        
        animationId = requestAnimationFrame(animate);
    }

    // Initialize and start animation
    resizeCanvas();
    animate();
});
} catch (error) {
    console.error("Error:", error);
    alert("Error occurred: " + error.message);
}
