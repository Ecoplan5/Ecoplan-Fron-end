document.addEventListener("DOMContentLoaded", ()=>{
    console.log("Inicializando Home.js...");
    cargarDatosUsuario(); // Llamar directamente a cargarDatosUsuario como función principal
});
/**
 * Función principal: verifica datos del usuario en localStorage
 * y redirige o carga la interfaz según corresponda.
 */ function cargarDatosUsuario() {
    console.log("Ejecutando cargarDatosUsuario...");
    const usuario = localStorage.getItem("usuario");
    const token = localStorage.getItem("token");
    console.log('Usuario desde localStorage:', usuario.nombre_usuario);
    // Si no existen datos, redirige al login
    if (!usuario || !token) {
        console.log("No se encontr\xf3 usuario o token. Redirigiendo a landing...");
        if (window.location.pathname !== "/landing.html") window.location.href = "landing.html"; // Redirige a la página de bienvenida
        return;
    }
    // Si estamos en la página login.html pero ya tenemos datos de usuario,
    // redirigimos a index.html
    if (window.location.pathname === "/login.html" && usuario && token) {
        console.log("Usuario autenticado. Redirigiendo a index.html...");
        window.location.href = "index.html"; // Redirige a la página principal
        return;
    }
    // Si estamos en landing.html o login.html, y ya tenemos un usuario autenticado,
    // redirigimos a index.html para evitar un bucle.
    if (window.location.pathname === "/landing.html" || window.location.pathname === "/login.html") {
        console.log("Usuario autenticado. Redirigiendo a index.html...");
        window.location.href = "index.html"; // Redirige a la página principal
        return;
    }
    // Si ya estás en index.html, no hagas nada
    if (window.location.pathname === "/index.html") {
        console.log("Ya est\xe1s en index.html.");
        return;
    }
    // Validación exitosa: redirigir a index.html
    console.log("Usuario validado correctamente. Redirigiendo a index.html...");
    window.location.href = "index.html";
}
// Función para mostrar/ocultar el menú desplegable
function toggleDropdown() {
    const menu = document.getElementById("dropdownMenu");
    menu.classList.toggle("active");
}
// Función para cerrar sesión
function logout() {
    console.log("Cerrando sesi\xf3n...");
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.href = "login.html";
}
// Cierra el menú al hacer clic fuera
document.addEventListener("click", function(event) {
    const dropdown = document.getElementById("dropdownMenu");
    const avatarContainer = document.querySelector(".avatar-container");
    if (dropdown && avatarContainer && !avatarContainer.contains(event.target) && !dropdown.contains(event.target)) dropdown.classList.remove("active");
});

//# sourceMappingURL=landing.46c34ead.js.map
