// ============================================
// NAVEGACIÓN DE LA SUITE - CONTROL DE PANTALLAS
// ============================================

/**
 * Muestra la pantalla solicitada ocultando las demás
 * @param {string} pantalla - ID de la pantalla a mostrar
 */
function mostrarPantalla(pantalla) {
    // Evitar recarga de página y propagar el evento
    event?.preventDefault();

    // Obtener todas las pantallas
    const pantallas = document.querySelectorAll('.pantalla');
    
    // Ocultar todas las pantallas
    pantallas.forEach(p => {
        p.classList.remove('active');
    });

    // Mostrar la pantalla solicitada
    const pantallaSolicitada = document.getElementById('pantalla-' + pantalla);
    if (pantallaSolicitada) {
        pantallaSolicitada.classList.add('active');
        console.log(`✓ Pantalla mostrada: ${pantalla}`);
        
        // Actualizar datos específicos cuando se abre Progreso
        if (pantalla === 'progreso' && typeof actualizarEstadisticas === 'function') {
            actualizarEstadisticas();
            console.log('✓ Estadísticas actualizadas');
        }
    } else {
        console.error(`✗ Pantalla no encontrada: pantalla-${pantalla}`);
    }

    // Scroll al inicio
    window.scrollTo(0, 0);
}

// Escuchar clics en los enlaces del navbar
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.navbar-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // Extraer el ID de la pantalla del href (ej: onclick="mostrarPantalla('biblioteca')")
            const href = link.getAttribute('href');
            // Ya se maneja con onclick, pero este listener añade seguridad
        });
    });
});
