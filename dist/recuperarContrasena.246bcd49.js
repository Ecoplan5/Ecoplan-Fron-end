async function recuperar() {
    const email = document.getElementById('email').value;
    if (!email) {
        Swal.fire("Error", "El correo del usuario es incorrecto", "error");
        return;
    }
    const data = {
        email
    };
    try {
        const response = await fetch('http://localhost:8092/api/solicitar-restablecimiento', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            // Éxito: Mostrar mensaje y redirigir
            Swal.fire("\xc9xito", "Hemos enviado un correo de recuperaci\xf3n. Revisa tu bandeja de entrada.", "success");
            setTimeout(()=>{
                window.location = "cambiarContrasena.html";
            }, 9000);
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

//# sourceMappingURL=recuperarContrasena.246bcd49.js.map
