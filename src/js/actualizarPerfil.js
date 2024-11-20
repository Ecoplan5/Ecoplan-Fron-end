let usuarioData = {};  // Para almacenar la información del usuario

async function cargarUsuario() {
    try {
        const response = await fetch('http://localhost:8092/api/obtener/2');  // Obtener usuario con ID 1 (quemado)
        if (response.ok) {
            const data = await response.json();
            usuarioData = data;  // Aquí directamente almacenamos los datos, no data.usuario
            console.log('esto es lo que tiene el usuario ', usuarioData);  // Imprimir usuarioData
            mostrarUsuario(usuarioData);  // Llamar a la función para mostrar los datos en el formulario
        } else {
            console.error('Error al cargar el usuario:', response.status);
        }
    } catch (error) {
        console.error('Error al cargar el usuario:', error);
    }
}

function mostrarUsuario(usuario) {
    // Llenar los campos del formulario con los datos del usuario
    document.getElementById('nombre_usuario').value = usuario.nombre_usuario;
    document.getElementById('email').value = usuario.email;
}

async function actualizarUsuario() {
    const nombre_usuario = document.getElementById('nombre_usuario').value;
    const email = document.getElementById('email').value;
    const contrasena = document.getElementById('contrasena').value;  // Asegúrate de agregar el campo de contraseña si se usa

    if (!nombre_usuario) {
        Swal.fire("Error", "El campo Nombre Usuario es requerido", "error");
        return;
    }

    if (!email) {
        Swal.fire("Error", "El correo es requerido", "error");
        return;
    }

    if (!contrasena) {
        Swal.fire("Error", "El campo Contraseña es requerido", "error");
        return;
    }

    const data = {
        id_usuario: usuarioData.id_usuario,  // Usar el ID del usuario cargado
        nombre_usuario,
        email,
        contrasena,
    };

    // Suponiendo que el token está almacenado en localStorage
    const token = localStorage.getItem('token');
    if (!token) {
        Swal.fire("Error", "Token de autenticación no encontrado", "error");
        return;
    }

    try {
        const response = await fetch('http://localhost:8092/api/actualizarPerfil', {
            method: 'PUT',  // Usamos PUT para actualización
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`  // Agregar el token en los headers
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            Swal.fire("Éxito", "Datos actualizados correctamente", "success");
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

// Llamar a cargarUsuario cuando se carga la página
window.onload = cargarUsuario;
