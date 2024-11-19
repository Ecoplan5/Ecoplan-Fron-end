
// Cambiar el nombre del usuario dinámicamente
document.getElementById("username").textContent = "Feliciano M"; // Cambia este valor dinámicamente

// Función para mostrar/ocultar el menú desplegable
function toggleDropdown() {
  const menu = document.getElementById("dropdownMenu");
  menu.classList.toggle("active");
}

// Función para actualizar datos de contacto
function updateContactInfo() {
  alert(
    "Abrir formulario para actualizar datos de contacto (pendiente de implementación)."
  );
}

// Función para cargar imagen
function uploadImage() {
  alert(
    "Abrir diálogo para cargar nueva imagen (pendiente de implementación)."
  );
}

// Función para seleccionar una imagen existente
function selectImage() {
  alert(
    "Abrir opciones para seleccionar una imagen (pendiente de implementación)."
  );
}

// Función para cerrar sesión
function logout() {
  window.location.href = "login.html"; // Redirige al usuario a la página de inicio de sesión
}

// Cierra el menú al hacer clic fuera
document.addEventListener("click", function (event) {
  const dropdown = document.getElementById("dropdownMenu");
  const avatarContainer = document.querySelector(".avatar-container");
  if (
    !avatarContainer.contains(event.target) &&
    !dropdown.contains(event.target)
  ) {
    dropdown.classList.remove("active");
  }
});
