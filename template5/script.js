document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('vertical-wires-canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas size to match viewport
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Wire and node settings
    const wireCount = 8; // Number of vertical wires
    const wireSpacing = canvas.width / (wireCount + 1); // Evenly spaced wires
    const nodesPerWire = 5; // Number of nodes per wire
    const nodeSpacing = canvas.height / (nodesPerWire + 1); // Evenly spaced nodes
    const wires = [];
    const dataPulses = [];
    const glowColor = '#00aaff'; // Neon blue for glowing wires
    const pulseColors = ['#ff9900', '#e0e0e0']; // Orange and white for data pulses
    const awsIcons = ['ec2', 's3', 'lambda', 'rds']; // Base names of icon files (e.g., ec2.png)

    // Preload AWS icons from images folder
    const iconImages = {};
    let iconsLoaded = 0;
    const totalIcons = awsIcons.length;

    function loadIcon(iconName, callback) {
        iconImages[iconName] = new Image();
        iconImages[iconName].onload = () => {
            iconsLoaded++;
            if (iconsLoaded === totalIcons) callback();
        };
        iconImages[iconName].onerror = () => console.error(`Failed to load image: images/${iconName}.png`);
        // Add the path to your images folder here
        iconImages[iconName].src = `images/001.png`; // <- This is where you set the path
        iconImages[iconName].src = `images/002.png`;
        iconImages[iconName].src = `images/003.png`;
    }
    

    // Load all icons and start animation when ready
    awsIcons.forEach(iconName => loadIcon(iconName, startAnimation));

    function startAnimation() {
        console.log('All icons loaded, starting animation');

        // Node class (connection points or AWS icons)
        class Node {
            constructor(x, y, isIcon = false) {
                this.x = x;
                this.y = y;
                this.radius = isIcon ? 12 : 4; // Larger radius for icons
                this.isIcon = isIcon;
                this.iconName = isIcon ? awsIcons[Math.floor(Math.random() * awsIcons.length)] : null;
            }

            draw() {
                if (this.isIcon && iconImages[this.iconName]) {
                    // Draw AWS icon
                    ctx.save();
                    const size = this.radius * 2;
                    ctx.shadowBlur = 15;
                    ctx.shadowColor = '#ff9900'; // Orange glow for icons
                    ctx.drawImage(iconImages[this.iconName], this.x - this.radius, this.y - this.radius, size, size);
                    ctx.shadowBlur = 0;
                    ctx.restore();
                } else {
                    // Draw standard node
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                    ctx.fillStyle = '#252F3E'; // Navy blue nodes
                    ctx.fill();
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = '#ff9900'; // Orange glow
                    ctx.fill();
                    ctx.shadowBlur = 0; // Reset shadow
                }
            }
        }

        // Wire class (vertical lines with nodes)
        class Wire {
            constructor(x) {
                this.x = x;
                this.nodes = [];
                // Place nodes along the wire, with some as AWS icons
                for (let i = 1; i <= nodesPerWire; i++) {
                    const isIcon = Math.random() < 0.3; // 30% chance to be an AWS icon
                    this.nodes.push(new Node(this.x, i * nodeSpacing, isIcon));
                }
            }

            draw() {
                // Draw the vertical wire
                ctx.beginPath();
                ctx.moveTo(this.x, 0);
                ctx.lineTo(this.x, canvas.height);
                ctx.strokeStyle = `rgba(0, 170, 255, 0.7)`; // Neon blue wire
                ctx.lineWidth = 1.5;
                ctx.shadowBlur = 12;
                ctx.shadowColor = '#00aaff'; // Glowing effect
                ctx.stroke();
                ctx.shadowBlur = 0; // Reset shadow

                // Draw nodes along the wire
                this.nodes.forEach(node => node.draw());
            }
        }

        // Data pulse class (simulates data flowing along wires)
        class DataPulse {
            constructor(wire, startY, endY, direction) {
                this.wire = wire;
                this.startY = startY;
                this.endY = endY;
                this.progress = direction === 'down' ? 0 : 1; // Start at top or bottom
                this.speed = 0.03; // Speed of pulse movement
                this.direction = direction; // 'down' or 'up'
                this.color = pulseColors[Math.floor(Math.random() * pulseColors.length)];
            }

            update() {
                this.progress += this.direction === 'down' ? this.speed : -this.speed;
                return this.direction === 'down' ? this.progress < 1 : this.progress > 0;
            }

            draw() {
                const y = this.startY + (this.endY - this.startY) * this.progress;
                ctx.beginPath();
                ctx.arc(this.wire.x, y, 2, 0, Math.PI * 2);
                ctx.fillStyle = this.color; // Random pulse color
                ctx.shadowBlur = 8;
                ctx.shadowColor = this.color === '#ff9900' ? '#ff9900' : '#00aaff'; // Matching glow
                ctx.fill();
                ctx.shadowBlur = 0; // Reset shadow
            }
        }

        // Initialize wires
        for (let i = 1; i <= wireCount; i++) {
            wires.push(new Wire(i * wireSpacing));
        }

        // Animation loop
        function animate() {
            // Clear canvas with a semi-transparent background for glow trails
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(0, 0, 50, 0.1)'; // Dark blue with transparency
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw wires and nodes
            wires.forEach(wire => wire.draw());

            // Randomly spawn data pulses between nodes on each wire
            wires.forEach(wire => {
                for (let i = 0; i < wire.nodes.length - 1; i++) {
                    if (Math.random() < 0.005) { // 0.5% chance per frame
                        // Downward pulse
                        dataPulses.push(new DataPulse(wire, wire.nodes[i].y, wire.nodes[i + 1].y, 'down'));
                        // Upward pulse (for bidirectional flow)
                        dataPulses.push(new DataPulse(wire, wire.nodes[i + 1].y, wire.nodes[i].y, 'up'));
                    }
                }
            });

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
            canvas.height = window.inner
