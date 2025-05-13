document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('networkCanvas');
    const ctx = canvas.getContext('2d');
    const resetBtn = document.getElementById('resetBtn');
    const nodeCountSlider = document.getElementById('nodeCount');
    const nodeCountValue = document.getElementById('nodeCountValue');
    const speedSlider = document.getElementById('speed');
    const speedValue = document.getElementById('speedValue');
    
    // Set canvas sizes
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', () => {
        resizeCanvas();
        initNodes();
    });
    
    resizeCanvas();
    
    // Node and connection variables
    let nodes = [];
    let connections = [];
    let dataPackets = [];
    let animationId;
    let nodeCount = 20;
    let flowSpeed = 5;
    
    // Update slider values
    nodeCountSlider.addEventListener('input', (e) => {
        nodeCount = parseInt(e.target.value);
        nodeCountValue.textContent = nodeCount;
        resetNetwork();
    });
    
    speedSlider.addEventListener('input', (e) => {
        flowSpeed = parseInt(e.target.value);
        speedValue.textContent = flowSpeed;
    });
    
    resetBtn.addEventListener('click', resetNetwork);
    
    // Node class
    class Node {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.radius = 8;
            this.connections = [];
            this.active = false;
            this.hue = Math.random() * 360;
        }
        
        draw() {
            // Draw glow if active
            if (this.active) {
                ctx.shadowBlur = 15;
                ctx.shadowColor = `hsla(${this.hue}, 100%, 50%, 0.8)`;
            }
            
            // Draw node
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.active ? 
                `hsl(${this.hue}, 100%, 60%)` : 'rgba(200, 200, 200, 0.8)';
            ctx.fill();
            
            // Reset shadow
            ctx.shadowBlur = 0;
            
            // Draw inner circle for active nodes
            if (this.active) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius * 0.6, 0, Math.PI * 2);
                ctx.fillStyle = 'white';
                ctx.fill();
            }
        }
    }
    
    // Connection class
    class Connection {
        constructor(node1, node2) {
            this.node1 = node1;
            this.node2 = node2;
            this.weight = Math.random() * 2 + 1; // Varied line width
            node1.connections.push(node2);
            node2.connections.push(node1);
        }
        
        draw() {
            ctx.beginPath();
            ctx.moveTo(this.node1.x, this.node1.y);
            ctx.lineTo(this.node2.x, this.node2.y);
            ctx.lineWidth = this.weight;
            ctx.strokeStyle = 'rgba(150, 150, 150, 0.3)';
            ctx.stroke();
        }
    }
    
    // DataPacket class
    class DataPacket {
        constructor(startNode, endNode, hue) {
            this.currentNode = startNode;
            this.targetNode = endNode;
            this.x = startNode.x;
            this.y = startNode.y;
            this.progress = 0;
            this.speed = flowSpeed * 0.002;
            this.hue = hue || Math.random() * 360;
            this.size = Math.random() * 4 + 2;
            this.path = this.findPath(startNode, endNode);
            this.pathIndex = 0;
        }
        
        findPath(start, end) {
            // Simple pathfinding - just go directly or find a random intermediate node
            if (Math.random() > 0.7 && start.connections.length > 0) {
                const intermediate = start.connections[Math.floor(Math.random() * start.connections.length)];
                return [start, intermediate, end];
            }
            return [start, end];
        }
        
        update() {
            if (this.pathIndex >= this.path.length - 1) {
                // Reached the end of the path, find a new target
                const newTarget = this.getRandomConnectedNode(this.path[this.path.length - 1]);
                if (newTarget) {
                    this.path = this.findPath(this.path[this.path.length - 1], newTarget);
                    this.pathIndex = 0;
                    this.progress = 0;
                } else {
                    return false; // No more nodes to go to
                }
            }
            
            const start = this.path[this.pathIndex];
            const end = this.path[this.pathIndex + 1];
            
            this.progress += this.speed;
            if (this.progress >= 1) {
                this.progress = 0;
                this.pathIndex++;
                this.currentNode = end;
                end.active = true;
                end.hue = this.hue;
                setTimeout(() => end.active = false, 200);
                return true;
            }
            
            this.x = start.x + (end.x - start.x) * this.progress;
            this.y = start.y + (end.y - start.y) * this.progress;
            return true;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 100%, 60%, 0.8)`;
            ctx.fill();
            
            // Add glow effect
            ctx.shadowBlur = 10;
            ctx.shadowColor = `hsla(${this.hue}, 100%, 50%, 0.6)`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 100%, 60%, 0.3)`;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
        
        getRandomConnectedNode(node) {
            if (node.connections.length === 0) return null;
            return node.connections[Math.floor(Math.random() * node.connections.length)];
        }
    }
    
    // Initialize nodes
    function initNodes() {
        nodes = [];
        connections = [];
        dataPackets = [];
        
        // Create nodes
        for (let i = 0; i < nodeCount; i++) {
            const padding = 100;
            const x = Math.random() * (canvas.width - padding * 2) + padding;
            const y = Math.random() * (canvas.height - padding * 2) + padding;
            nodes.push(new Node(x, y));
        }
        
        // Create connections
        for (let i = 0; i < nodes.length; i++) {
            // Connect to some nearby nodes
            for (let j = i + 1; j < nodes.length; j++) {
                const distance = Math.sqrt(
                    Math.pow(nodes[i].x - nodes[j].x, 2) + 
                    Math.pow(nodes[i].y - nodes[j].y, 2)
                );
                
                // Connect if within certain distance, with some randomness
                const maxDistance = Math.min(canvas.width, canvas.height) * 0.3;
                if (distance < maxDistance && Math.random() > 0.7) {
                    connections.push(new Connection(nodes[i], nodes[j]));
                }
            }
        }
        
        // Create some data packets
        for (let i = 0; i < nodeCount / 4; i++) {
            const start = nodes[Math.floor(Math.random() * nodes.length)];
            const end = nodes[Math.floor(Math.random() * nodes.length)];
            if (start !== end) {
                dataPackets.push(new DataPacket(start, end));
            }
        }
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw connections
        connections.forEach(conn => conn.draw());
        
        // Update and draw data packets
        dataPackets = dataPackets.filter(packet => packet.update());
        dataPackets.forEach(packet => packet.draw());
        
        // Draw nodes (on top of connections)
        nodes.forEach(node => node.draw());
        
        // Occasionally add new data packets
        if (Math.random() < 0.02 && nodes.length > 0) {
            const start = nodes[Math.floor(Math.random() * nodes.length)];
            const end = nodes[Math.floor(Math.random() * nodes.length)];
            if (start !== end) {
                dataPackets.push(new DataPacket(start, end));
            }
        }
        
        animationId = requestAnimationFrame(animate);
    }
    
    // Reset the network
    function resetNetwork() {
        cancelAnimationFrame(animationId);
        initNodes();
        animate();
    }
    
    // Start the animation
    initNodes();
    animate();
});
