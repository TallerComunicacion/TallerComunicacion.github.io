// ============================================
// MÓDULO DE PRÁCTICA - DRAG & DROP (Desktop + Mobile)
// ============================================

let draggedElement = null;
let practiceResults = {};
let touchStartX = 0;
let touchStartY = 0;
let currentTouchElement = null;
let ghostElement = null; // Para el "ghost image" en móvil

let lastAutoScrollTime = 0; // Control para evitar scroll conflictivo
function initializePractica() {
    const draggables = document.querySelectorAll('.signo-draggable');
    const dropZones = document.querySelectorAll('.drop-zone');
    
    // ========== EVENTOS DE DESKTOP (Drag & Drop) ==========
    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', handleDragStart);
        draggable.addEventListener('dragend', handleDragEnd);
        
        // Feedback visual al pasar el mouse
        draggable.addEventListener('mouseenter', function() {
            this.classList.add('signo-hover');
        });
        draggable.addEventListener('mouseleave', function() {
            this.classList.remove('signo-hover');
        });
        
        // ========== EVENTOS DE MÓVIL (Touch) ==========
        draggable.addEventListener('touchstart', handleTouchStart, false);
        draggable.addEventListener('touchmove', handleTouchMove, false);
        draggable.addEventListener('touchend', handleTouchEnd, false);
    });

    // Configurar zonas de soltar para desktop
    dropZones.forEach((zone, index) => {
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('drop', handleDrop);
        zone.addEventListener('dragleave', handleDragLeave);
        zone.id = `drop-zone-${index}`; // Asignar ID único si no lo tiene
    });

    // ========== AUTO-SCROLL EN DESKTOP DURANTE DRAG ==========
    // Escuchar dragover global para auto-scroll
    document.addEventListener('dragover', function(e) {
        const viewportHeight = window.innerHeight;
        const scrollThreshold = 100; // Píxeles desde el borde
        const scrollSpeed = 3; // Velocidad de scroll
        
        // Si el mouse está cerca del borde inferior
        if (e.clientY > viewportHeight - scrollThreshold) {
            window.scrollBy(0, scrollSpeed);
        }
        // Si el mouse está cerca del borde superior
        else if (e.clientY < scrollThreshold) {
            window.scrollBy(0, -scrollSpeed);
        }
    }, false);

    // Botones de acción
    const verifyBtn = document.getElementById('verify-btn');
    const resetBtn = document.getElementById('reset-btn');

    if (verifyBtn) {
        verifyBtn.addEventListener('click', verificarPractica);
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', reiniciarPractica);
    }

    console.log('✓ Módulo de Práctica inicializado (Desktop + Mobile)');
}

// ========== HANDLERS DE DESKTOP (DRAG & DROP) ==========

function handleDragStart(e) {
    draggedElement = this;
    
    // Efecto visual de arrastre
    this.classList.add('dragging');
    this.style.opacity = '0.5';
    
    // Mostrar cursor de arrastre
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
    
    // Resaltar TODAS las zonas de soltar (incluyendo las ocupadas)
    document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.classList.add('ready-to-drop');
    });
    
    console.log(`🎯 Arrastrando (Desktop): ${this.getAttribute('data-signo')}`);
}

function handleDragEnd(e) {
    if (draggedElement) {
        draggedElement.classList.remove('dragging');
        draggedElement.style.opacity = '1';
    }
    
    // Remover resaltado de zonas de soltar
    document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.classList.remove('drag-over', 'ready-to-drop');
    });
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    // Permitir drop en TODAS las zonas (vacías u ocupadas)
    this.classList.add('drag-over');
    
    return false;
}

function handleDragLeave(e) {
    if (e.target === this) {
        this.classList.remove('drag-over');
    }
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    
    // Permitir drop en TODAS las zonas (incluyendo las que ya tienen signo)
    if (draggedElement) {
        colocarSigno(draggedElement, this);
    }

    return false;
}

// ========== HANDLERS DE MÓVIL (TOUCH) ==========

function handleTouchStart(e) {
    currentTouchElement = this;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    
    // Efecto visual similar al drag (SIN escala)
    this.classList.add('dragging-touch');
    
    // ========== CREAR GHOST ELEMENT (copia tenue) ==========
    // Clonar el elemento para crear un "fantasma" que siga el dedo
    ghostElement = this.cloneNode(true);
    ghostElement.classList.add('ghost-dragging');
    ghostElement.style.position = 'fixed';
    ghostElement.style.pointerEvents = 'none';
    ghostElement.style.zIndex = '10000';
    ghostElement.style.opacity = '0.6';
    ghostElement.style.left = touchStartX + 'px';
    ghostElement.style.top = touchStartY + 'px';
    ghostElement.style.transform = 'translate(-50%, -50%)'; // Centrar en el dedo
    document.body.appendChild(ghostElement);
    
    // Resaltar TODAS las zonas de soltar (incluyendo las ocupadas)
    document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.classList.add('ready-to-drop');
    });
    
    console.log(`🎯 Tocando (Mobile): ${this.getAttribute('data-signo')}`);
}

function handleTouchMove(e) {
    if (!currentTouchElement) return;
    
    // NO prevenir default - permitir scroll
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    
    // ========== ACTUALIZAR POSICIÓN DEL GHOST ELEMENT ==========
    if (ghostElement) {
        ghostElement.style.left = touchX + 'px';
        ghostElement.style.top = touchY + 'px';
    }
    
    // Encontrar el elemento bajo el dedo
    const elementBelow = document.elementFromPoint(touchX, touchY);
    
    // Remover clase drag-over de todas las zonas
    document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.classList.remove('drag-over');
    });
    
    // Si el elemento es una zona de soltar, resaltarla (incluso si ya tiene signo)
    if (elementBelow && elementBelow.classList.contains('drop-zone')) {
        elementBelow.classList.add('drag-over');
    }
    // Auto-scroll deshabilitado en móvil para evitar conflictos con el scroll
    // durante el arrastre táctil. El usuario puede desplazar la página manualmente
    // mientras arrastra el signo.
}

function handleTouchEnd(e) {
    if (!currentTouchElement) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    // ========== REMOVER GHOST ELEMENT ==========
    if (ghostElement) {
        ghostElement.remove();
        ghostElement = null;
    }
    
    // Encontrar el elemento donde se levantó el dedo
    const elementBelow = document.elementFromPoint(touchEndX, touchEndY);
    
    // Remover estilos de arrastre
    currentTouchElement.classList.remove('dragging-touch');
    currentTouchElement.classList.remove('dragging');
    
    // Remover resaltado de zonas de soltar
    document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.classList.remove('drag-over', 'ready-to-drop');
    });
    
    // Si el elemento es una zona de soltar válida, colocar el signo
    if (elementBelow && elementBelow.classList.contains('drop-zone')) {
        colocarSigno(currentTouchElement, elementBelow);
    }
    
    currentTouchElement = null;
}

// ========== FUNCIÓN COMPARTIDA PARA COLOCAR SIGNO ==========

function colocarSigno(sourceElement, targetZone) {
    const signo = sourceElement.getAttribute('data-signo');
    const correctSigno = targetZone.getAttribute('data-correct');
    const zoneId = targetZone.id;
    
    // Guardar el resultado
    practiceResults[zoneId] = {
        correct: correctSigno,
        placed: signo,
        isCorrect: signo === correctSigno
    };

    // Mostrar el signo colocado con animación
    targetZone.textContent = signo;
    targetZone.classList.remove('drag-over', 'ready-to-drop');
    targetZone.classList.add('signo-colocado');
    targetZone.style.cursor = 'default';
    
    // Animación de entrada
    targetZone.style.animation = 'none';
    setTimeout(() => {
        targetZone.style.animation = 'dropAnimation 0.3s ease-out';
    }, 10);
    
    console.log(`✓ Signo colocado: ${signo} en zona ${zoneId}`);
}

function verificarPractica() {
    const dropZones = document.querySelectorAll('.drop-zone');
    let correctCount = 0;
    let totalCount = dropZones.length;

    dropZones.forEach(zone => {
        const correctSigno = zone.getAttribute('data-correct');
        const placedSigno = zone.textContent.trim();

        if (placedSigno && placedSigno !== '____') {
            if (placedSigno === correctSigno) {
                zone.style.backgroundColor = '#d4edda';
                zone.style.color = '#155724';
                zone.style.borderColor = '#10b981';
                zone.classList.add('correct-answer');
                correctCount++;
            } else {
                zone.style.backgroundColor = '#f8d7da';
                zone.style.color = '#721c24';
                zone.style.borderColor = '#ef4444';
                zone.classList.add('incorrect-answer');
            }
            zone.style.fontWeight = 'bold';
            zone.style.padding = '4px 8px';
            zone.style.borderRadius = '4px';
            zone.style.borderWidth = '2px';
            zone.style.borderStyle = 'solid';
        } else {
            zone.style.backgroundColor = '#fff3cd';
            zone.style.color = '#856404';
            zone.style.borderColor = '#ffc107';
            zone.classList.add('empty-answer');
            zone.style.fontWeight = 'bold';
            zone.style.padding = '4px 8px';
            zone.style.borderRadius = '4px';
            zone.style.borderWidth = '2px';
            zone.style.borderStyle = 'solid';
        }
    });

    // Mostrar retroalimentación
    const feedbackDiv = document.getElementById('feedback-practica');
    const percentage = Math.round((correctCount / totalCount) * 100);

    if (percentage === 100) {
        feedbackDiv.innerHTML = `
            <div class="alert-success">
                <h5>🎉 ¡Excelente!</h5>
                <p>Completaste correctamente todas las oraciones. ¡Eres un maestro de la puntuación!</p>
            </div>
        `;
        feedbackDiv.classList.remove('alert-warning', 'alert-danger', 'd-none');
        feedbackDiv.classList.add('alert', 'alert-success');
    } else if (percentage >= 75) {
        feedbackDiv.innerHTML = `
            <div class="alert-warning">
                <h5>✓ ¡Muy bien!</h5>
                <p>Acertaste <strong>${correctCount}</strong> de <strong>${totalCount}</strong> espacios (<strong>${percentage}%</strong>). ¡Casi perfecto!</p>
            </div>
        `;
        feedbackDiv.classList.remove('alert-danger', 'd-none');
        feedbackDiv.classList.add('alert', 'alert-success', 'alert-warning');
    } else if (percentage >= 50) {
        feedbackDiv.innerHTML = `
            <div class="alert-info">
                <h5>📚 Buen intento</h5>
                <p>Acertaste <strong>${correctCount}</strong> de <strong>${totalCount}</strong> espacios (<strong>${percentage}%</strong>). Sigue practicando, ¡lo harás mejor!</p>
            </div>
        `;
        feedbackDiv.classList.remove('alert-success', 'alert-danger', 'd-none');
        feedbackDiv.classList.add('alert', 'alert-info');
    } else {
        feedbackDiv.innerHTML = `
            <div class="alert-danger">
                <h5>⚠️ Revisa tu respuesta</h5>
                <p>Acertaste <strong>${correctCount}</strong> de <strong>${totalCount}</strong> espacios (<strong>${percentage}%</strong>). Te recomendamos revisar la Biblioteca y luego intentar nuevamente.</p>
            </div>
        `;
        feedbackDiv.classList.remove('alert-success', 'alert-info', 'd-none');
        feedbackDiv.classList.add('alert', 'alert-danger');
    }

    feedbackDiv.classList.remove('d-none');
    
    // Scroll al feedback
    setTimeout(() => {
        feedbackDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

function reiniciarPractica() {
    // Limpiar los drop zones con animación
    document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.style.animation = 'resetAnimation 0.3s ease-out';
        setTimeout(() => {
            zone.textContent = '____';
            zone.style.backgroundColor = '';
            zone.style.color = '';
            zone.style.fontWeight = '';
            zone.style.cursor = '';
            zone.style.padding = '';
            zone.style.borderRadius = '';
            zone.style.borderWidth = '';
            zone.style.borderStyle = '';
            zone.style.borderColor = '';
            zone.classList.remove('signo-colocado', 'correct-answer', 'incorrect-answer', 'empty-answer');
            zone.style.animation = '';
        }, 300);
    });

    // Limpiar retroalimentación
    const feedbackDiv = document.getElementById('feedback-practica');
    feedbackDiv.classList.add('d-none');
    feedbackDiv.innerHTML = '';

    // Resetear resultados
    practiceResults = {};

    console.log('✓ Práctica reiniciada');
}

