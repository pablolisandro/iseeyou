# I SEE YOU — Memoria viva

Actualizado: 2026-10-24.

## Prioridades
1. Revista editorial de 12 páginas, incluyendo portada y contraportada: ChatGPT y Pablo.
2. Sobre interactivo que abre la revista: Claude Code, rama feature/envelope-magazine.
3. Producción de película NOW, SEE YOURSELF en paralelo: Cursor, rama feature/cinema.
4. Después de revista: sobre del espejo. Película como cierre.

El viaje al hotel y el spa ya ocurrieron; no presentarlos como eventos futuros.

## Restricciones
- No alterar fotografías originales de Jea con IA.
- Mantener diseño y tipografía aprobados; no rediseñar sin permiso.
- Mantener main estable. Cada agente trabaja en su rama y propone PR.
- No editar index.html simultáneamente. Integrar cambios de forma coordinada.

## Protocolo para ChatGPT, Claude Code y Cursor
- Al comenzar, leer este archivo, revisar estado de repo, ramas y PR.
- Al terminar un bloque, actualizar el registro de progreso en docs/agents/<nombre>.md con hechos, archivos, commit, validación, bloqueos y próximo paso.
- Para actualizar este archivo central, proponer cambio en PR; una persona integra para evitar conflictos.
- No copiar conversaciones completas: registrar decisiones, entregables y enlaces. Resúmenes de traspaso de máximo diez líneas.
- Si un agente agota su cuota, otro continúa leyendo esta memoria, los registros y los PR.

## Estado comprobado
- Repositorio pablolisandro/iseeyou; HTML/CSS/JS estático desplegado en Vercel.
- index.html incluye CHAPTER 01, CHAPTER 02 y MAGAZINE; revista actualmente solo portada.
- Los sobres de index.html son imágenes en secciones, no apertura interactiva real.
- Hay assets de sobres y portada en la raíz. Demo HyperFrames mencionada por Claude está fuera del repositorio y no está verificada aquí.

## Decisiones pendientes
- PDF fuente definitivo y fotos disponibles para revista.
- Materiales audiovisuales para montaje real de película.
- Fecha límite concreta.
- Visor web propio o flipbook externo, decidir después de una prueba.

## Formato de registro
Fecha | agente | rama/commit | terminado y validado | pendiente | bloqueo | siguiente paso.
