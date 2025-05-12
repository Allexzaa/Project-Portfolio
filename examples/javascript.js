const imageCount = 8;
const radius = 150;
const container = document.getElementById('carousel');

for (let i = 0; i < imageCount; i++) {
  const angle = (360 / imageCount) * i;
  const item = document.createElement('div');
  item.className = 'carousel-item';
  item.style.transform = `
    rotateY(${angle}deg)
    translateZ(${radius}px)
  `;

  const img = document.createElement('img');
  img.src = `https://picsum.photos/200?random=${i + 1}`;
  img.alt = `Image ${i + 1}`;

  item.appendChild(img);
  container.appendChild(item);
}
