function togglePassword() {
    const passwordField = document.getElementById('contrasena');
    const icon = document.getElementById('togglePassword');

    // Cambiar el tipo del campo de contraseña
    if (passwordField.type === "password") {
        passwordField.type = "text"; // Hacer visible la contraseña
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    } else {
        passwordField.type = "password"; // Ocultar la contraseña
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    }
}


// Esta función controla la visibilidad de ambos campos de contraseña
document.getElementById('showPasswordCheckbox').addEventListener('change', function() {
    const contrasena = document.getElementById('contrasena');
    const confirmarContrasena = document.getElementById('confirmar_contrasena');

    if (this.checked) {
        // Si el checkbox está marcado, mostramos las contraseñas
        contrasena.type = 'text';
        confirmarContrasena.type = 'text';
    } else {
        // Si el checkbox no está marcado, ocultamos las contraseñas
        contrasena.type = 'password';
        confirmarContrasena.type = 'password';
    }
});


