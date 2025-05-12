// main.js
function showCategory(category) {
  const cards = document.querySelectorAll('.project-card');
  document.querySelectorAll('.tab').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  cards.forEach(card => {
    card.style.display = (category === 'all' || card.dataset.category === category) ? 'block' : 'none';
  });
}

function toggleDarkMode() {
  document.documentElement.classList.toggle('dark');
}

function openModal(id) {
  const titles = {
    'vpc': 'VPC Lab Details',
    'iam': 'IAM Lab Details'
  };
  const contents = {
    'vpc': 'Detailed description of the VPC lab goes here.',
    'iam': 'Detailed description of the IAM lab goes here.'
  };
  document.getElementById('modal-title').textContent = titles[id];
  document.getElementById('modal-content').textContent = contents[id];
  document.getElementById('modal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
}

