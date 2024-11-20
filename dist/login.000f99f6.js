async function login() {
    const nombre_usuario = document.getElementById('nombre_usuario').value;
    const contrasena = document.getElementById('contrasena').value;
    if (!nombre_usuario || !contrasena) {
        Swal.fire("Error", "Usuario o contrase\xf1a son incorrectos", "error");
        return;
    }
    const data = {
        nombre_usuario,
        contrasena
    };
    try {
        const response = await fetch('http://localhost:8092/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            const responseData = await response.json();
            // Verificar si el backend ha enviado un token
            if (responseData.token) {
                console.log("Token recibido:", responseData.token); // Ver el token en la consola
                // Guardar el token en localStorage para su uso posterior
                localStorage.setItem('token', responseData.token);
                Swal.fire("\xc9xito", "Login exitoso", "success");
                setTimeout(()=>{
                    window.location = "index.html";
                }, 2000);
            } else Swal.fire("Error", "No se recibi\xf3 un token v\xe1lido", "error");
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

//# sourceMappingURL=login.000f99f6.js.map
