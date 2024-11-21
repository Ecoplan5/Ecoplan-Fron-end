document.addEventListener("DOMContentLoaded", ()=>{
    cargarDatosUsuario(); // Llamar directamente a cargarDatosUsuario como función principal
});
function cargarDatosUsuario() {
    const usuario = localStorage.getItem("usuario");
    const token = localStorage.getItem("token");
    // Si no existen datos, redirige al login
    if (!usuario || !token) {
        console.log("No se encontr\xf3 usuario o token. Redirigiendo a landing...");
        if (window.location.pathname !== "/landing.html") window.location.href = "landing.html"; // Redirige a la página de bienvenida
        return;
    }
    // Parsear el objeto usuario desde JSON
    const user = JSON.parse(usuario);
    // Actualizar el nombre del usuario en el DOM
    const nombreUsuario = document.getElementById("usuario");
    if (nombreUsuario && user.nombre_usuario) nombreUsuario.textContent = user.nombre_usuario;
    // Continuar con la lógica de redirección
    if (window.location.pathname === "/login.html" && usuario && token) {
        console.log("Usuario autenticado. Redirigiendo a index.html...");
        window.location.href = "index.html";
        return;
    }
    if (window.location.pathname === "/landing.html" || window.location.pathname === "/login.html") {
        console.log("Usuario autenticado. Redirigiendo a index.html...");
        window.location.href = "index.html";
        return;
    }
    if (window.location.pathname === "/index.html") {
        console.log("Ya est\xe1s en index.html.");
        return;
    }
    console.log("Usuario validado correctamente. Redirigiendo a index.html...");
    window.location.href = "index.html";
}
/**
 * Función para mostrar el modal y cargar los datos del usuario
 */ function updateContactInfo() {
    const usuarioData = localStorage.getItem("usuario");
    if (!usuarioData) {
        console.error("No se encontr\xf3 informaci\xf3n del usuario en localStorage");
        return;
    }
    const usuario = JSON.parse(usuarioData);
    mostrarUsuario(usuario);
    // Mostrar el modal
    const modal = document.getElementById("modalActualizarContacto");
    modal.style.display = "flex";
}
/**
 * Función para cerrar el modal
 */ function cerrarModal() {
    const modal = document.getElementById("modalActualizarContacto");
    modal.style.display = "none";
}
// Cambiar la visibilidad de las contraseñas en el formulario
document.getElementById("verYocultarContrasena").addEventListener("change", function() {
    const passwordInputs = document.querySelectorAll('input[type="password"], input[type="text"]');
    passwordInputs.forEach((input)=>{
        // Cambia el tipo según el estado del checkbox
        input.type = this.checked ? "text" : "password";
    });
});
// Función para manejar el cambio de archivo (selección de imagen)
async function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) try {
        const formData = new FormData();
        formData.append('foto', file);
        // Obtener ID de usuario del localStorage o desde userInfo
        const userId = localStorage.getItem('userId') || (await getUserInfo()).id_usuario;
        formData.append('id_usuario', userId);
        // Seleccionar endpoint según el usuario
        const endpoint = userName === 'Admin' ? 'http://localhost:8095/api/upload/admin-profile' : 'http://localhost:8095/api/upload/empleado-profile';
        const response = await fetch(endpoint, {
            method: 'POST',
            body: formData,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await response.json();
        if (response.ok) {
            const fullUrl = `http://localhost:8095/uploads/${data.filePath}`;
            setProfileImage(fullUrl);
            // Convertir la imagen a base64 y almacenarla
            const reader = new FileReader();
            reader.onloadend = ()=>{
                const base64Image = reader.result;
                localStorage.setItem('profileImage', base64Image); // Guardar en localStorage
                setProfileImage(base64Image); // Actualizar la imagen en el frontend
            };
            reader.readAsDataURL(file);
            Swal.fire('Imagen actualizada', "La imagen de perfil ha sido actualizada con \xe9xito", 'success');
        } else Swal.fire('Error', data.message || 'Error al subir la imagen', 'error');
    } catch (error) {
        console.error('Error al subir la imagen:', error);
        Swal.fire('Error', 'Error al subir la imagen', 'error');
    }
}
// Función para activar el input de archivo// Función para activar el input de archivo
// Función que se activa cuando haces clic en el ícono de "Cargar imagen"
function uploadImage() {
    const fileInput = document.getElementById("fileInput");
    fileInput.click(); // Esto abre el cuadro de selección de archivos
}
// Función para manejar el cambio cuando un archivo es seleccionado
function handleFileChange(event) {
    const file = event.target.files[0]; // Obtiene el primer archivo seleccionado
    if (file) console.log("Archivo seleccionado: ", file.name);
}
/**
 * Función para mostrar los datos del usuario en el formulario
 */ function mostrarUsuario(usuario) {
    document.getElementById("nombre_usuario").value = usuario.nombre_usuario || "";
    document.getElementById("email").value = usuario.email || "";
}
async function actualizarUsuario() {
    const nombre_usuario = document.getElementById("nombre_usuario").value;
    const email = document.getElementById("email").value;
    const contrasena = document.getElementById("contrasena").value;
    const usuarioData = JSON.parse(localStorage.getItem("usuario"));
    const data = {
        id_usuario: usuarioData.id_usuario,
        nombre_usuario,
        email,
        contrasena
    };
    const token = localStorage.getItem("token");
    if (!token) {
        Swal.fire("Error", "Token de autenticaci\xf3n no encontrado", "error");
        return;
    }
    try {
        const response = await fetch("http://localhost:8092/api/actualizarPerfil", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            Swal.fire("\xc9xito", "Datos actualizados correctamente", "success");
            cerrarModal();
        } else {
            const errorData = await response.json();
            const mensajeError = errorData.mensaje || "Error desconocido";
            Swal.fire("Error", mensajeError, "error");
        }
    } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudo conectar con el servidor. Int\xe9ntalo m\xe1s tarde.", "error");
    }
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

//# sourceMappingURL=index.46c34ead.js.map
