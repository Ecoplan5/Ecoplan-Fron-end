
async function login() {
    const nombre_usuario = document.getElementById('nombre_usuario').value;
    const contrasena = document.getElementById('contrasena').value;


    if (!nombre_usuario || !contrasena) {
        Swal.fire("Error", "Usuario o contraseña son incorrectos ", "error");
        return;
    }

    const data = {
        nombre_usuario,
        contrasena,
    };

    try {
        const response = await fetch('http://localhost:8092/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            Swal.fire("Éxito", "Registro exitoso", "success");
            setTimeout(() => {
                window.location = "index.html"; 
            }, 2000);
        } else {
            // Error del servidor o usuario no encontrado
            const errorData = await response.json(); // Leer el cuerpo de la respuesta
            const mensajeError = errorData.mensaje || "Error desconocido"; // Fallback si no se incluye mensaje
            Swal.fire("Error", mensajeError, "error");
        }
    } catch (error) {
        console.error(error);
        // Error de conexión o problema en el fetch
        Swal.fire("Error", "No se pudo conectar con el servidor. Inténtalo más tarde.", "error");
    }
}
