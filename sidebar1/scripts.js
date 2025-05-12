const sidebar = document.getElementById('floating-sidebar');
let lastScroll = window.scrollY;

function followScroll() {
  const targetTop = window.scrollY + 100; // 100px offset from top
  const currentTop = parseFloat(getComputedStyle(sidebar).top);
  const newTop = currentTop + (targetTop - currentTop) * 0.1; // easing effect
  sidebar.style.top = `${newTop}px`;
  requestAnimationFrame(followScroll);
}

followScroll();
