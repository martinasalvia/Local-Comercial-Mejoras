// Selecciona el botón y el menú
const menuBtn = document.querySelector('.menu-btn');
const navUl = document.querySelector('.main-nav ul');

// Al hacer click en el botón, alterna la clase "activo"
menuBtn.addEventListener('click', () => {
  navUl.classList.toggle('activo');
});
