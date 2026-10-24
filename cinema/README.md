# NOW, SEE YOURSELF

Preparación técnica de la experiencia cinematográfica. Con el material que hay hoy no se puede producir la película. `/cinema/` es una demo técnica provisional del reproductor: carteles de hueco, sin escenas, sin imágenes nuevas y sin música.

No se modifican `main`, los sobres ni la revista.

## Inventario

No hay video. No hay audio. No hay guion ni lista de escenas. Estas son todas las piezas visuales del repositorio y por qué no entran en la secuencia.

| Archivo | Medida | Qué es | En la película |
| --- | --- | --- | --- |
| `sobre-closed.png` | 1962×1280 | Sobre cerrado, capítulo 01 | No |
| `sobre-front.png` | 1942×1260 | Sobre, capítulo 01 | No |
| `sobre-closed-b64.txt` | — | El mismo `sobre-closed.png` en base64 | No |
| `sobre-front-b64.txt` | — | El mismo `sobre-front.png` en base64 | No |
| `chapter02-page-000.png` | 1536×1024 | Página de sobre, capítulo 02 | No |
| `chapter02-page-001.png` | 1536×1024 | Página de sobre, capítulo 02 | No |
| `chapter02-page-002.png` | 1536×1024 | Página de sobre, capítulo 02 | No |
| `sobre2-page-000.png` | 1536×1024 | Copia byte a byte de `chapter02-page-000.png` | No |
| `sobre2-page-001.png` | 1536×1024 | Copia byte a byte de `chapter02-page-001.png` | No |
| `sobre2-page-002.png` | 1536×1024 | Copia byte a byte de `chapter02-page-002.png` | No |
| `tarjeta-card.png` | 1960×1228 | Gráfico en la raíz, sin uso en el HTML | No |
| `jea-cover.jpg` | 1932×2576 | Fotografía de la portada de la revista | No |

`sobre2-page-*` no aporta planos nuevos. Los `.txt` tampoco: decodifican al PNG del mismo sobre.

## Estructura

```text
cinema/
  index.html                 reproductor
  player.css
  player.js
  README.md
  media/
    video/                   metraje, cuando exista
    photo/                   fotografías aprobadas para la película
    music/                   tema elegido, cuando exista
  sequences/
    now-see-yourself.json    orden, in/out, huecos y demo
  pipeline/
    export.py                exportación que se niega a inventar material
  exports/                   salida local, no se versiona
```

Nombre de archivo, cuando haya material real:

```text
media/video/nsy-001-slug.mp4
media/photo/nsy-001-slug.jpg
media/music/nsy-score.wav
```

El número es el orden de ingesta. El slug lo pone quien entrega el material. No copiar aquí sobres, la tarjeta ni `jea-cover.jpg`.

## Secuencia

`sequences/now-see-yourself.json` es la única fuente del montaje.

- `picture`: lista ordenada de videos. Vacía hoy.
- `music`: `null` hasta que alguien elija un tema. Esta preparación no lo elige y no deja una pista provisoria.
- `gaps`: huecos abiertos.
- `demo`: programa del reproductor mientras `picture` está vacío. Son carteles, no escenas.

Cada plano, cuando exista, queda así:

```json
{
  "id": "nsy-001",
  "src": "media/video/nsy-001-slug.mp4",
  "poster": "media/photo/nsy-001-slug.jpg",
  "in": 0,
  "out": 12.0
}
```

`in` y `out` están en segundos del archivo. `out` puede omitirse para usar el archivo hasta el final. `poster` es opcional y no se anima solo.

La música, cuando alguien la decida:

```json
{ "src": "media/music/nsy-score.wav", "in": 0 }
```

Rutas relativas a `cinema/`. Solo se aceptan archivos dentro de `media/video`, `media/photo` y `media/music`.

## Reproductor

Abrir `/cinema/` con un servidor estático desde la raíz del repo. `?sequence=nombre.json` carga otro archivo de `sequences/` si el nombre es solo minúsculas, números y guiones.

Mientras `picture` esté vacío, el reproductor muestra la demo y la marca **Demo técnica provisional** durante la entrada, la proyección y la pantalla completa. Si `picture` tiene archivos, proyecta esos archivos en orden y guarda la demo. La música del manifiesto solo suena en ese modo, nunca debajo de la demo.

La entrada es un fundido desde negro con el título. Con `prefers-reduced-motion: reduce`, el fundido es corto. Clic, Enter, Espacio o Escape la salta.

Controles, ocultos mientras la proyección corre y visibles en pausa, al mover el puntero o al enfocar:

| Control | Acción |
| --- | --- |
| Reproducir / pausar | Botón, clic en el cuadro o Espacio / K |
| Posición | Barra, o flecha izquierda / derecha (5 s) |
| Inicio / fin | Home / End |
| Pantalla completa | Botón o F. Escape sale |

En un toque, si los controles están ocultos, el primer toque solo los muestra.

## Pipeline de montaje y exportación

1. Ingestar en `media/video`, `media/photo` y `media/music` con el nombre de arriba. Fotografías y música pueden esperar; sin video no hay montaje.
2. Completar `picture` en orden de proyección. No rellenar huecos con sobres, con la tarjeta ni con la portada.
3. Dejar `music` en `null` hasta que el tema esté elegido y tenga derecho de uso. No usar una pista de reemplazo.
4. Revisar la proyección en `/cinema/`.
5. Exportar el master web solo desde lo declarado:

```bash
python3 cinema/pipeline/export.py
```

Hoy ese comando sale con código 2 y no escribe archivo. Con `picture` completo escribe `cinema/exports/now-see-yourself-web.mp4`: H.264, 1920×1080, recuadro 16:9, 24 fps, yuv420p, `+faststart`. Si `music` sigue en `null`, la salida es muda y el script lo dice. No estira ni repite un tema más corto que la imagen. No convierte fotografías en planos.

```bash
python3 cinema/pipeline/export.py --check
```

revisa las rutas sin exportar.

Un master de archivo (ProRes o similar) queda para cuando exista el montaje. No se genera ahora.

## Materiales que faltan

- Metraje en video, ya editado o con `in`/`out`, y el orden de esos planos.
- Lista de escenas o guion. Sin eso no hay contenido que montar; no se inventa uno.
- Fotografías aprobadas para la película, si el montaje las va a usar. Las de este repo pertenecen a los sobres, a la tarjeta o a la revista.
- Música definitiva y su licencia. Sigue sin seleccionar.
- Duración objetivo.
- Relación de aspecto, si no es 16:9 a 1920×1080 y 24 fps.
- Tratamiento de títulos y cartela final, si no alcanza el título NOW, SEE YOURSELF.
- Subtítulos, voz o audio de set, si existen.
- Poster frame y grado de color aprobados.

## Qué queda fuera de esta rama

- `index.html`, `comparison.html` y `vercel.json`.
- Sobres, páginas de capítulo, tarjeta y `jea-cover.jpg`.
- Cualquier imagen nueva de Jea.
- Una pista musical, aunque sea temporal.
