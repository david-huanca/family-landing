# Familia Huanca Bravo

Sitio de la familia Huanca Bravo: David, Ruth, Lucas y Mateo, misioneros de la Iglesia del Nazareno en la Región América del Sur.

Es un sitio estático: HTML, CSS y JavaScript sin dependencias ni paso de compilación.

## Estructura

```
index.html        la página completa
scroll-world.js   el recorrido con scroll: la cámara sobre el mundo ilustrado y los heroes por escena
assets/           fotos en WebP y logos en SVG
vercel.json       caché larga para assets/
.vercelignore     deja fuera la carpeta .claude/ del despliegue
```

## Ver en local

```bash
python3 -m http.server 8000
```

Luego abre http://localhost:8000

## Publicar en Vercel

1. En https://vercel.com/new importa este repositorio.
2. En Framework Preset elige **Other**. Deja vacíos Build Command y Output Directory.
3. Presiona **Deploy**.

Cada push a la rama de producción vuelve a publicar el sitio.

## Pendiente

- Enlace de donación: el botón «Dar ahora» y el reverso de la tarjeta de oración.
- El formulario «Suscribirme» solo es visual y todavía no envía correos.
