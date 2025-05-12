const sidebar = document.getElementById('floating-sidebar');

function followScroll() {
  const targetTop = window.scrollY + 50;
  const currentTop = parseFloat(getComputedStyle(sidebar).top);
  const newTop = currentTop + (targetTop - currentTop) * 0.1;
  sidebar.style.top = `${newTop}px`;
  requestAnimationFrame(followScroll);
}

followScroll();
