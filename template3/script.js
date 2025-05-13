document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('network-canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas size to match viewport
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Node and connection settings
    const nodes = [];
    const nodeCount = 20; // Number of connection points
    const maxDistance = 180; // Maximum distance for wire connections
    const dataPulses = [];
    const glowColor = '#00aaff'; // Neon blue for glowing wires
    const pulseColors = ['#ff9900', '#e0e0e0']; // Orange and white for data pulses

    // Node class (connection points)
    class Node {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.radius = Math.random() * 4 + 3; // Node size between 3-7px
            this.dx = (Math.random() - 0.5) * 1.2; // Horizontal movement speed
            this.dy = (Math.random() - 0.5) * 1.2; // Vertical movement speed
        }

        update() {
            // Update position with movement
            this.x += this.dx;
            this.y += this.dy;

            // Bounce off canvas edges
            if (this.x < 0 || this.x > canvas.width) this.dx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.dy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#252F3E'; // Navy blue nodes
            ctx.fill();
            // Glowing effect
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#ff9900'; // Orange glow
            ctx.fill();
            ctx.shadowBlur = 0; // Reset shadow
        }
    }

    // Data pulse class (simulates data sending/receiving)
    class DataPulse {
        constructor(startNode, endNode, direction) {
            this.startNode = startNode;
            this.endNode = endNode;
            this.progress = direction === 'forward' ? 0 : 1; // Start or end depending on direction
            this.speed = 0.02; // Speed of pulse movement
            this.direction = direction; // 'forward' or 'reverse' for bidirectional
            this.color = pulseColors[Math.floor(Math.random() * pulseColors.length)];
        }

        update() {
            this.progress += this.direction === 'forward' ? this.speed : -this.speed;
            return this.direction === 'forward' ? this.progress < 1 : this.progress > 0;
        }

        draw() {
            const x = this.startNode.x + (this.endNode.x - this.startNode.x) * this.progress;
            const y = this.startNode.y + (this.endNode.y - this.startNode.y) * this.progress;
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fillStyle = this.color; // Random pulse color
            ctx.shadowBlur = 8;
            ctx.shadowColor = this.color === '#ff9900' ? '#ff9900' : '#00aaff'; // Matching glow
            ctx.fill();
            ctx.shadowBlur = 0; // Reset shadow
        }
    }

    // Initialize nodes
    for (let i = 0; i < nodeCount; i++) {
        nodes.push(new Node());
    }

    // Animation loop
    function animate() {
        // Clear canvas with a semi-transparent background for glow trails
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(0, 0, 50, 0.1)'; // Dark blue with transparency
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Update and draw nodes
        nodes.forEach(node => {
            node.update();
            node.draw();
        });

        // Draw glowing wires between nearby nodes
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    const opacity = 1 - distance / maxDistance; // Fade with distance
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.strokeStyle = `rgba(0, 170, 255, ${opacity})`; // Neon blue wires
                    ctx.lineWidth = 1.5;
                    ctx.shadowBlur = 12;
                    ctx.shadowColor = '#00aaff'; // Glowing effect
                    ctx.stroke();
                    ctx.shadowBlur = 0; // Reset shadow

                    // Randomly spawn bidirectional data pulses
                    if (Math.random() < 0.003) { // Reduced frequency
                        dataPulses.push(new DataPulse(nodes[i], nodes[j], 'forward'));
                        dataPulses.push(new DataPulse(nodes[j], nodes[i], 'reverse')); // Bidirectional
                    }
                }
            }
        }

        // Update and draw data pulses
        dataPulses.forEach((pulse, index) => {
            if (!pulse.update()) {
                dataPulses.splice(index, 1); // Remove completed pulses
            } else {
                pulse.draw();
            }
        });

        requestAnimationFrame(animate); // Continuous animation
    }

    // Start animation
    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        nodes.forEach(node => {
            node.x = Math.random() * canvas.width; // Reposition nodes
            node.y = Math.random() * canvas.height;
        });
    });
});
