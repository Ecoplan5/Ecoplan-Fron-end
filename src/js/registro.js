async function registro() {
    const nombre_usuario = document.getElementById('nombre_usuario').value;
    const contrasena = document.getElementById('contrasena').value;
    const email = document.getElementById('email').value;
  
    // Validaciones iniciales
    if (!nombre_usuario || !contrasena) {
      Swal.fire("Error", "Usuario o contraseña son incorrectos", "error");
      return;
    }
  
    if (!email) {
      Swal.fire("Error", "El correo del usuario es incorrecto", "error");
      return;
    }
  
    // Datos para enviar
    const data = {
      nombre_usuario,
      contrasena,
      email,
    };
  
    try {
      // Enviar solicitud al backend
      const response = await fetch('http://localhost:8092/api/createUsuario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      // Manejo de la respuesta
      if (response.ok) {
        // Usuario creado con éxito
        Swal.fire("Éxito", "Registro exitoso", "success");
        setTimeout(() => {
          window.location = "/login.html"; // Redirige al usuario al login
        }, 1000);
      } else {
        // Error del servidor o validación fallida
        const errorData = await response.json(); // Leer la respuesta del backend
        const mensajeError = errorData.mensaje || "Ocurrió un error al procesar la solicitud.";
        Swal.fire("Error", mensajeError, "error");
      }
    } catch (error) {
      // Error de conexión o problema en el fetch
      console.error("Error en la conexión:", error);
      Swal.fire("Error", "No se pudo conectar con el servidor. Inténtalo más tarde.", "error");
    }
  }
  