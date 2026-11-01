# Vestidor Maison Cheval

Probador del combo "Armá tu outfit" de maisoncheval.mitiendanube.com.
Netlify publica esta carpeta y Google Tag Manager carga `vestidor.js` en la página del combo.

## Cómo agregar un color
1. Cargar la variante en Tienda Nube (el combo de Bundle Flow la toma solo).
2. Subir la imagen de la prenda como `<prenda>-<n>.webp`, del mismo tamaño que las demás de esa prenda.
3. Agregar el nombre del color al final de la lista `colors` de esa prenda en `config.json`.
   `n` es la posición en esa lista, empezando en 0. El nombre tiene que coincidir con el de
   Tienda Nube (no importan mayúsculas ni acentos).

## Cómo agregar una prenda nueva (por ejemplo, relojes)
Agregar un bloque en `layers` de `config.json` con `id`, `name`, `slot` (posición de la prenda en el
combo, empezando en 0), `box` (x, y, ancho, alto sobre un lienzo de 1500×2009), `z` (orden de capa),
`focus` (x, y, zoom) y `colors`.
