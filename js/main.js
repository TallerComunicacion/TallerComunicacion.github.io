// ============================================
// BASE DE DATOS DE PREGUNTAS - SIGNOS DE PUNTUACIÓN
// ============================================

let baseDatos = {};

// Cargar preguntas: se cargan desde window.PREGUNTAS_GLOBALES (js/questions.js)
async function cargarPreguntas() {
    try {
        // Las preguntas están embebidas en js/questions.js como window.PREGUNTAS_GLOBALES
        if (typeof window.PREGUNTAS_GLOBALES !== 'undefined' && window.PREGUNTAS_GLOBALES) {
            baseDatos = window.PREGUNTAS_GLOBALES;
            console.log('✓ Preguntas cargadas correctamente desde js/questions.js');
            console.log(`  - Básico: ${baseDatos.basico?.length || 0} preguntas`);
            console.log(`  - Intermedio: ${baseDatos.intermedio?.length || 0} preguntas`);
            console.log(`  - Avanzado: ${baseDatos.avanzado?.length || 0} preguntas`);
            return;
        }

        // Si no existe la variable global (no debería ocurrir), mostrar error
        throw new Error('window.PREGUNTAS_GLOBALES no está definida. Verifica que js/questions.js se cargue correctamente.');
    } catch (error) {
        console.error('✗ Error cargando preguntas:', error);
        baseDatos = { basico: [], intermedio: [], avanzado: [] };
    }
}


// ============================================
// SISTEMA DE ESTADÍSTICAS Y GAMIFICACIÓN
// ============================================

class GameStats {
    constructor() {
        this.reset();
    }

    reset() {
        this.preguntasRespondidas = 0;
        this.aciertos = 0;
        this.errores = 0;
        this.racha = 0;
        this.mejorRacha = 0;
        this.tiempoInicio = null;
    }

    registrarRespuesta(correcta) {
        this.preguntasRespondidas++;
        if (correcta) {
            this.aciertos++;
            this.racha++;
            if (this.racha > this.mejorRacha) {
                this.mejorRacha = this.racha;
            }
        } else {
            this.errores++;
            this.racha = 0;
        }
    }

    obtenerPorcentaje() {
        if (this.preguntasRespondidas === 0) return 0;
        return Math.round((this.aciertos / this.preguntasRespondidas) * 100);
    }

    obtenerCalificacion() {
        const porcentaje = this.obtenerPorcentaje();
        if (porcentaje === 100) return { emoji: '🏆', titulo: '¡Perfección absoluta!', mensaje: 'Eres un maestro de la puntuación.' };
        if (porcentaje >= 90) return { emoji: '🎉', titulo: '¡Excelente!', mensaje: 'Demuestras dominio de los signos de puntuación.' };
        if (porcentaje >= 80) return { emoji: '😊', titulo: '¡Muy bien!', mensaje: 'Buen desempeño en la prueba.' };
        if (porcentaje >= 70) return { emoji: '👍', titulo: 'Bien', mensaje: 'Vas en el camino correcto.' };
        if (porcentaje >= 60) return { emoji: '📚', titulo: 'Aceptable', mensaje: 'Necesitas practicar más.' };
        return { emoji: '💪', titulo: 'Sigue intentando', mensaje: 'No desistas, la práctica es la clave.' };
    }
}

// ============================================
// CONTROLADOR PRINCIPAL DEL JUEGO
// ============================================

class GameController {
    constructor() {
        this.nivelActual = null; // require user selection
        this.preguntas = [];
        this.indicePreguntaActual = 0;
        this.stats = new GameStats();
        this.inicializarElementos();
        this.asignarEventos();
        // Ensure no element is focused when the app loads (prevents default focus on buttons)
        // run in next tick to avoid interfering with initialization
        setTimeout(() => {
            if (document.activeElement && typeof document.activeElement.blur === 'function') {
                document.activeElement.blur();
            }
        }, 0);
    }

    inicializarElementos() {
        this.screens = {
            start: document.getElementById('quiz-start-screen'),
            game: document.getElementById('quiz-game-screen'),
            result: document.getElementById('quiz-result-screen')
        };

        this.elementos = {
            questionText: document.getElementById('question-text'),
            questionType: document.getElementById('question-type'),
            optionsContainer: document.getElementById('options-container'),
            feedback: document.getElementById('feedback'),
            currentQuestion: document.getElementById('current-question'),
            currentScore: document.getElementById('current-score'),
            streak: document.getElementById('streak'),
            progressFill: document.getElementById('progress-fill'),
            progressText: document.getElementById('progress-text'),
            scoreFinal: document.getElementById('score-final'),
            percentageFinal: document.getElementById('percentage-final'),
            bestStreak: document.getElementById('best-streak'),
            resultTitle: document.getElementById('result-title'),
            resultEmoji: document.getElementById('result-emoji'),
            mensajeFinal: document.getElementById('mensaje-final')
        };

        this.levelButtons = document.querySelectorAll('.level-btn');
        // UI controls on start screen
        this.startButton = document.getElementById('quiz-start-btn');
        // Bind click to global iniciarJuego if present
        if (this.startButton) {
            this.startButton.addEventListener('click', () => iniciarJuego());
        }
        this.soundToggleBtnStart = document.getElementById('sound-toggle-btn-start');
        this.soundToggleBtn = document.getElementById('sound-toggle-btn');
        this.autoAdvanceBtn = document.getElementById('auto-advance-btn');
        this.continueBtn = document.getElementById('continue-btn');
        this.autoAdvMsg = document.getElementById('auto-adv-msg');
        // default: auto-advance enabled
        this.autoAdvanceEnabled = true;
    }

    asignarEventos() {
        this.levelButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.seleccionarNivel(e));
        });

        // Start button should be disabled until a level is chosen
        if (this.startButton) this.startButton.disabled = true;

        // Sound toggle on start screen
        if (this.soundToggleBtnStart) {
            try {
                this._updateSoundToggleUI(!!soundManager.soundsEnabled, this.soundToggleBtnStart);
            } catch (e) {
                // ignore if soundManager not ready
            }
            this.soundToggleBtnStart.addEventListener('click', () => {
                const enabled = soundManager.toggleSound();
                this._updateSoundToggleUI(!!enabled, this.soundToggleBtnStart);
                this._updateSoundToggleUI(!!enabled, this.soundToggleBtn);
                // play a small click when enabling
                if (enabled) soundManager.playSound('buttonClick');
            });
        }

        // Initialize persistent game screen sound button and bind event
        if (this.soundToggleBtn) {
            try {
                this._updateSoundToggleUI(!!soundManager.soundsEnabled, this.soundToggleBtn);
            } catch (e) {
                // ignore if soundManager not ready
            }
            this.soundToggleBtn.addEventListener('click', () => {
                const enabled = soundManager.toggleSound();
                this._updateSoundToggleUI(!!enabled, this.soundToggleBtn);
                this._updateSoundToggleUI(!!enabled, this.soundToggleBtnStart);
                // play a small click when enabling
                if (enabled) soundManager.playSound('buttonClick');
            });
        }

        // Auto-advance toggle button
        if (this.autoAdvanceBtn) {
            // initial UI
            this.autoAdvanceBtn.classList.toggle('active', !!this.autoAdvanceEnabled);
            this.autoAdvanceBtn.setAttribute('aria-pressed', this.autoAdvanceEnabled ? 'true' : 'false');
            this.autoAdvMsg && this.autoAdvMsg.classList.toggle('d-none', !this.autoAdvanceEnabled);
            this.autoAdvanceBtn.addEventListener('click', () => {
                this.autoAdvanceEnabled = !this.autoAdvanceEnabled;
                this.autoAdvanceBtn.classList.toggle('active', !!this.autoAdvanceEnabled);
                this.autoAdvanceBtn.setAttribute('aria-pressed', this.autoAdvanceEnabled ? 'true' : 'false');
                // show helper message when enabled
                if (this.autoAdvMsg) {
                    if (this.autoAdvanceEnabled) {
                        this.autoAdvMsg.classList.remove('d-none');
                    } else {
                        this.autoAdvMsg.classList.add('d-none');
                    }
                }
            });
        }

        // Continue button (manual advance)
        if (this.continueBtn) {
            this.continueBtn.addEventListener('click', () => {
                // hide continue button and advance to next
                this.continueBtn.classList.add('d-none');
                const preFeedback = document.getElementById('feedback');
                preFeedback && preFeedback.classList.add('hidden');
                this._advanceToNext();
            });
        }
    }

    seleccionarNivel(event) {
        const btn = event.currentTarget;
        this.levelButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.nivelActual = btn.dataset.level;
        // enable start button when a level is selected
        if (this.startButton) this.startButton.disabled = false;
        soundManager.playSound('buttonClick');
    }

    iniciarJuego() {
        this.preguntas = this.obtenerPreguntasAleatorias();
        this.stats.reset();
        this.indicePreguntaActual = 0;
        this.stats.tiempoInicio = Date.now();
        this.cambiarPantalla('game');
        soundManager.playSound('levelStart');
        // Ensure UI reflects auto-advance state
        if (this.autoAdvMsg) this.autoAdvMsg.classList.toggle('d-none', !this.autoAdvanceEnabled);
        if (this.continueBtn) this.continueBtn.classList.add('d-none');
        this.mostrarPregunta();
    }

    obtenerPreguntasAleatorias() {
        const preguntasNivel = baseDatos[this.nivelActual];
        // Aleatorizar preguntas
        const preguntasAleatorias = preguntasNivel.sort(() => Math.random() - 0.5);
        // Aleatorizar también las opciones de cada pregunta y ajustar índice de respuesta correcta
        return preguntasAleatorias.map(pregunta => {
            const opcionesConIndice = pregunta.opciones.map((opcion, index) => ({
                texto: opcion,
                indiceOriginal: index
            }));
            // Mezclar opciones
            opcionesConIndice.sort(() => Math.random() - 0.5);
            // Encontrar nuevo índice de la respuesta correcta
            const nuevoIndiceCorrecta = opcionesConIndice.findIndex(o => o.indiceOriginal === pregunta.correcta);
            // Devolver pregunta con opciones desordenadas y nuevo índice correcto
            return {
                ...pregunta,
                opciones: opcionesConIndice.map(o => o.texto),
                correcta: nuevoIndiceCorrecta
            };
        });
    }

    mostrarPregunta() {
        const pregunta = this.preguntas[this.indicePreguntaActual];
        
        // Actualizar información
        this.elementos.currentQuestion.textContent = this.indicePreguntaActual + 1;
        this.elementos.currentScore.textContent = this.stats.aciertos;
        this.elementos.streak.textContent = this.stats.racha;
        
        // Actualizar barra de progreso
        const porcentaje = ((this.indicePreguntaActual) / this.preguntas.length) * 100;
        this.elementos.progressFill.style.width = `${porcentaje}%`;
        this.elementos.progressText.textContent = `${Math.round(porcentaje)}%`;

        // Actualizar pregunta
        this.elementos.questionText.textContent = pregunta.pregunta;
        this.elementos.questionType.textContent = '✍️ ' + pregunta.tipo;
        
    // Limpiar opciones anteriores y asegurarse de ocultar/limpiar el feedback
    this.elementos.optionsContainer.innerHTML = '';
    // Normalizar el estado del feedback: oculto y sin texto
    this.elementos.feedback.className = 'feedback-msg hidden';
    const feedbackResult = document.getElementById('feedback-result');
    const feedbackExplanation = document.getElementById('feedback-explanation');
    feedbackResult.textContent = '';
    feedbackExplanation.textContent = '';
    feedbackExplanation.classList.add('hidden');

        // Generar opciones
        // Asegurar al menos 4 opciones (si el banco tiene 3, añadimos una opción neutra al final)
        const opciones = Array.isArray(pregunta.opciones) ? pregunta.opciones.slice() : [];
        if (opciones.length < 4) opciones.push('Ninguna de las anteriores');
        const letras = ['A', 'B', 'C', 'D'];
        // hide manual continue when a new question is shown
        if (this.continueBtn) this.continueBtn.classList.add('d-none');
        opciones.forEach((opcion, index) => {
            const boton = document.createElement('button');
            boton.className = 'option-btn';
            boton.textContent = `${letras[index]}. ${opcion}`;
            boton.onclick = () => this.seleccionarRespuesta(index, boton, pregunta);
            this.elementos.optionsContainer.appendChild(boton);
        });
    }

    _advanceToNext() {
        this.indicePreguntaActual++;
        if (this.indicePreguntaActual < this.preguntas.length) {
            this.mostrarPregunta();
        } else {
            this.finalizarJuego();
        }
    }

    seleccionarRespuesta(indiceSeleccionado, boton, pregunta) {
        const botones = this.elementos.optionsContainer.querySelectorAll('button');
        botones.forEach(btn => btn.disabled = true);

        const esCorrecta = indiceSeleccionado === pregunta.correcta;
        this.stats.registrarRespuesta(esCorrecta);

        // Mostrar resultado
        const feedbackResult = document.getElementById('feedback-result');
        const feedbackExplanation = document.getElementById('feedback-explanation');
        
        if (esCorrecta) {
            boton.classList.add('correct');
            this.elementos.feedback.className = 'feedback-msg correct';
            feedbackResult.textContent = '✅ ¡Correcto!';
            soundManager.playSound('success');
        } else {
            boton.classList.add('incorrect');
            botones[pregunta.correcta].classList.add('correct');
            this.elementos.feedback.className = 'feedback-msg incorrect';
            feedbackResult.textContent = '❌ Respuesta incorrecta';
            soundManager.playSound('error');
        }

        // Mostrar explicación
        feedbackExplanation.textContent = '📝 ' + pregunta.explicacion;
        feedbackExplanation.classList.remove('hidden');
        this.elementos.feedback.classList.remove('hidden');

        // Si auto-advance está activado, avanzar automáticamente tras 3.5s
        if (this.autoAdvanceEnabled) {
            setTimeout(() => this._advanceToNext(), 3500);
        } else {
            // Mostrar botón CONTINUAR para control manual
            if (this.continueBtn) this.continueBtn.classList.remove('d-none');
        }
    }

    finalizarJuego() {
        const calificacion = this.stats.obtenerCalificacion();
        
        this.elementos.resultEmoji.textContent = calificacion.emoji;
        this.elementos.resultTitle.textContent = calificacion.titulo;
        this.elementos.mensajeFinal.textContent = calificacion.mensaje;
        
        this.elementos.scoreFinal.textContent = `${this.stats.aciertos} / ${this.preguntas.length}`;
        this.elementos.percentageFinal.textContent = `${this.stats.obtenerPorcentaje()}%`;
        this.elementos.bestStreak.textContent = this.stats.mejorRacha;

        // Guardar resultado en localStorage (para el módulo de Progreso)
        if (typeof guardarResultado === 'function') {
            guardarResultado({
                nivel: this.nivelActual,
                puntaje: this.stats.aciertos,
                total: this.preguntas.length
            });
        }

        soundManager.playSound('finish');
        this.cambiarPantalla('result');
    }

    cambiarPantalla(pantalla) {
        Object.values(this.screens).forEach(screen => screen.classList.remove('active'));
        this.screens[pantalla].classList.add('active');
        
        // Show/hide start screen controls based on current screen
        const startScreenControls = document.getElementById('start-screen-controls');
        if (startScreenControls) {
            if (pantalla === 'start') {
                startScreenControls.style.display = 'flex';
            } else {
                startScreenControls.style.display = 'none';
            }
        }
    }

    _updateSoundToggleUI(enabled, button) {
        const btn = button || this.soundToggleBtn;
        if (!btn) return;
        if (enabled) {
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
            btn.innerHTML = '&#128266;'; // speaker with sound waves
        } else {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
            btn.innerHTML = '&#128263;'; // muted speaker
        }
    }

    reiniciar() {
        this.iniciarJuego();
    }

    salir() {
        this.cambiarPantalla('start');
    }

    volverInicio() {
        this.levelButtons.forEach(btn => btn.classList.remove('active'));
        // Clear selection and require user to choose level again
        this.nivelActual = null;
        if (this.startButton) this.startButton.disabled = true;
        this.cambiarPantalla('start');
    }
}

// ============================================
// INICIALIZACIÓN
// ============================================

let game;

// Initialize game controller after questions are loaded (called from index.html)
async function initializeGame() {
    if (Object.keys(baseDatos).length === 0) {
        console.warn('⚠ Preguntas aún no cargadas, esperando...');
        return false;
    }
    game = new GameController();
    return true;
}

// Funciones globales para el HTML
function iniciarJuego() {
    soundManager.playSound('buttonClick');
    setTimeout(() => game.iniciarJuego(), 100);
}

function reiniciarJuego() {
    soundManager.playSound('buttonClick');
    setTimeout(() => game.reiniciar(), 100);
}

function salirJuego() {
    soundManager.playSound('buttonClick');
    game.salir();
}

function volverInicio() {
    soundManager.playSound('buttonClick');
    game.volverInicio();
}

/**
 * Resetea la pantalla de evaluación al estado inicial
 * Se llama cuando el usuario navega a la pantalla de evaluación desde el navbar
 */
function resetearEvaluacion() {
    if (game) {
        game.volverInicio();
    }
}
