const data = {
    "huellas": [] // Este array se rellenará con los datos de la base de datos.
};

// Obtener los elementos de canvas y contenedor de detalles
const Vehículo = document.getElementById('graficoVehiculo').getContext('2d');
const Agua = document.getElementById('graficoAgua').getContext('2d');
const ctxTransportePublico = document.getElementById('graficoTransportePublico').getContext('2d');
const ctxElectricidad = document.getElementById('graficoElectricidad').getContext('2d');
const ctxTotal = document.getElementById('graficoTotal').getContext('2d');
const detailsContainer = document.getElementById('detallesHuellas');

// Función para obtener las huellas
const getHuellas = async () => {
    try {
        const response = await fetch('http://localhost:8092/api/huellas'); // Cambia la URL a la ruta de tu API
        const result = await response.json();
        data.huellas = result.huellas;

        if (data.huellas.length > 0) {
            // Obtener el nombre del usuario
            const huella = data.huellas[0];
            const nombreUsuario = huella.usuario?.nombre_usuario || "Nombre no disponible";

            // Mostrar el nombre en la interfaz
            const nombreUsuarioElement = document.getElementById('nombreUsuario');
            if (nombreUsuarioElement) {
                nombreUsuarioElement.textContent = `Bienvenido, ${nombreUsuario}`;
            }
            // Crear gráficos y mostrar detalles
            createCharts();
            displayDetails();
        } else {
            console.warn('No se encontraron huellas para el usuario');
        }
    } catch (error) {
        console.error('Error al obtener huellas:', error);
    }
};




const displayDetails = () => {
    if (!data.huellas || data.huellas.length === 0) {
        console.error('No hay datos de huellas disponibles');
        return;
    }

    const huella = data.huellas[0];
    const resultadoHuella = huella.resultado_huella?.resultado_huella;

    if (!resultadoHuella) {
        console.error('Resultado de huella no encontrado');
        return;
    }

    console.log("estos son los resultados", resultadoHuella);

    // Extraer y redondear los datos
    const categorias = [
        {
            titulo: 'Electricidad',
            descripcion: resultadoHuella.electricidad.descripcion,
            emision_por_km: resultadoHuella.electricidad.emision_por_kWh,
            emisionTotal: Math.round (resultadoHuella.electricidad.emision_total),
            ecoConsejo: resultadoHuella.electricidad.ecoConsejo,
            ecodesafios: resultadoHuella.electricidad.ecoDesafios,
            accionesSugeridas: Array.isArray(resultadoHuella.electricidad.acciones_sugeridas) ? resultadoHuella.electricidad.acciones_sugeridas : [], // Manejar datos no encontrados
        },
        {
            titulo: 'Agua',
            descripcion: resultadoHuella.agua.descripcion,
            emisionTotal: resultadoHuella.agua.emision_total,
            emision_por_km: resultadoHuella.agua.emision_por_m3,
            ecoConsejo: resultadoHuella.agua.ecoConsejo,
            ecodesafios: resultadoHuella.agua.ecoDesafios,
            accionesSugeridas: Array.isArray(resultadoHuella.agua.acciones_sugeridas) ? resultadoHuella.agua.acciones_sugeridas : [], // Manejar datos no encontrados
        },
        {
            titulo: 'Vehículo',
            descripcion: resultadoHuella.vehiculo.descripcion,
            emision_por_km: resultadoHuella.vehiculo.emision_por_km,
            emisionTotal: resultadoHuella.vehiculo.emision_total,
            ecoConsejo: resultadoHuella.vehiculo.ecoConsejo,
            ecodesafios: resultadoHuella.vehiculo.ecoDesafios,
            accionesSugeridas: Array.isArray(resultadoHuella.vehiculo.acciones_sugeridas) ? resultadoHuella.vehiculo.acciones_sugeridas : [], // Manejar datos no encontrados
        },
        {
            titulo: 'Transporte Público',
            descripcion: resultadoHuella.transporte_publico.descripcion,
            emision_por_km: resultadoHuella.transporte_publico.emision_por_km,
            emisionTotal: resultadoHuella.transporte_publico.emision_total,
            ecoConsejo: resultadoHuella.transporte_publico.ecoConsejo,
            ecodesafios: resultadoHuella.transporte_publico.ecoDesafios,
            accionesSugeridas: Array.isArray(resultadoHuella.transporte_publico.acciones_sugeridas) ? resultadoHuella.transporte_publico.acciones_sugeridas : [], // Manejar datos no encontrados
        },
    ];

    // Ordenar las categorías por emisión total descendente
    categorias.sort((a, b) => b.emisionTotal - a.emisionTotal);
    console.log('estas son las categorias ', categorias);

    // Generar el HTML de la tabla
    const html = `
        <table border="1" style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr>
                    <th>Categoría</th>
                    <th>Descripción</th>
                    <th>Emisión Total (kg CO₂)</th>
                    <th>Emisión por km (kg CO₂)</th>
                    <th>Acciones Sugeridas</th>
                    <th> Eco Consejo</th>
                    <th> Eco Desafío</th> <!-- Añadido aquí -->
                </tr>
            </thead>
            <tbody>
                ${categorias.map(cat => `
                    <tr>
                        <td>${cat.titulo}</td>
                        <td>${cat.descripcion}</td>
                        <td>${cat.emision_por_km}</td>
                        <td>${cat.emisionTotal}</td>
                        <td>${Array.isArray(cat.accionesSugeridas) ? cat.accionesSugeridas.join(', ') : ''}</td>
                        <td>${cat.ecoConsejo}</td>
                        <td>${cat.ecodesafios}</td> <!-- Mostrar los desafíos aquí -->
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    // Insertar el HTML generado en el contenedor
    detailsContainer.innerHTML = `<h3>Detalles de la Huella de Carbono</h3>${html}`;
};




const createCharts = () => {
    if (!data.huellas || data.huellas.length === 0) {
        console.error('No hay datos de huellas disponibles');
        return;
    }

    const huella = data.huellas[0];
    const resultadoHuella = huella.resultado_huella?.resultado_huella;

    if (!resultadoHuella) {
        console.error('Resultado de huella no encontrado');
        return;
    }

    const vehiculoEmisionTotal = Math.round(resultadoHuella.vehiculo?.emision_total || 0);
    const transportePublicoEmisionTotal = Math.round(resultadoHuella.transporte_publico?.emision_total || 0);
    const resumen = Math.round(resultadoHuella.agua?.emision_total || 0);
    const electricidadEmisionTotal = Math.round(resultadoHuella.electricidad?.emision_total || 0);
    const aguaEmisionTotal = Math.round(resultadoHuella.agua?.emision_total || 0);
    const totalEmisiones = vehiculoEmisionTotal + transportePublicoEmisionTotal + resumen + electricidadEmisionTotal + aguaEmisionTotal;

    // Datos en porcentaje (calculados una sola vez)
    const dataPorcentajes = [
        (vehiculoEmisionTotal / totalEmisiones) * 100,
        (transportePublicoEmisionTotal / totalEmisiones) * 100,
        (resumen / totalEmisiones) * 100,
        (electricidadEmisionTotal / totalEmisiones) * 100,
        (aguaEmisionTotal / totalEmisiones) * 100
    ];

    const labels = ['Vehículo', 'Transporte Público', 'Resumen Total', 'Electricidad', 'Agua'];
    const colors = ['#4bc0c0', '#99990f', '#ff9f40', '#1b16a9', '#9b36a9'];

    // Gráficos individuales y general
    const datasets = [
        { ctx: Vehículo, label: 'Vehículo', index: 0, color: '#4bc0c0' },
        { ctx: ctxTransportePublico, label: 'Transporte Público', index: 1, color: '#99990f' },
        { ctx: ctxElectricidad, label: 'Electricidad', index: 3, color: '#1b16a9' },
        { ctx: Agua, label: 'Agua', index: 4, color: '#9b36a9' },
    ];

    datasets.forEach(dataset => {
        new Chart(dataset.ctx, {
            type: 'doughnut',
            data: {
                labels: [dataset.label],
                datasets: [{
                    data: [dataPorcentajes[dataset.index], 100 - dataPorcentajes[dataset.index]],
                    backgroundColor: [dataset.color, '#e0e0e0'] // Color secundario para el resto
                }]
            },
            options: {
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                return `${label}: ${value.toFixed(2)}%`;
                            }
                        }
                    }
                }
            }
        });
    });

    // Gráfico general
    new Chart(ctxTotal, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                data: dataPorcentajes,
                backgroundColor: colors
            }]
        },
        options: {
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            return `${label}: ${value.toFixed(2)}%`;
                        }
                    }
                }
            }
        }
    });
};




// Llamar a la función para obtener las huellas al cargar la página
window.onload = getHuellas;
