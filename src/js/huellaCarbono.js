// Verifica y carga el usuario cuando se carga la página
document.addEventListener("DOMContentLoaded", () => {
    cargarDatosUsuario(); // Carga y valida el usuario
});

// Carga los datos del usuario y verifica si está autenticado
function cargarDatosUsuario() {
    const usuario = localStorage.getItem("usuario");
    const token = localStorage.getItem("token");

    if (!usuario || !token) {
        console.log("No se encontró usuario o token. Redirigiendo...");
        if (window.location.pathname !== "/landing.html") {
            window.location.href = "landing.html"; // Redirige al login si no está autenticado
        }
        return;
    }

    // Parsear el objeto usuario desde JSON
    const user = JSON.parse(usuario);
    console.log("Usuario desde localStorage:", user);  // Verificación del objeto

    // Actualizar el nombre del usuario en el DOM
    const nombreUsuario = document.getElementById("usuario");
    if (nombreUsuario && user.nombre_usuario) {
        nombreUsuario.textContent = user.nombre_usuario;
    }

    console.log("Usuario autenticado correctamente.");
    // Aquí ya no llamamos a calcularHuella(user.userId)

    async function calcularHuella(userId) {
        // Ahora que tenemos el ID del usuario como parámetro, podemos proceder con el flujo de preguntas
        console.log("ID del usuario recuperado:", userId);

        // Recoger respuestas a las preguntas del formulario
        const tipo_vehiculo = document.getElementById('vehicle-yes').checked ? 1 : 0;
        const tipo_vehiculo_especifico = document.querySelector('input[name="vehicleType"]:checked')?.value;
        const km_diario = document.getElementById('km_diario').value;
        const transporte_publico = document.getElementById('publicTransport-yes').checked ? 1 : 0;
        const medio_transporte = document.querySelector('input[name="transportType"]:checked')?.value;
        const km_transporte = document.getElementById('km_transporte').value;
        const viajes_avion = document.getElementById('viajes_avion_yes').checked ? 1 : 0;
        const destino_avion = document.getElementById('destination').value;
        const consumo_electricidad = document.getElementById('consumo_electricidad').value;
        const tipo_gas = document.getElementById('tipo_gas').value;
        const consumo_agua = document.getElementById('consumo_agua').value;
        const num_personas = document.getElementById('num_personas').value;
        const reciclas = document.getElementById('reciclas_yes').checked ? 1 : 0;
        const correos_bandeja = document.getElementById('correos_bandeja').value;

        const data = {
            userId,
            tipo_vehiculo,
            tipo_vehiculo_especifico,
            km_diario,
            transporte_publico,
            medio_transporte,
            km_transporte,
            viajes_avion,
            destino_avion,
            consumo_electricidad,
            tipo_gas,
            consumo_agua,
            num_personas,
            reciclas,
            correos_bandeja,
        };

        try {
            // Enviar los datos al servidor
            const response = await fetch('http://localhost:8092/api/huellas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            // Manejo de la respuesta del servidor
            if (response.ok) {
                Swal.fire('Datos enviados correctamente: ');
                setTimeout(() => {
                    window.location.href = "/resultadoHuella.html";
                }, 1000);
            } else {
                Swal.fire('Error al enviar los datos', 'Error desconocido', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error', 'No se pudo conectar con el servidor.', 'error');
        }
    }


    let currentQuestion = 0;
    const questions = document.querySelectorAll(".carousel-question");
    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");

    const conditionalFlow = {
        0: () => {
            const value = document.querySelector(
                'input[name="vehicle"]:checked'
            )?.value;
            return value === "0" ? 3 : 1; // Si no tiene vehículo, salta a la pregunta 6
        },
        3: () => {
            const value = document.querySelector(
                'input[name="publicTransport"]:checked'
            )?.value;
            return value === "0" ? 6 : 3; // Si no usa transporte público, salta a viajes en avión
        },
        6: () => {
            const value = document.querySelector(
                'input[name="airplaneTrip"]:checked'
            )?.value;
            return value === "0" ? 8 : 7; // Si no usa transporte público, salta a viajes en avión
        },

        3: () => {
            const value = document.querySelector(
                'input[name="publicTransport"]:checked'
            )?.value;
            return value === "0" ? 6 : 4; // Si no usa transporte público, salta a viajes en avión
        },
    };
    function showQuestion(index) {
        questions.forEach((q, i) => {
            q.classList.toggle("active", i === index);
        });
        currentQuestion = index;
        prevBtn.disabled = index === 0;

        // Ocultar el botón "Siguiente" en la última pregunta
        nextBtn.style.display =
            index === questions.length - 1 ? "none" : "inline-block";

        // Verificar si ya está respondida
        checkIfAnswered();
    }

    function checkIfAnswered() {
        const currentInputs = questions[currentQuestion].querySelectorAll(
            'input[type="radio"], input[type="number"], select, input[type="text"]'
        );
        const isAnswered = Array.from(currentInputs).some((input) => {
            if (input.type === "radio") return input.checked;
            return input.value.trim() !== "";
        });

        // Habilitar o deshabilitar el botón "Siguiente"
        nextBtn.disabled = !isAnswered;

        // Mostrar el botón "Calcular" solo si es la última pregunta y está respondida
        const calculateContainer =
            document.getElementById("calculateContainer");
        if (currentQuestion === questions.length - 1 && isAnswered) {
            calculateContainer.style.display = "block";
        } else {
            calculateContainer.style.display = "none";
        }
    }

    // Avanzar a la siguiente pregunta o flujo condicional
    nextBtn.addEventListener("click", () => {
        if (conditionalFlow[currentQuestion]) {
            showQuestion(conditionalFlow[currentQuestion]());
        } else {
            showQuestion(currentQuestion + 1);
        }
    });

    // Retroceder a la pregunta anterior
    prevBtn.addEventListener("click", () => {
        showQuestion(currentQuestion - 1);
    });

    // Agregar eventos para verificar las respuestas en tiempo real
    document.querySelectorAll("input, select").forEach((input) => {
        input.addEventListener("change", checkIfAnswered);
        input.addEventListener("input", checkIfAnswered);
    });

    // Mostrar la primera pregunta al cargar la página
    showQuestion(0);

    document.getElementById("calculateBtn").addEventListener("click", async (event) => {
        event.preventDefault();
        const usuario = localStorage.getItem("usuario");
        if (usuario) {
            const user = JSON.parse(usuario);
            await calcularHuella(user.userId); // Ahora se llama solo al hacer clic en "Calcular"
        }
    });
}