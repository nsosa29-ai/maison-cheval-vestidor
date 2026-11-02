# Vestidor Maison Cheval

Probador del combo "Armá tu outfit" de maisoncheval.mitiendanube.com.
Netlify publica esta carpeta y Google Tag Manager carga `vestidor.js` en la página del combo.

## Cómo agregar un color
1. Cargar la variante en Tienda Nube (el combo de Bundle Flow la toma solo).
2. Subir la imagen de la prenda como `<prenda>-<n>.webp`, del mismo tamaño que las demás de esa prenda.
3. Agregar el nombre del color al final de la lista `colors` de esa prenda en `config.json`.
   `n` es la posición en esa lista, empezando en 0. El nombre tiene que coincidir con el de
   Tienda Nube (no importan mayúsculas ni acentos).

Si es un color de pantalón, subir también `loops-<n>.webp` (las presillas de ese color, que van sobre el cinturón).

## Cómo agregar una prenda nueva (por ejemplo, relojes)
Agregar un bloque en `layers` de `config.json` con `id`, `name`, `slot` (posición de la prenda en el
combo, empezando en 0), `box` (x, y, ancho, alto sobre un lienzo de 1500×2009), `z` (orden de capa),
`focus` (x, y, zoom) y `colors`.

## Ajustes de la tienda
`vestidor.js` también aplica, en todas las páginas, los ajustes que el editor de Tienda Nube no permite: solo se vende el combo (las prendas sueltas redirigen a él), el carrito muestra el color elegido y el precio único, y hay correcciones visuales en el inicio y el encabezado. Si cambia el precio del combo, actualizar `COMBO_PRICE`.

`hero-fondo.webp` es la foto de fondo del bloque principal del inicio y `hero-fondo.mp4` / `hero-fondo-chico.mp4` (celular) son su versión en movimiento, que se muestra encima cuando arranca. El cuadro del outfit sigue saliendo de la imagen cargada en el editor de Tienda Nube: `vestidor.js` recorta esa imagen, así que si se cambia hay que mantener el cuadro en el mismo lugar. El cartel del precio usa `COMBO_PRICE`.

`estatus-fix.webp` son los textos corregidos que van encima de la imagen Estatus / Velocidad / Oportunidad.
