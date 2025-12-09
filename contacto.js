document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("formulario");
  const modal = document.getElementById("modal-confirmacion");
  const btnVolver = document.getElementById("btn-volver");

  formulario.addEventListener("submit", function(e) {
    e.preventDefault();
    modal.classList.remove("hidden");
  });

  btnVolver.addEventListener("click", function() {
    modal.classList.add("hidden");
    formulario.reset();
  });
});
