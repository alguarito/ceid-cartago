# CEID Cartago

Sitio del Centro de Estudios e Investigaciones Docentes (CEID) de la Subdirectiva SUTEV Cartago, Norte del Valle del Cauca.

En línea: https://alguarito.github.io/ceid-cartago/

## Qué contiene

- La portada, el artículo 52 del Estatuto del SUTEV y las seis secciones del sitio, que salen de sus funciones: Formación, Investigación, Publicaciones, EPA y PEPA, Educación pública y El CEID.
- Las fichas de contenido, el archivo y las convocatorias.
- La revista «Voces que Transforman», Fascículo 1, con una página para cada uno de sus ocho artículos.

## Cómo se genera

Este repositorio guarda el sitio ya generado. No se edita a mano. La fuente está en el taller de CEREBRO (`taller/web-ceid/`):

- `_contenidos/`: un archivo `.md` por cada contenido (plantilla en `PLANTILLA.txt`).
- `_herramientas/contenidos.py`: arma las fichas, los listados y el menú.
- `_herramientas/publicar.py`: arma esta carpeta para la publicación.

Para actualizar el sitio:

```bash
python3 -I _herramientas/publicar.py
```

Luego se hace commit y push en esta carpeta.
