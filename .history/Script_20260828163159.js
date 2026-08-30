// Menu toggle
const toggle = document.querySelector('.menu-toggle');
const links = document.querySelector('.nav-links');
toggle.addEventListener('click', () => {
  links.classList.toggle('is-active');
});

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
revealEls.forEach(el => io.observe(el));

// Header shadow
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('is-scrolled', window.scrollY > 20);
});

// ===== Carrusel Swiper para las tarjetas =====
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.item-swiper').forEach((el) => {
    new Swiper(el, {
      loop: true,
      autoplay: {
        delay: 3500,
        disableOnInteraction: false,
      },
      pagination: {
        el: el.querySelector('.swiper-pagination'),
        clickable: true,
      },
      // Quitamos "navigation" porque no tienes flechas next/prev
      // individuales por tarjeta — con pagination + autoplay basta.
    });
  });
});