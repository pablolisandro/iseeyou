# Cursor — NOW, SEE YOURSELF

2026-10-25 | Cursor | `feature/cinema` | Primer corte de 0:36, mudo, un plano. `media/video/nsy-001-look.mp4` sale de `jea-cover.jpg` por escala y recorte, sin retoque. El reproductor lo proyecta con la marca Primer corte. | No es el corte final. Faltan las otras fotos originales y la música con licencia. La selfie de portada aprobada no está en el repo. | Pablo confirma si el balcón queda, y entrega los JPEG del cuerpo y el audio.

## Validado

- SHA-256 de `nsy-001-balcony.jpg` igual a `jea-cover.jpg`.
- El mp4 es H.264 1920×1080, 864 cuadros, 36 s, sin audio, 6,9 MB.
- `render-look.sh` reconstruye ese archivo. `export.py --check` debe aceptar el plano.

## Propuesta para PROJECT_MEMORY.md

No edito el archivo central. Texto sugerido:

2026-10-25 | Cursor | feature/cinema | Primer corte visible, una foto, mudo, no final. | Resto de fotografías y música. | Selfie aprobada ausente del repo. | Confirmar el balcón y sumar originales.
