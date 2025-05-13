document.addEventListener('DOMContentLoaded', () => {
    // Set static date and time
    const clockTime = document.getElementById('clock-time');
    const calendarDate = document.getElementById('calendar-date');
    clockTime.textContent = '07:53 AM PDT';
    calendarDate.textContent = 'Tuesday, May 13, 2025';

    // Canvas setup for network animation
    const canvas = document.getElementById('network-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Node and connection settings
    const nodes = [];
    const nodeCount = 20;
    const maxDistance = 150; // Max distance to draw a line between nodes
    const dataPulses = [];

    // Node class (represents services)
    class Node {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.radius = Math.random() * 3 + 2; // Node size between 2-5px
            this.dx = (Math.random() - 0.5) * 2; // Slow movement
            this.dy = (Math.random() - 0.5) * 2;
        }

        update() {
            this.x += this.dx;
            this.y += this.dy;

            // Bounce off edges
            if (this.x < 0 || this.x > canvas.width) this.dx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.dy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#FF9900'; // AWS Orange nodes
            ctx.fill();
            ctx.strokeStyle = 'rgba(255, 153, 0, 0.5)';
            ctx.stroke();
        }
    }

    // Data pulse class (dots traveling along lines)
    class DataPulse {
        constructor(startNode, endNode) {
            this.startNode = startNode;
            this.endNode = endNode;
            this.progress = 0;
            this.speed = 0.02; // Speed of the pulse
        }

        update() {
            this.progress += this.speed;
            return this.progress < 1;
        }

        draw() {
            const x = this.startNode.x + (this.endNode.x - this.startNode.x) * this.progress;
            const y = this.startNode.y + (this.endNode.y - this.startNode.y) * this.progress;
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fillStyle = '#e0e0e0'; // White pulse
            ctx.fill();
        }
    }

    // Create nodes
    for (let i = 0; i < nodeCount; i++) {
        nodes.push(new Node());
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(37, 47, 62, 0.9)'; // Semi-transparent navy background
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Update and draw nodes
        nodes.forEach(node => {
            node.update();
            node.draw();
        });

        // Draw lines (wires) between nearby nodes
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
                    ctx.strokeStyle = `rgba(255, 153, 0, ${opacity})`; // AWS Orange lines
                    ctx.lineWidth = 1;
                    ctx.stroke();

                    // Randomly add data pulses
                    if (Math.random() < 0.01) { // 1% chance per frame
                        dataPulses.push(new DataPulse(nodes[i], nodes[j]));
                    }
                }
            }
        }

        // Update and draw data pulses
        dataPulses.forEach((pulse, index) => {
            if (!pulse.update()) {
                dataPulses.splice(index, 1);
            } else {
                pulse.draw();
            }
        });

        requestAnimationFrame(animate);
    }

    // Start animation
    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
});
