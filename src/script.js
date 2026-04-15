// Nav scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile menu toggle
const toggle = document.querySelector('.nav__toggle');
const mobileMenu = document.getElementById('mobileMenu');

toggle.addEventListener('click', () => {
  toggle.classList.toggle('active');
  mobileMenu.classList.toggle('active');
  document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    toggle.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// Fade-in on scroll
const fadeEls = document.querySelectorAll(
  '.sobre__header, .sobre__content, .servico-card, .trabalho-card, .contato__title, .contato__link, .hero__tag, .hero__title, .hero__desc, .hero__cta'
);

fadeEls.forEach(el => el.classList.add('fade-in'));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

fadeEls.forEach(el => observer.observe(el));

// Marquee scroll on appear
const marqueeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelector('.marquee__track').classList.add('marquee__track--active');
        marqueeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

const marquee = document.querySelector('.marquee');
if (marquee) {
  marqueeObserver.observe(marquee);
}