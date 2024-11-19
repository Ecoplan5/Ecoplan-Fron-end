
async function cambiarContrasena() {
    const contrasena = document.getElementById('contrasena').value;

    if (!contrasena) {
        Swal.fire("Error", "La contraseña es requerida", "error");
        return;
    }

    const data = {
        contrasena,
    };

    try {
        const response = await fetch('http://localhost:8092/api/restablecerContrasena', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            Swal.fire("Éxito", "Contraseña restablecida correctamente", "success");
            setTimeout(() => {
                window.location = "login.html";
            }, 1000);
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
