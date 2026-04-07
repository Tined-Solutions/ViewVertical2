# Showroom vertical inmobiliario

Sitio estático para señalización inmobiliaria, ya preparado para Sanity. La interfaz sigue funcionando como pantalla continua, pero ahora deja de depender de hojas de cálculo y consume el Content Lake a través del cliente oficial de Sanity en navegador. El render principal corre en React con Framer Motion desde un módulo del navegador.

## Estructura

- `index.html`: entrada principal y carga del cliente de Sanity, la configuración y los scripts del front.
- `server.mjs`: servidor local simple para desarrollo con `npm run dev`.
- `styles.css`: sistema visual, fondos animados y transiciones.
- `src/main.js`: render principal en React + Framer Motion y rotación automática.
- `src/config/sanity.js`: configuración de proyecto, dataset y tipos de contenido.
- `src/data/sanity.js`: cliente, consulta GROQ y normalización de datos.
- `src/components/viewer.js`: renderer clásico legado, ya no se carga en la página actual.
- `src/app.js`: lógica clásica legado, ya no se carga en la página actual.

## Puesta en marcha

1. Completa `projectId`, `dataset` y, si querés usar un fallback público para URLs relativas, `publicBaseUrl` en `src/config/sanity.js`.
2. Arranca el servidor local con `npm run dev`.
3. Abre `http://localhost:3000`.
4. En Sanity, agrega `http://localhost:3000` como CORS origin para que el front pueda consultar la API.

Opciones de performance recomendadas en `src/config/sanity.js`:

- `tvPerformanceMode: true`: reduce efectos de fondo para pantallas de TV.
- `panelRevealDelayMs: 1000`: muestra primero la imagen y luego el zócalo.
- `panelDynamicBlur: true`: ajusta el blur/opacidad del zócalo según brillo real de la imagen.
- `imageFormat: "webp"`, `imageQuality`, `imageMaxWidth`, `imageMaxHeight`: fuerza optimización de imágenes de Sanity.

## Contenido esperado en Sanity

El loader busca dos tipos de documentos:

- `siteSettings`: usa `companyName`, `companyTagline`, `publicBaseUrl` o `siteBaseUrl`.
- `inmueble` o `property`: usa `titulo` como nombre principal, `Tipo`, `operacion`, `Ubicacion`, `Direccion`, `Ambientes`, `Cochera`, `Servicios`, `precio`, `fotos`, `Link`, además de los campos de compatibilidad anteriores como `name`, `title`, `type`, `location`, `summary`, `metrics`, `features`, `theme`, `media`, `sortOrder` y `active`.

Las propiedades publicadas aparecen en pantalla ordenadas por `sortOrder` y luego por nombre. Si no hay inmuebles publicados, se muestra un estado vacío en lugar de contenido de demo.

## QR por inmueble

- Cada inmueble genera un QR con el valor de `Link` del propio documento.
- Si `Link` no está disponible, el sistema cae de nuevo a la pantalla principal con `?property=<id>`.
- Si el enlace es relativo, se resuelve contra `publicBaseUrl`, `siteBaseUrl` o la URL actual del sitio.
- Conviene usar un identificador estable para `id` o `slug` en Sanity.

## Optimización de imágenes

- Las imágenes servidas desde `cdn.sanity.io` se transforman automáticamente a `webp`.
- Se aplican parámetros de calidad y límites de tamaño desde `src/config/sanity.js`.
- URLs externas que no sean de Sanity se respetan tal como están.

## Notas

- El sitio ya no contiene catálogo hardcodeado.
- Los textos y campos de demo fueron reemplazados por configuración y carga remota desde Sanity.
- En pantallas landscape la experiencia rota 90° para verse en vertical; la foto toma más protagonismo y el zócalo de info queda más compacto debajo.
# ViewVerticalDeymonnaz
