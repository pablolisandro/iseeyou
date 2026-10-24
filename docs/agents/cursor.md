# Cursor — NOW, SEE YOURSELF

2026-10-24 | Cursor | `feature/cinema` | Inventario de la raíz, reproductor provisional en `/cinema/` (entrada, controles, pantalla completa, 390 px), `export.py` mudo 1920×1080 y rechazo si la música es más corta. Guion técnico en `cinema/STORYBOARD.md`: huecos, sin escenas. | No hay video, audio ni lista de escenas. Montaje real no empezó. | Esperar metraje ratificado y licencia. No usar sobres ni `jea-cover.jpg` como planos.

## Archivos de este frente

`cinema/README.md`, `cinema/STORYBOARD.md`, `cinema/index.html`, `cinema/player.css`, `cinema/player.js`, `cinema/sequences/now-see-yourself.json`, `cinema/pipeline/export.py`, `cinema/media/{video,photo,music}/`.

## Validado

- `export.py` sin `picture`: código 2, ningún archivo.
- Rutas `../`, absolutas y fuera de `media/video` bloqueadas.
- Dos clips recortados exportan H.264 1920×1080. Música más corta: código 1, sin archivo.
- Chrome: título, Sin plano, Sin tema, fullscreen, ancho estrecho. Sin errores de consola.

## Propuesta para PROJECT_MEMORY.md

No edito ese archivo en esta rama. Texto sugerido para Estado comprobado:

2026-10-24 | Cursor | feature/cinema | Reproductor provisional y pipeline que no exporta sin metraje. | Montaje real, música, escenas. | Cero video y cero audio en el repo. | Cargar planos en `cinema/media/video` y declararlos en la secuencia.
