# AGENTS.md — I SEE YOU

Instrucciones compartidas para ChatGPT, Claude Code y Cursor. Leer primero este archivo y `PROJECT_MEMORY.md` desde `origin/main` en cada sesión. Verificar `git fetch origin` antes de declarar que falta un archivo.

## Principio
La memoria del proyecto está en GitHub, no en chats individuales. Responder y registrar con concisión. No copiar grandes historiales ni prompts cuando basta con citar un archivo y sección.

## Rutas de trabajo
- `PROJECT_MEMORY.md`: decisiones vigentes, prioridades y estado.
- `docs/MAGAZINE.md`: mapa editorial, textos, fotografías y aprobaciones.
- `docs/agents/claude.md`, `docs/agents/cursor.md`, `docs/agents/chatgpt.md`: reportes de ejecución por agente (crear en rama propia).
- Ramas sugeridas: `feature/envelope-magazine` (Claude), `feature/cinema` (Cursor), `feature/editorial-magazine` (revista). `main` estable.

## Protocolo
1. Leer solo archivos pertinentes y comprobar ramas/PR y cambios recientes.
2. Antes de editar, identificar alcance, archivos y dependencias. Evitar edición concurrente de `index.html`.
3. Ejecutar en rama propia. No publicar cambios visuales sin aprobación de Pablo.
4. Cada bloque debe entregar evidencia: archivo/commit/PR, prueba realizada, pendientes, próximo paso.
5. Escribir avances en archivo del agente en su rama. Proponer cambios a la memoria central mediante PR; integración única para evitar conflictos.
6. Si hay límite de tokens o sesión interrumpida, siguiente agente lee estos documentos y continúa. No prometer ejecución autónoma: un agente debe recibir orden o disponer de su propia automatización.

## Restricciones no negociables
- Jea: fotos originales, sin regeneración ni alteración de rostro, cuerpo, pelo, piel, ropa, pose o escenario mediante IA.
- No cambiar tipografías, paleta ni visual aprobado sin mostrar demo y pedir autorización.
- La revista contiene exactamente 12 páginas, contando portada y contraportada.
- El viaje al hotel ya ocurrió. Orden actual: revista → espejo → película. Producción de película en paralelo.
- Separar arte editorial y texto editable; nunca usar una imagen generada con texto defectuoso como arte final.

## Ahorro de tokens
- Registrar decisiones y resultados, no transcripciones.
- Al iniciar: leer este archivo, memoria y documento específico de la tarea; no cargar todos los assets.
- Pedir únicamente datos bloqueantes. Reutilizar fuentes existentes y citar rutas.
- Reportes cortos: Hecho / Validado / Bloqueado / Siguiente / Commit.
- No repetir análisis ya documentado sin nueva evidencia.

## Asignaciones
**Claude Code:** sobre interactivo revista; CSS/GSAP o solución ligera, responsive, acceso a revista, prueba móvil, demo y PR. Revisar si HyperFrames está realmente disponible.

**Cursor:** producción de película NOW, SEE YOURSELF desde ahora: inventario audiovisual, guion técnico/storyboard, montaje inicial real si hay insumos, sonido/licencias y exportación; además reproductor. No limitarse a construir un reproductor.

**ChatGPT:** dirección creativa, selección de fotos, revista y PDF maestro, revisión, prompts visuales y supervisión de integración. Documentar decisiones editoriales en `docs/MAGAZINE.md`.

## Handoff mínimo
Fecha | agente | rama/commit | realizado y probado | bloqueo | siguiente paso. Máximo 10 líneas salvo documentación técnica indispensable.

## REGLA CRÍTICA — INTEGRIDAD FOTOGRÁFICA DE JEA (2026-10-24)
**Prioridad absoluta, por encima de cualquier prompt de estilo.** El usuario ha rechazado repetidamente portadas generadas porque alteran la cara de Jea. NO repetir el error.

- **Nunca usar generación o edición generativa de imágenes sobre una fotografía que contenga a Jea** para producir una portada o página final, ni siquiera con instrucciones de «preservar el rostro». El modelo puede reinterpretar sus rasgos y no garantiza fidelidad.
- **Cara intocable:** conservar los píxeles originales de cara y anteojos; no retocar, regenerar, embellecer, suavizar piel, modificar expresión ni sustituir por una cara similar. No hacer «face swap» generativo. Si el usuario permite editar el resto, proteger igualmente la cara original.
- **Método obligatorio:** composición determinista por capas con fotografía original intacta (HTML/CSS/SVG, Pillow, Photoshop o equivalente); títulos, reglas y recuadros se superponen como capas independientes. Se permite escalar/recortar para encuadrar, sin alterar los rasgos. Mantener el original archivado y separado del diseño.
- **Antes de entregar:** verificar que la cara procede de la fotografía original y que no se usó ninguna transformación generativa sobre ella. Si la fuente original no está disponible o no se puede verificar, **no fabricar la portada**: pedir el archivo original.
- **No afirmar que una cara está sin retoques si la imagen se generó con IA.** Si no se puede garantizar integridad, explicitarlo y detener la entrega.
- Las pruebas anteriores con imagen generativa de la portada de playa **no son válidas como arte final**. Rehacerlas mediante maquetación real sobre el JPEG original de playa, sin tocar la cara.
- Esta norma es obligatoria para ChatGPT, Claude Code, Cursor y cualquier otro agente.
