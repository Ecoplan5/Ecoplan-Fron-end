document.addEventListener("DOMContentLoaded", () => {
  cargarDatosUsuario(); // Carga y valida usuario
});

function cargarDatosUsuario() {
  const usuario = localStorage.getItem("usuario");
  const token = localStorage.getItem("token");

  if (!usuario || !token) {
    console.log("No se encontró usuario o token. Redirigiendo...");
    if (window.location.pathname !== "/landing.html") {
      window.location.href = "landing.html"; // Redirige
    }
    return;
  }

    // Parsear el objeto usuario desde JSON
    const user = JSON.parse(usuario);

    // Actualizar el nombre del usuario en el DOM
    const nombreUsuario = document.getElementById("usuario");
  
    if (nombreUsuario && user.nombre_usuario) {
      nombreUsuario.textContent = user.nombre_usuario;
    }
  

  // Verificar si ya estás autenticado en otras rutas
  if (window.location.pathname === "/blog.html") {
    console.log("Accediendo a blog.html como usuario autenticado.");
    return; // Permite la carga de blog.html
  }

  console.log("Usuario autenticado correctamente.");
}



/**
 * Función para mostrar el modal y cargar los datos del usuario
 */
function updateContactInfo() {
  const usuarioData = localStorage.getItem("usuario");
  if (!usuarioData) {
    console.error("No se encontró información del usuario en localStorage");
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
 */
function cerrarModal() {
  const modal = document.getElementById("modalActualizarContacto");
  modal.style.display = "none";
}
// Cambiar la visibilidad de las contraseñas en el formulario
document.addEventListener("DOMContentLoaded", () => {
  const togglePasswordVisibility = document.getElementById("verYocultarContrasena");

  if (togglePasswordVisibility) {
    togglePasswordVisibility.addEventListener("change", function () {
      const passwordInputs = document.querySelectorAll('input[type="password"], input[type="text"]');
      passwordInputs.forEach((input) => {
        input.type = this.checked ? "text" : "password";
      });
    });
  } else {
    console.warn("El elemento con ID 'verYocultarContrasena' no existe en el DOM.");
  }
});



// Array con los nombres de las imágenes

// Array con los nombres de las imágenes
const avatars = [
  "monster flat-02.svg",
  "monster flat-03.svg",
  "monster flat-04.svg",
  "monster flat-05.svg",
  "monster flat-06.svg",
  "monster flat-08.svg",
];

// Ruta base donde están almacenadas las imágenes SVG
const avatarPath = "src/image/avatars/";

// Función para mostrar la lista de avatares al hacer clic en "Cargar imagen"
function uploadImage() {
  const avatarContainer = document.getElementById('avatarSelectionContainer');
  const avatarsList = document.getElementById('avatarsList');

  if (!avatarContainer || !avatarsList) {
    console.error("Falta el contenedor o la lista de avatares en el HTML.");
    return;
  }

  avatarsList.innerHTML = ''; // Limpia las imágenes previas

  avatarContainer.style.display = 'block'; // Muestra el contenedor

  avatars.forEach(avatar => {
    // Crear la tarjeta
    const card = document.createElement('div');
    card.className = 'avatar-card';

    // Imagen dentro de la tarjeta
    const avatarImg = document.createElement('img');
    avatarImg.src = avatarPath + avatar;
    avatarImg.alt = avatar;

    avatarImg.addEventListener('click', () => {
      setProfileImage(avatarPath + avatar); // Establecer la imagen de perfil
      avatarContainer.style.display = 'none'; // Ocultar el contenedor
    });

    // Nombre del avatar (opcional)
    const avatarName = document.createElement('div');
    avatarName.className = 'avatar-name';

    // Añadir imagen y texto a la tarjeta
    card.appendChild(avatarImg);
    card.appendChild(avatarName);

    // Añadir la tarjeta al contenedor
    avatarsList.appendChild(card);
  });
}


function closeModal() {
  // Cierra el modal al poner su estilo display: none
  const modal = document.getElementById('avatarSelectionContainer');
  modal.style.display = 'none';
}

// Función para abrir el modal (puedes invocar esta función cuando quieras mostrar el modal)
function openModal() {
  const modal = document.getElementById('avatarSelectionContainer');
  modal.style.display = 'block';
}


// Función para establecer la imagen de perfil y guardarla en localStorage
function setProfileImage(imageUrl) {
  const profileImage = document.querySelector('.avatar-container img');
  profileImage.src = imageUrl; // Cambiar la imagen de perfil

  // Guardar la imagen seleccionada en localStorage
  localStorage.setItem('profileImage', imageUrl);
}

// Función para cargar la imagen de perfil guardada en localStorage
function cargarImagenDePerfil() {
  const savedImage = localStorage.getItem("profileImage");
  if (savedImage) {
    const profileImage = document.querySelector('.avatar-container img');
    if (profileImage) {
      profileImage.src = savedImage; // Establecer la imagen guardada
    } else {
      console.warn("El elemento '.avatar-container img' no existe en el DOM.");
    }
  } else {
    console.log("No se encontró ninguna imagen guardada en localStorage.");
  }
}


// Llamar a la función cuando el documento se cargue
document.addEventListener("DOMContentLoaded", cargarImagenDePerfil);


/**
 * Función para mostrar los datos del usuario en el formulario
 */
function mostrarUsuario(usuario) {
  document.getElementById("nombre_usuario").value = usuario.nombre_usuario || "";
  document.getElementById("email").value = usuario.email || "";
};


async function actualizarUsuario() {
  const nombre_usuario = document.getElementById("nombre_usuario").value;
  const email = document.getElementById("email").value;
  const contrasena = document.getElementById("contrasena").value;

  const usuarioData = JSON.parse(localStorage.getItem("usuario"));
  const data = {
    id_usuario: usuarioData.id_usuario,
    nombre_usuario,
    email,
    contrasena,
  };

  const token = localStorage.getItem("token");
  if (!token) {
    Swal.fire("Error", "Token de autenticación no encontrado", "error");
    return;
  }

  try {
    const response = await fetch("http://localhost:8092/api/actualizarPerfil", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      // Actualizar localStorage con los nuevos datos
      const updatedUser = { ...usuarioData, nombre_usuario, email };
      localStorage.setItem("usuario", JSON.stringify(updatedUser));

      // Actualizar el nombre de usuario y el email en el DOM
      document.getElementById("usuario").textContent = nombre_usuario;
      document.getElementById("email").value = email;

      Swal.fire("Éxito", "Datos actualizados correctamente", "success");
      cerrarModal();
    } else {
      const errorData = await response.json();
      const mensajeError = errorData.mensaje || "Error desconocido";
      Swal.fire("Error", mensajeError, "error");
    }
  } catch (error) {
    console.error(error);
    Swal.fire("Error", "No se pudo conectar con el servidor. Inténtalo más tarde.", "error");
  }
}


// Función para mostrar/ocultar el menú desplegable
function toggleDropdown() {
  const menu = document.getElementById("dropdownMenu");
  menu.classList.toggle("active");
}




// Función para cerrar sesión
function logout() {
  Swal.fire({
    title: '¿Estás seguro?',
    text: "No podrás revertir esta acción",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, cerrar sesión',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      // Si el usuario confirma, proceder a cerrar sesión
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      window.location.href = "landing.html"; // Redirigir al login
    } else {
      // Si el usuario cancela, no hacer nada
      console.log("Cierre de sesión cancelado");
    }
  });
}

// Cierra el menú al hacer clic fuera
document.addEventListener("click", function (event) {
  const dropdown = document.getElementById("dropdownMenu");
  const avatarContainer = document.querySelector(".avatar-container");
  if (
    dropdown &&
    avatarContainer &&
    !avatarContainer.contains(event.target) &&
    !dropdown.contains(event.target)
  ) {
    dropdown.classList.remove("active");
  }
});
