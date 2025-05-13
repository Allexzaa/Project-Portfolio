/* Reset and Base Styleds */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    background: #1a1a2e; /* Dark background from your theme */
    min-height: 100vh;
    overflow-x: hidden;
}

#network-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1; /* Ensures it stays behind other content */
    filter: brightness(1.2); /* Slight brightness to enhance glow */
}
