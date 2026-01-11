# 🎓 Maestro de Puntuación

Una aplicación web interactiva para mejorar tu dominio de los **signos de puntuación** en español mediante un sistema de preguntas con múltiples niveles de dificultad.

**Versión**: 2.0 - Mejorada con Bootstrap 5, Google Fonts y Efectos Sonoros 🚀

---

## 📖 Navegación de Documentación

| Documento | Propósito | Para Quién |
|-----------|-----------|-----------|
| **[README.md](#)** (este archivo) | 📖 Visión general y características | Todos |
| **[GUIA_RAPIDA.md](GUIA_RAPIDA.md)** | ⚡ Agregar una pregunta en 6 pasos | Editores de contenido |
| **[PREGUNTAS.md](PREGUNTAS.md)** | 📚 Guía técnica del JSON (estructura, validación, errores) | Desarrolladores |

---

## 🎁 Novedades en v2.0

| Mejora | Descripción | Impacto |
|--------|-------------|--------|
| **Bootstrap 5** | Framework CSS moderno integrado | Diseño profesional y componentes predefinidos |
| **Google Fonts** | Tipografías Poppins (títulos) y Roboto (cuerpo) | Mejor legibilidad y apariencia premium |
| **Web Audio API** | 5 tipos de efectos sonoros sintetizados | Experiencia más inmersiva y entretenida |
| **Mejores animaciones** | Transiciones suaves con Bootstrap | UI más responsiva y pulida |
| **Mejor responsividad** | Grid system de Bootstrap | Funciona perfecto en móvil, tablet y desktop |

---

## ✨ Características

### 🎮 Sistema de Juego Avanzado
- **3 Niveles de Dificultad**: Básico (5), Intermedio (10) y Avanzado (15) preguntas
- **Enfoque especializado en Signos de Puntuación**:
  - **Tipos de Punto**: Seguido, Aparte, Final
  - **Tipos de Coma** (según RAE):
    - Vocativa (al dirigirse a alguien)
    - Explicativa (aclaraciones)
    - Enumerativa (listas)
    - Hiperbática (orden inverso)
    - Elíptica (omisión de verbo)
    - Hiperbólica (expresiones expansivas)
    - Conectores
  - **Punto y Coma** (;)
  - **Dos Puntos** (:)
  - **Interrogación** (¿?)
  - **Exclamación** (¡!)

### 📊 Estadísticas y Gamificación
- **Panel de Información en Tiempo Real**:
  - Número de pregunta actual
  - Aciertos acumulados
  - Racha actual
  - Barra de progreso visual
  
- **Pantalla de Resultados**:
  - Puntaje final
  - Porcentaje de aciertos
  - Mejor racha registrada
  - Calificación con emoji y mensaje personalizado

### 🎨 Diseño y Tipografía Premium
- **Bootstrap 5**: Framework CSS moderno y responsive
- **Google Fonts**: 
  - **Poppins** (títulos): Tipografía moderna y amigable
  - **Roboto** (cuerpo): Legibilidad óptima
- Paleta de colores limpia (azul, gris y blanco)
- Animaciones suaves y profesionales
- **100% responsivo** en móvil, tablet y desktop

### 🔊 Efectos Sonoros Interactivos
- **Web Audio API**: Sonidos sintetizados en tiempo real (sin archivos externos)
- **Múltiples efectos**:
  - ✅ Sonido de acierto (tono ascendente)
  - ❌ Sonido de error (tono descendente)
  - 🎮 Sonido de inicio de nivel (arpeggio)
  - 🎵 Sonido de finalización (acorde triunfante)
  - 🔘 Click de botones
- Control de volumen: Los sonidos se pueden activar/desactivar

---

## 📁 Estructura del Proyecto

```
Software 1/
├── index.html                 # Estructura HTML con Bootstrap
├── css/
│   └── styles.css            # Estilos personalizados + Bootstrap
├── js/
│   ├── main.js               # Lógica del juego (GameController, GameStats)
│   ├── sounds.js             # Sistema de efectos sonoros (Web Audio API)
│   └── calculo.js            # Archivo auxiliar (vacío)
├── assets/
│   └── data/
│       └── questions.json    # Base de datos de preguntas (27 preguntas)
│   └── sounds/               # Directorio para sonidos (no usado, se sintetizan)
└── README.md                 # Este archivo
```

---

## 🔧 Tecnología Utilizada

- **HTML5**: Estructura semántica
- **CSS3**: Diseño responsivo con grid y flexbox
- **Bootstrap 5**: Framework CSS para componentes y utilities
- **Google Fonts**: Tipografías Poppins y Roboto
- **JavaScript Vanilla (ES6+)**: Lógica POO con clases
- **Web Audio API**: Efectos sonoros sintetizados en tiempo real

---

## 📝 Base de Datos de Preguntas

La aplicación contiene **30 preguntas** distribuidas en tres niveles, todas enfocadas en signos de puntuación según estándares RAE.

### Básico (5 preguntas)
- Tipos básicos de punto (seguido, aparte, final)
- Uso de coma vocativa
- Coma explicativa
- Coma enumerativa
- Coma hiperbática

### Intermedio (10 preguntas)
- Punto y coma en enumeraciones complejas
- Dos puntos en listados
- Uso combinado de comas
- Coma elíptica
- Coma hiperbólica
- Conectores con coma
- Combinaciones de signos
- Puntuación compleja

### Avanzado (15 preguntas)
- Diferencias entre tipos de puntos
- Coma vocativa (posición correcta)
- Coma explicativa (aposiciones)
- Coma enumerativa (listas)
- Coma hiperbática (orden inverso)
- Coma elíptica (omisión de verbo)
- Coma hiperbólica (expresiones expansivas)
- Conectores y sus puntuaciones
- Puntuación general en contextos complejos
- Errores comunes y correcciones
- Puntuación con vocativos
- Punto seguido vs punto aparte
- Texto con todos los tipos de punto
- Casos especiales según RAE

---

## 🎯 Cómo Usar

1. **Abre** el archivo `index.html` en tu navegador
2. **Selecciona** el nivel de dificultad (Básico, Intermedio o Avanzado)
3. **Haz clic** en "Comenzar Test"
4. **Responde** las preguntas seleccionando una opción
5. **Observa** tu progreso en el panel de información
6. **Revisa** tus resultados al finalizar

---

## 🏆 Sistema de Calificación

| Porcentaje | Calificación | Emoji |
|------------|-------------|-------|
| 100% | Perfección Absoluta | 🏆 |
| 90-99% | Excelente | 🎉 |
| 80-89% | Muy Bien | 😊 |
| 70-79% | Bien | 👍 |
| 60-69% | Aceptable | 📚 |
| < 60% | Sigue Intentando | 💪 |

---

## 🔊 Sistema de Sonidos (Web Audio API)

Los efectos sonoros se generan **dinámicamente** en tiempo real usando la **Web Audio API** de JavaScript. No requieren archivos de audio externos ni ocupan espacio en disco.

### Tipos de Sonidos Implementados

| Evento | Nombre | Descripción Técnica |
|--------|--------|-------------------|
| ✅ Respuesta Correcta | `success` | Dos tonos ascendentes: DO5 (523Hz) → MI5 (659Hz) |
| ❌ Respuesta Incorrecta | `error` | Dos tonos descendentes: 400Hz → 300Hz |
| 🎮 Inicio de Nivel | `levelStart` | Arpeggio ascendente: DO5 → MI5 → SOL5 |
| 🏆 Fin del Test | `finish` | Acorde triunfante: DO5 + MI5 + SOL5 (simultáneo) |
| 🔘 Click de Botón | `buttonClick` | Beep rápido de 800Hz (0.1s) |

### Características Técnicas

- **Generación en Tiempo Real**: Sintetizados con osciladores AudioContext
- **Sin Archivos Externos**: No requieren recursos HTTP
- **Personalizables**: Edita `js/sounds.js` para cambiar frecuencias, duraciones, etc.
- **Persistencia**: Preferencia de sonido guardada en localStorage
- **Compatible**: Funciona en Chrome, Firefox, Safari, Edge y navegadores móviles

### Cómo Personalizar Sonidos

Edita el archivo `js/sounds.js` en la clase `SoundManager`:

```javascript
// Ejemplo: Cambiar duración del sonido de acierto
playSuccessSound(oscillator, gain, now) {
    oscillator.frequency.setValueAtTime(523.25, now);
    oscillator.frequency.setValueAtTime(659.25, now + 0.1);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5); // Cambiar duración
    oscillator.start(now);
    oscillator.stop(now + 0.5);
}
```

### Desactivar Sonidos

Los sonidos se pueden desactivar sin perder funcionalidad del juego:

```javascript
// En la consola del navegador (F12):
localStorage.setItem('soundsEnabled', 'false');
location.reload();
```

---

## 🛠️ Personalización

### Agregar o Editar Preguntas

**IMPORTANTE**: Las preguntas ahora se encuentran en un archivo **JSON separado** (`assets/data/questions.json`) por razones de mantenibilidad y escalabilidad.

#### Paso 1: Abrir el archivo JSON

Abre `assets/data/questions.json` en tu editor de código.

#### Paso 2: Estructura de una pregunta

Cada pregunta tiene la siguiente estructura:

```json
{
    "pregunta": "¿Cuál es el PUNTO SEGUIDO?",
    "tipo": "Tipos de Punto",
    "opciones": [
        "El que separa párrafos diferentes",
        "El que separa oraciones dentro del mismo párrafo",
        "El que termina el texto completamente"
    ],
    "correcta": 1,
    "explicacion": "El punto seguido separa oraciones dentro del mismo párrafo..."
}
```

**Explicación de campos:**
- `pregunta` (string): La pregunta a mostrar
- `tipo` (string): Categoría de la pregunta (p.ej., "Tipos de Punto", "Tipos de Coma")
- `opciones` (array): Las 3 opciones de respuesta
- `correcta` (number): Índice de la respuesta correcta (0, 1 o 2)
- `explicacion` (string): Explicación de la respuesta correcta

#### Paso 3: Agregar nueva pregunta

Añade una nueva pregunta dentro del nivel deseado:

```json
"basico": [
    { /* preguntas existentes */ },
    {
        "pregunta": "Mi nueva pregunta",
        "tipo": "Tipos de Coma",
        "opciones": ["Opción A", "Opción B", "Opción C"],
        "correcta": 0,
        "explicacion": "Esta es la razón por la que es correcta"
    }
]
```

⚠️ **Importante**: 
- Asegúrate de usar comillas dobles en JSON (no simples)
- Verifica que el JSON sea válido (sin comas faltantes)
- Los índices de `correcta` siempre comienzan en 0
- Respeta la estructura de los 3 niveles: `basico`, `intermedio`, `avanzado`

#### Paso 4: Probar cambios

- Guarda el archivo
- Recarga la página en el navegador (Ctrl+F5 para limpiar caché)
- El JSON se cargará automáticamente al abrir `index.html`

### Cargar preguntas automáticamente

El archivo `js/questions.json` se carga **automáticamente** al iniciar la aplicación. La función `cargarPreguntas()` (definida en `js/main.js`) realiza una petición `fetch` al archivo JSON cuando se abre `index.html`.

```javascript
// En index.html se ejecuta:
document.addEventListener('DOMContentLoaded', async () => {
    await cargarPreguntas();      // Carga questions.json
    await initializeGame();        // Inicializa GameController
});
```

### Validar el JSON

Para verificar que tu JSON es válido:

1. Abre https://jsonlint.com/ en tu navegador
2. Copia y pega el contenido de `questions.json`
3. Si hay errores, aparecerán destacados en rojo

### Cambiar Colores

Modifica las variables CSS en `css/styles.css`:

```css
:root {
    --primary: #2563eb;           /* Color principal (azul) */
    --success: #10b981;           /* Color de aciertos (verde) */
    --danger: #ef4444;            /* Color de errores (rojo) */
    --warning: #f59e0b;           /* Color de advertencias (naranja) */
}
```

### Cambiar Tipografías

En `index.html`, modifica el link de Google Fonts:

```html
<link href="https://fonts.googleapis.com/css2?family=NUEVA_FUENTE:wght@400;600;700&display=swap" rel="stylesheet">
```

---

## 📱 Responsividad

La aplicación se adapta automáticamente a:
- 🖥️ **Pantallas de escritorio** (> 768px)
- 📱 **Tablets** (480px - 768px)
- 📱 **Móviles** (< 480px)

Utiliza Bootstrap 5 Grid System para máxima compatibilidad.

---

## ⚡ Rendimiento

- ✅ Carga rápida sin dependencias complejas
- ✅ Bootstrap utiliza CDN (optimizado)
- ✅ Google Fonts optimizadas para web
- ✅ Uso eficiente de memoria
- ✅ Animaciones optimizadas con CSS
- ✅ Sonidos sintetizados sin descargas HTTP

---

## 📋 Estructura de Clases JavaScript

### GameStats
- `reset()`: Reinicia todas las estadísticas
- `registrarRespuesta(correcta)`: Registra aciertos/errores y racha
- `obtenerPorcentaje()`: Calcula porcentaje de aciertos
- `obtenerCalificacion()`: Retorna emoji, título y mensaje

### GameController
- `inicializarElementos()`: Obtiene referencias del DOM
- `asignarEventos()`: Vincula listeners de eventos
- `seleccionarNivel(event)`: Cambia el nivel actual
- `iniciarJuego()`: Inicia el test
- `mostrarPregunta()`: Muestra pregunta actual
- `seleccionarRespuesta()`: Procesa respuesta
- `finalizarJuego()`: Calcula resultados
- `cambiarPantalla(screen)`: Transiciona entre pantallas

### SoundManager
- `initAudioContext()`: Inicializa Web Audio API
- `playSound(type)`: Reproduce sonido específico
- `toggleSound()`: Activa/desactiva sonidos

---

## 🐛 Características Futuras

- [ ] Guardado de histórico de resultados en localStorage
- [ ] Sistema de badges y logros
- [ ] Modo de estudio con explicaciones detalladas
- [ ] Estadísticas avanzadas por usuario
- [ ] UI interactiva para controlar volumen de sonidos
- [ ] Múltiples temas de sonidos (electrónico, natural, clásico)
- [ ] Modo multijugador online
- [ ] Exportar resultados en PDF

---

## 📄 Licencia

Este proyecto es de uso libre para propósitos educativos.

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios mayores:
1. Describe el cambio
2. Verifica que todo funciona correctamente
3. Proporciona explicación detallada

---

**Desarrollado con ❤️ para mejorar tu dominio de los signos de puntuación** 📚✨
