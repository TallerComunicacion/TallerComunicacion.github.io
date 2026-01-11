import re

with open(r'c:\Users\User\Desktop\Software 1\js\practica.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Reemplazar la sección de auto-scroll
old_text = """    // ========== AUTO-SCROLL EN MÓVIL ==========
    const viewportHeight = window.innerHeight;
    const scrollThreshold = 100; // Píxeles desde el borde para iniciar scroll
    
    // Si el dedo está cerca del borde inferior
    if (touchY > viewportHeight - scrollThreshold) {
        window.scrollBy(0, 5); // Scroll hacia abajo
    }
    // Si el dedo está cerca del borde superior
    else if (touchY < scrollThreshold) {
        window.scrollBy(0, -5); // Scroll hacia arriba
    }"""

new_text = """    // Auto-scroll deshabilitado en móvil para evitar conflictos con scroll manual
    // El usuario puede scrollear manualmente mientras arrastra"""

content = content.replace(old_text, new_text)

with open(r'c:\Users\User\Desktop\Software 1\js\practica.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Archivo actualizado")
