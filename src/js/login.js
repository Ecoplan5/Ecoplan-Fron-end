async function login() {
    const nombre_usuario = document.getElementById('nombre_usuario').value;
    const contrasena = document.getElementById('contrasena').value;

    if (!nombre_usuario || !contrasena) {
        Swal.fire("Error", "Usuario o contraseña son incorrectos", "error");
        return;
    }

    const data = { nombre_usuario, contrasena };

    try {
        const response = await fetch('http://localhost:8092/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const responseData = await response.json();

            if (responseData.token && responseData.usuario) {
                // Guardar token y datos del usuario en localStorage
                localStorage.setItem("token", responseData.token);
                localStorage.setItem("usuario", JSON.stringify(responseData.usuario));
             
                Swal.fire("Éxito", "Inicio de sesión exitoso", "success");
                setTimeout(() => {
                    console.log("Mandando al index...");
                    window.location.href = "/index.html"; 
                }, 2000);
            } else {
                Swal.fire("Error", "Datos de inicio de sesión inválidos.", "error");
            }
        } else {
            const errorData = await response.json();
            const mensajeError = errorData.mensaje || "Error desconocido";
            Swal.fire("Error", mensajeError, "error");
        }
    } catch (error) {
        console.error("Error en la conexión:", error);
        Swal.fire("Error", "No se pudo conectar con el servidor.", "error");
    }
}
