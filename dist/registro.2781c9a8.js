// Función de registro
async function registro() {
    const nombre_usuario = document.getElementById('nombre_usuario').value;
    const contrasena = document.getElementById('contrasena').value;
    const email = document.getElementById('email').value;
    if (!nombre_usuario || !contrasena) {
        Swal.fire("Error", "Usuario o contrase\xf1a son incorrectos ", "error");
        return;
    }
    if (!email) {
        Swal.fire("Error", "El Correo del usuario es incorrecto ", "error");
        return;
    }
    const data = {
        id_rol: 2,
        nombre_usuario,
        contrasena,
        email
    };
    try {
        const response = await fetch('http://localhost:8092/api/createUsuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            Swal.fire("\xc9xito", "Registro exitoso", "success");
            setTimeout(()=>{
                window.location = "/login.html";
            }, 1000);
        } else {
            // Error del servidor o usuario no encontrado
            const errorData = await response.json(); // Leer el cuerpo de la respuesta
            const mensajeError = errorData.mensaje || "Error desconocido"; // Fallback si no se incluye mensaje
            Swal.fire("Error", mensajeError, "error");
        }
    } catch (error) {
        console.error(error);
        // Error de conexión o problema en el fetch
        Swal.fire("Error", "No se pudo conectar con el servidor. Int\xe9ntalo m\xe1s tarde.", "error");
    }
}

//# sourceMappingURL=registro.2781c9a8.js.map
