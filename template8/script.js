document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('networkCanvas');
    const ctx = canvas.getContext('2d');
    const resetBtn = document.getElementById('resetBtn');
    const nodeCountSlider = document.getElementById('nodeCount');
    const nodeCountValue = document.getElementById('nodeCountValue');
    const speedSlider = document.getElementById('speed');
    const speedValue = document.getElementById('speedValue');
    
    // Set canvas size
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
    let dataDrops = [];
    let animationId;
    let nodeCount = 15;
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
        constructor(x, y, column) {
            this.x = x;
            this.y = y;
            this.column = column;
            this.radius = 10;
            this.connections = [];
            this.active = false;
            this.hue = 200 + Math.random() * 160; // Blue to purple hues
            this.baseY = y;
            this.wobble = Math.random() * 20 - 10;
            this.wobbleSpeed = Math.random() * 0.02 + 0.01;
            this.wobbleOffset = Math.random() * Math.PI * 2;
        }
        
        update() {
            // Gentle up/down wobble
            this.y = this.baseY + Math.sin(Date.now() * this.wobbleSpeed + this.wobbleOffset) * this.wobble;
        }
        
        draw() {
            // Draw connection glow if active
            if (this.active) {
                ctx.shadowBlur = 20;
                ctx.shadowColor = `hsla(${this.hue}, 100%, 50%, 0.5)`;
            }
            
            // Draw node
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            
            // Gradient fill
            const gradient = ctx.createRadialGradient(
                this.x, this.y, this.radius * 0.3,
                this.x, this.y, this.radius
            );
            gradient.addColorStop(0, `hsla(${this.hue}, 100%, 70%, 1)`);
            gradient.addColorStop(1, `hsla(${this.hue}, 80%, 40%, ${this.active ? 1 : 0.8})`);
            
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Reset shadow
            ctx.shadowBlur = 0;
            
            // Draw inner highlight
            if (this.active || Math.random() > 0.9) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius * 0.4, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                ctx.fill();
            }
        }
    }
    
    // Connection class
    class Connection {
        constructor(node1, node2) {
            this.node1 = node1;
            this.node2 = node2;
            this.width = Math.random() * 1.5 + 0.5;
            this.hue = (node1.hue + node2.hue) / 2;
            node1.connections.push(node2);
            node2.connections.push(node1);
        }
        
        draw() {
            // Draw connection line
            ctx.beginPath();
            ctx.moveTo(this.node1.x, this.node1.y);
            
            // Make curved connections for non-vertical/horizontal
            if (Math.abs(this.node1.column - this.node2.column) > 1) {
                const cp1x = (this.node1.x + this.node2.x) / 2;
                const cp1y = (this.node1.y + this.node2.y) / 2 + 
                            (this.node1.x - this.node2.x) * 0.3;
                ctx.quadraticCurveTo(cp1x, cp1y, this.node2.x, this.node2.y);
            } else {
                ctx.lineTo(this.node2.x, this.node2.y);
            }
            
            ctx.lineWidth = this.width;
            ctx.strokeStyle = `hsla(${this.hue}, 60%, 50%, 0.2)`;
            ctx.stroke();
            
            // Draw glow effect
            ctx.shadowBlur = 5;
            ctx.shadowColor = `hsla(${this.hue}, 100%, 50%, 0.3)`;
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
    }
    
    // WaterDrop class
    class WaterDrop {
        constructor(startNode, endNode) {
            this.startNode = startNode;
            this.currentNode = startNode;
            this.targetNode = endNode;
            this.x = startNode.x;
            this.y = startNode.y;
            this.progress = 0;
            this.speed = flowSpeed * 0.0015;
            this.hue = startNode.hue;
            this.size = Math.random() * 6 + 4;
            this.path = this.findPath(startNode, endNode);
            this.pathIndex = 0;
            this.tail = [];
            this.maxTailLength = 10;
        }
        
        findPath(start, end) {
            // Sometimes take a detour for more interesting paths
            if (Math.random() > 0.6 && start.connections.length > 0) {
                const intermediate = this.getRandomIntermediate(start, end);
                if (intermediate) return [start, intermediate, end];
            }
            return [start, end];
        }
        
        getRandomIntermediate(start, end) {
            // Find a node that's not the direct target
            const possible = start.connections.filter(n => n !== end);
            if (possible.length === 0) return null;
            return possible[Math.floor(Math.random() * possible.length)];
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
            
            // Update tail
            this.tail.unshift({ x: this.x, y: this.y });
            if (this.tail.length > this.maxTailLength) {
                this.tail.pop();
            }
            
            if (this.progress >= 1) {
                this.progress = 0;
                this.pathIndex++;
                this.currentNode = end;
                end.active = true;
                end.hue = this.hue;
                setTimeout(() => end.active = false, 300);
                return true;
            }
            
            // Calculate position with easing for more fluid motion
            const easeProgress = this.easeInOutCubic(this.progress);
            
            // For curved connections
            if (Math.abs(start.column - end.column) > 1) {
                const cp1x = (start.x + end.x) / 2;
                const cp1y = (start.y + end.y) / 2 + (start.x - end.x) * 0.3;
                
                const t = easeProgress;
                const mt = 1 - t;
                this.x = mt * mt * start.x + 2 * mt * t * cp1x + t * t * end.x;
                this.y = mt * mt * start.y + 2 * mt * t * cp1y + t * t * end.y;
            } else {
                // Straight line movement
                this.x = start.x + (end.x - start.x) * easeProgress;
                this.y = start.y + (end.y - start.y) * easeProgress;
            }
            
            return true;
        }
        
        easeInOutCubic(t) {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }
        
        draw() {
            // Draw tail
            ctx.save();
            for (let i = 0; i < this.tail.length; i++) {
                const point = this.tail[i];
                const alpha = 1 - (i / this.tail.length);
                const size = this.size * (i / this.tail.length * 0.5 + 0.5);
                
                ctx.beginPath();
                ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
                
                const gradient = ctx.createRadialGradient(
                    point.x, point.y, 0,
                    point.x, point.y, size
                );
                gradient.addColorStop(0, `hsla(${this.hue}, 100%, 70%, ${alpha * 0.8})`);
                gradient.addColorStop(1, `hsla(${this.hue}, 100%, 50%, ${alpha * 0.2})`);
                
                ctx.fillStyle = gradient;
                ctx.fill();
            }
            ctx.restore();
            
            // Draw main drop
            ctx.save();
            ctx.shadowBlur = 15;
            ctx.shadowColor = `hsla(${this.hue}, 100%, 50%, 0.7)`;
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.size
            );
            gradient.addColorStop(0, `hsla(${this.hue}, 100%, 80%, 1)`);
            gradient.addColorStop(0.7, `hsla(${this.hue}, 100%, 60%, 0.8)`);
            gradient.addColorStop(1, `hsla(${this.hue}, 100%, 50%, 0)`);
            
            ctx.fillStyle = gradient;
            ctx.fill();
            ctx.restore();
            
            // Draw white highlight
            ctx.beginPath();
            ctx.arc(
                this.x - this.size * 0.3,
                this.y - this.size * 0.3,
                this.size * 0.3,
                0, Math.PI * 2
            );
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.fill();
        }
        
        getRandomConnectedNode(node) {
            if (node.connections.length === 0) return null;
            return node.connections[Math.floor(Math.random() * node.connections.length)];
        }
    }
    
    // Initialize nodes in vertical columns
    function initNodes() {
        nodes = [];
        connections = [];
        dataDrops = [];
        
        const columns = Math.min(5, Math.floor(nodeCount / 5) + 1);
        const nodesPerColumn = Math.ceil(nodeCount / columns);
        const columnWidth = canvas.width / (columns + 1);
        
        // Create nodes in vertical columns
        for (let col = 0; col < columns; col++) {
            const x = columnWidth * (col + 1);
            const verticalSpacing = canvas.height / (nodesPerColumn + 1);
            
            for (let row = 0; row < nodesPerColumn && nodes.length < nodeCount; row++) {
                const y = verticalSpacing * (row + 1) + (Math.random() * 40 - 20);
                nodes.push(new Node(x, y, col));
            }
        }
        
        // Create connections
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            
            // Connect to some nodes in the same column (vertical)
            if (i > 0 && nodes[i-1].column === node.column && Math.random() > 0.3) {
                connections.push(new Connection(nodes[i-1], node));
            }
            
            // Connect to nodes in nearby columns (horizontal/diagonal)
            for (let j = 0; j < nodes.length; j++) {
                if (i !== j) {
                    const other = nodes[j];
                    const colDiff = Math.abs(node.column - other.column);
                    const verticalDist = Math.abs(node.y - other.y);
                    
                    // Horizontal connections to nearby columns
                    if (colDiff === 1 && verticalDist < canvas.height * 0.2 && Math.random() > 0.7) {
                        connections.push(new Connection(node, other));
                    }
                    
                    // Diagonal connections
                    if (colDiff <= 2 && verticalDist < canvas.height * 0.3 && Math.random() > 0.9) {
                        connections.push(new Connection(node, other));
                    }
                }
            }
        }
        
        // Create circular connections in each column
        nodes.forEach((node, i) => {
            if (i > 0 && node.column === nodes[i-1].column && i % 3 === 0) {
                if (i + 2 < nodes.length && nodes[i+2].column === node.column) {
                    connections.push(new Connection(nodes[i-1], nodes[i+2]));
                }
            }
        });
        
        // Create initial water drops
        for (let i = 0; i < nodeCount / 3; i++) {
            const start = nodes[Math.floor(Math.random() * nodes.length)];
            const end = nodes[Math.floor(Math.random() * nodes.length)];
            if (start !== end) {
                dataDrops.push(new WaterDrop(start, end));
            }
        }
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update nodes (for wobble effect)
        nodes.forEach(node => node.update());
        
        // Draw connections
        connections.forEach(conn => conn.draw());
        
        // Update and draw water drops
        dataDrops = dataDrops.filter(drop => drop.update());
        dataDrops.forEach(drop => drop.draw());
        
        // Draw nodes (on top of connections)
        nodes.forEach(node => node.draw());
        
        // Occasionally add new water drops
        if (Math.random() < 0.03 && nodes.length > 0) {
            const start = nodes[Math.floor(Math.random() * nodes.length)];
            const end = nodes[Math.floor(Math.random() * nodes.length)];
            if (start !== end) {
                dataDrops.push(new WaterDrop(start, end));
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
