// ─── MENU LATERAL — ATIVO POR SCROLL ───
const navItems = document.querySelectorAll('.content-nav-item');
const blocks = document.querySelectorAll('.case-block');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(i => i.classList.remove('active'));
      const active = document.querySelector(`.content-nav-item[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.5 });

blocks.forEach(block => observer.observe(block));
