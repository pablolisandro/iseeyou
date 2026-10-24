# Guion técnico — NOW, SEE YOURSELF

Estado: 2026-10-24. Montaje real bloqueado. Este archivo no es un guion de escenas.

## Qué está confirmado

- El título de la película es NOW, SEE YOURSELF.
- La película es el cierre. El orden del proyecto es revista, espejo, película. La producción de la película corre en paralelo (`PROJECT_MEMORY.md`).
- El viaje al hotel y el spa ya ocurrieron. No se presentan como futuros.
- La contraportada propuesta de la revista usa el mismo título como puente. Esa página no está ratificada (`docs/MAGAZINE.md`). No se convierte en planos.
- Los textos HERE y TIRED/El spa viven en `index.html`. Son piezas del sitio, no un guion.

No hay lista de escenas, metraje, fotografías aprobadas para cine ni tema musical.

## Storyboard

Cada fila es un hueco técnico. La columna Acción queda vacía a propósito.

| # | Función | Acción | Imagen | Sonido | Estado |
| --- | --- | --- | --- | --- | --- |
| 01 | Título | — | Sin plano | Sin tema | Abierto |
| 02… | Cuerpo | — | Sin plano | Sin tema | Bloqueado: no hay escenas |
| fin | Cierre | — | Sin plano | Sin tema | Abierto |

Cuando exista un plano, la fila se completa con hechos del material (archivo, `in`, `out`), no con una acción inventada. El orden de proyección se escribe en `sequences/now-see-yourself.json`.

## Sonido y licencias

No hay tema elegido ni pista provisoria.

Antes de poner un archivo en `media/music/`:

- Confirmar titular del máster y derecho de sincronización para esta pieza.
- Entregar WAV o FLAC. La duración tiene que cubrir la imagen: `export.py` no estira ni repite.
- Dejar `music` en `null` hasta esa confirmación.

Silencio es el estado actual. No se sustituye por una biblioteca ni por audio de los sobres.

## Montaje

No hay insumos, así que no hay corte inicial. `python3 cinema/pipeline/export.py` sale con código 2 y no escribe archivo.

No usar como plano: sobres, `sobre2-page-*`, `tarjeta-card.png`, `jea-cover.jpg`, ni los textos base64. No generar imágenes de Jea.

El reproductor de `/cinema/` sigue en demo técnica provisional hasta que `picture` tenga archivos.
