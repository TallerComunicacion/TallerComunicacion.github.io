// ============================================
// MÓDULO DE PROGRESO - ESTADÍSTICAS Y GRÁFICOS
// ============================================

const STORAGE_KEY = 'quizResults';
let graficoEvolucion = null;

function initializeProgreso() {
    const clearBtn = document.getElementById('clear-data-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', limpiarDatos);
    }
    actualizarEstadisticas();
    console.log('✓ Módulo de Progreso inicializado');
}

/**
 * Guarda el resultado de un quiz en localStorage
 * @param {Object} resultado - { fecha, nivel, puntaje, total }
 */
function guardarResultado(resultado) {
    try {
        // Obtener resultados previos
        let resultados = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        
        // Agregar el nuevo resultado con timestamp
        const nuevoResultado = {
            fecha: new Date().toISOString(),
            nivel: resultado.nivel,
            puntaje: resultado.puntaje,
            total: resultado.total,
            porcentaje: Math.round((resultado.puntaje / resultado.total) * 100)
        };
        
        resultados.push(nuevoResultado);
        
        // Guardar en localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(resultados));
        
        console.log('✓ Resultado guardado:', nuevoResultado);
        return true;
    } catch (error) {
        console.error('✗ Error al guardar resultado:', error);
        return false;
    }
}

/**
 * Obtiene todos los resultados guardados en localStorage
 */
function obtenerResultados() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (error) {
        console.error('✗ Error al obtener resultados:', error);
        return [];
    }
}

/**
 * Calcula y actualiza las estadísticas
 */
function actualizarEstadisticas() {
    const resultados = obtenerResultados();

    if (resultados.length === 0) {
        mostrarSinDatos();
        return;
    }

    // Calcular estadísticas
    const mejorPuntaje = Math.max(...resultados.map(r => r.porcentaje));
    const promedio = Math.round(
        resultados.reduce((sum, r) => sum + r.porcentaje, 0) / resultados.length
    );
    
    // Contar niveles y encontrar el favorito
    const conteoNiveles = {};
    let totalPuntajePorNivel = {};
    
    resultados.forEach(r => {
        conteoNiveles[r.nivel] = (conteoNiveles[r.nivel] || 0) + 1;
        totalPuntajePorNivel[r.nivel] = (totalPuntajePorNivel[r.nivel] || 0) + r.porcentaje;
    });
    
    // Encontrar nivel más jugado (o el que tiene mejor promedio si hay empate)
    let nivelMasJugado = Object.keys(conteoNiveles)[0];
    let maxJugadas = conteoNiveles[nivelMasJugado];
    
    for (const nivel in conteoNiveles) {
        if (conteoNiveles[nivel] > maxJugadas) {
            nivelMasJugado = nivel;
            maxJugadas = conteoNiveles[nivel];
        }
    }

    // Actualizar tarjetas
    const statBestScore = document.getElementById('stat-best-score');
    const statAvgScore = document.getElementById('stat-avg-score');
    const statFavLevel = document.getElementById('stat-fav-level');
    const statTotalQuizzes = document.getElementById('stat-total-quizzes');

    if (statBestScore) statBestScore.textContent = mejorPuntaje + '%';
    if (statAvgScore) statAvgScore.textContent = promedio + '%';
    if (statFavLevel) {
        const textoNivel = nivelMasJugado.charAt(0).toUpperCase() + nivelMasJugado.slice(1);
        statFavLevel.textContent = textoNivel;
    }
    if (statTotalQuizzes) statTotalQuizzes.textContent = resultados.length;

    // Generar gráfico
    generarGraficoEvolucion(resultados);

    console.log('✓ Estadísticas actualizadas:', {
        mejorPuntaje,
        promedio,
        nivelMasJugado,
        totalQuizzes: resultados.length
    });
}

/**
 * Genera un gráfico de evolución usando Chart.js
 */
function generarGraficoEvolucion(resultados) {
    const canvasContainer = document.getElementById('grafico-evolucion');
    if (!canvasContainer || typeof Chart === 'undefined') {
        console.warn('⚠️ Canvas o Chart.js no disponibles');
        return;
    }

    // Asegurarse de que el canvas esté visible
    canvasContainer.style.display = 'block';

    // Ocultar cualquier mensaje de "sin datos" si existe
    const noDataMessageDiv = document.getElementById('chart-no-data-message');
    if (noDataMessageDiv) {
        noDataMessageDiv.style.display = 'none';
    }

    // Destruir gráfico anterior si existe
    if (graficoEvolucion) {
        graficoEvolucion.destroy();
    }

    // Preparar datos: últimos 10 resultados
    const ultimosResultados = resultados.slice(-10);
    const labels = ultimosResultados.map((r, idx) => {
        const fecha = new Date(r.fecha);
        return fecha.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
    });

    const datos = ultimosResultados.map(r => r.porcentaje);

    // Crear gráfico
    const ctx = canvasContainer.getContext('2d');
    graficoEvolucion = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Evolución de Puntaje (%)',
                    data: datos,
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#2563eb',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });

    console.log('✓ Gráfico de evolución generado');
}

/**
 * Muestra un mensaje cuando no hay datos
 */
function mostrarSinDatos() {
    const statBestScore = document.getElementById('stat-best-score');
    const statAvgScore = document.getElementById('stat-avg-score');
    const statFavLevel = document.getElementById('stat-fav-level');
    const statTotalQuizzes = document.getElementById('stat-total-quizzes');

    const sinDatos = '—';

    if (statBestScore) statBestScore.textContent = sinDatos;
    if (statAvgScore) statAvgScore.textContent = sinDatos;
    if (statFavLevel) statFavLevel.textContent = sinDatos;
    if (statTotalQuizzes) statTotalQuizzes.textContent = '0';

    const canvasContainer = document.getElementById('grafico-evolucion');
    if (canvasContainer) {
        canvasContainer.style.display = 'none'; // Ocultar el canvas del gráfico
    }

    // Mostrar un mensaje de "sin datos" en el lugar del gráfico
    const chartCardBody = canvasContainer?.closest('.card-body');
    let noDataMessageDiv = document.getElementById('chart-no-data-message');

    if (!noDataMessageDiv && chartCardBody) {
        noDataMessageDiv = document.createElement('div');
        noDataMessageDiv.id = 'chart-no-data-message';
        noDataMessageDiv.className = 'text-center text-muted mt-4'; // Añadir un margen superior
        noDataMessageDiv.innerHTML = '<p>📝 Realiza quizzes en la sección <strong>Evaluación</strong> para ver tu evolución aquí.</p>';
        
        // Insertar el mensaje antes del canvas, o al final del body de la tarjeta si el canvas no se encuentra (fallback)
        if (canvasContainer && canvasContainer.parentNode) {
            canvasContainer.parentNode.insertBefore(noDataMessageDiv, canvasContainer);
        } else {
            chartCardBody.appendChild(noDataMessageDiv);
        }
    } else if (noDataMessageDiv) {
        noDataMessageDiv.style.display = 'block'; // Asegurarse de que el mensaje es visible si ya existe
    }
    
    console.log('✓ Sin datos - Se espera que el usuario realice quizzes');
}

/**
 * Limpia todos los datos de progreso
 */
function limpiarDatos() {
    if (confirm('¿Estás seguro de que deseas eliminar todo tu historial de progreso? Esta acción no se puede deshacer.')) {
        localStorage.removeItem(STORAGE_KEY);
        actualizarEstadisticas();
        alert('✓ Datos de progreso eliminados correctamente.');
        console.log('✓ Datos limpiados');
    }
}
