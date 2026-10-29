# NOW, SEE YOURSELF — primer corte

Estado: primer corte visible, no corte final. 36 segundos. Mudo.

El subtexto no se dice en pantalla. Jea ve a los demás. Este tramo invierte la mirada. El único texto es el título.

## Material usado

| Fuente | Qué es | Tratamiento |
| --- | --- | --- |
| `jea-cover.jpg` | Fotografía original del balcón. Copia intacta en `media/photo/nsy-001-balcony.jpg`, mismo SHA-256. | Escala casi 1:1, recorte 16:9 y deriva vertical de 70 px. Sin retoque. |
| Playfair Display | Misma familia que el sitio. | Título superpuesto, abajo, fuera del rostro. |

No hay otro video ni otra fotografía original en el repositorio. Los sobres, la tarjeta y los base64 no entran. La selfie de portada aprobada el 2026-10-25 no está en el repo: no se reconstruye.

## Storyboard

| Tiempo | Plano | Transición | Tipo | Sonido |
| --- | --- | --- | --- | --- |
| 0:00–0:03 | Negro | Fundido de entrada, 2,8 s | — | Silencio |
| 0:02–0:11 | La fotografía aparece. Título NOW, / SEE YOURSELF abajo. | El título entra y sale por opacidad | Playfair, marfil, dos líneas, sin sombra | Silencio |
| 0:11–0:28 | Ella y el balcón. La ventana se mueve apenas. | Ninguna. Un solo plano. | Sin texto | Silencio |
| 0:28–0:36 | El título vuelve y la imagen cierra. | Fundido a negro, 4 s | El mismo título | Silencio |

Duración total: 0:36. Un plano, no una sucesión de diapositivas.

## Propuesta sonora

Este corte queda mudo. Para el corte final: una sola línea, piano o voz sin letra, grabada para la pieza, más larga que la imagen. Sin pista de biblioteca y sin tema elegido. Hace falta el archivo y la licencia de sincronización.

## Qué falta para el corte final

- Confirmar que esta fotografía del balcón puede quedarse en la película.
- Los JPEG originales del cuerpo del film. La playa y la selfie aprobada no están en el repo.
- El orden de esas fotos, si van. Cada una sería otro plano largo, con fundido, no un carrusel.
- La música y su licencia.
- La duración definitiva. 0:36 es el primer corte, no la medida final.

Rehacer el plano: `bash cinema/pipeline/render-look.sh`.
