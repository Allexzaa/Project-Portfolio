document.addEventListener('DOMContentLoaded', function() {
    const svg = document.getElementById('connections');
    const resources = [
        { id: 'ec2', x: 150, y: 150 },
        { id: 's3', x: 350, y: 350 },
        { id: 'lambda', x: 150, y: 550 },
        { id: 'dynamodb', x: 550, y: 350 },
    ];

    resources.forEach(resource => {
        const rect = document.getElementById(resource.id).getBoundingClientRect();
        resource.x = rect.left + rect.width / 2;
        resource.y = rect.top + rect.height / 2;
    });

    // Draw connections
    const connections = [
        { from: 'ec2', to: 's3' },
        { from: 'ec2', to: 'lambda' },
        { from: 'lambda', to: 'dynamodb' },
        { from: 's3', to: 'dynamodb' },
    ];

    connections.forEach(connection => {
        const from = resources.find(r => r.id === connection.from);
        const to = resources.find(r => r.id === connection.to);

        const line = document.createElementNS("http://www.w3.org/2000/svg", 'line');
        line.setAttribute('x1', from.x);
        line.setAttribute('y1', from.y);
        line.setAttribute('x2', to.x);
        line.setAttribute('y2', to.y);
        line.setAttribute('stroke', 'white');
        line.setAttribute('stroke-width', '2');
        svg.appendChild(line);
    });
});
