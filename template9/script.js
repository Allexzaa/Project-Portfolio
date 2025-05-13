document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('networkCanvas');
    const ctx = canvas.getContext('2d');
    
    // Configuration
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

    // Node class (must be defined before any functions that use it)
    class Node {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * (config.maxNodeSize - config.minNodeSize) + config.minNodeSize;
            this.color = Math.random() > 0.5 ? config.colors.blue : config.colors.purple;
            this.pulseSpeed = Math.random() * 0.01 + 0.005;
            this.pulseSize = this.size * 0.2;
            this.baseSize = this.size;
        }
        
        update() {
            // Gentle pulsing animation
            this.size = this.baseSize + Math.sin(Date.now() * this.pulseSpeed) * this.pulseSize;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.size
            );
            gradient.addColorStop(0, this.color);
            gradient.addColorStop(1, config.colors.darkBlue);
            
            ctx.fillStyle = gradient;
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.fill();
        }
    }

    // Light class
    class Light {
        constructor() {
            this.reset();
            this.tailLength = Math.random() * 15 + 10;
            this.tail = [];
        }
        
        reset() {
            this.startNode = nodes[Math.floor(Math.random() * nodes.length)];
            this.endNode = nodes[Math.floor(Math.random() * nodes.length)];
            while (this.endNode === this.startNode) {
                this.endNode = nodes[Math.floor(Math.random() * nodes.length)];
            }
            this.x = this.startNode.x;
            this.y = this.startNode.y;
            this.progress = 0;
            this.speed = Math.random() * (config.maxSpeed - config.minSpeed) + config.minSpeed;
            this.width = Math.random() * 2 + 1;
            this.color = Math.random() > 0.7 ? config.colors.white : 
                         (Math.random() > 0.5 ? config.colors.blue : config.colors.purple);
        }
        
        update() {
            this.progress += this.speed;
            this.tail.unshift({ x: this.x, y: this.y });
            if (this.tail.length > this.tailLength) this.tail.pop();
            
            if (this.progress >= 1) {
                this.reset();
                return;
            }
            
            this.x = this.startNode.x + (this.endNode.x - this.startNode.x) * this.progress;
            this.y = this.startNode.y + (this.endNode.y - this.startNode.y) * this.progress;
        }
        
        draw() {
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            
            for (let i = 0; i < this.tail.length - 1; i++) {
                const alpha = 1 - (i / this.tail.length);
                const segmentWidth = this.width * alpha;
                
                ctx.beginPath();
                ctx.moveTo(this.tail[i].x, this.tail[i].y);
                ctx.lineTo(this.tail[i+1].x, this.tail[i+1].y);
                
                const gradient = ctx.createLinearGradient(
                    this.tail[i].x, this.tail[i].y,
                    this.tail[i+1].x, this.tail[i+1].y
                );
                
                const midAlpha = alpha * 0.7;
                gradient.addColorStop(0, this.color.replace('0.8', alpha.toFixed(2)));
                gradient.addColorStop(0.5, this.color.replace('0.8', midAlpha.toFixed(2)));
                gradient.addColorStop(1, this.color.replace('0.8', '0.0'));
                
                ctx.strokeStyle = gradient;
                ctx.lineWidth = segmentWidth;
                ctx.stroke();
            }
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.width * 1.5, 0, Math.PI * 2);
            
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.width * 2
            );
            gradient.addColorStop(0, this.color);
            gradient.addColorStop(1, this.color.replace('0.8', '0.0'));
            
            ctx.fillStyle = gradient;
            ctx.fill();
        }
    }

    // Variables
    let nodes = [];
    let lights = [];
    let animationId;

    // Initialize nodes with proper spacing
    function initNodes() {
        nodes = [];
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

    // Animation loop
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

    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initNodes();
    }
    
    // Start everything
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();
});
