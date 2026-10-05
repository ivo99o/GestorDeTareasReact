# Gestor de Tareas (React)

## Integrantes

- Ivan Mena

## Descripción breve

Es la versión en React del gestor de tareas que hice en el primer repositorio con HTML, CSS, Bootstrap y JavaScript. Se pueden crear, editar y eliminar tareas, y cada una cambia de color según qué tan cerca está su fecha objetivo (vencida, naranja, amarilla o pendiente). Cuando una tarea cambia de estado, el navegador manda una notificación.

Las tareas se guardan en el navegador (localStorage), así que no se pierden si recargás la página.

## Tecnologías utilizadas

- React
- Vite
- React Bootstrap (Bootstrap 5)
- React Router
- JavaScript
- Git / GitHub
- Vercel para el deploy

## Cómo correrlo en tu compu

Necesitás tener Node.js instalado. Después:

```
git clone https://github.com/ivo99o/GestorDeTareasReact.git
cd GestorDeTareasReact
npm install
npm run dev
```

Abrís el link que aparece en la terminal (normalmente `http://localhost:5173`).

## ¿Dónde usé React Bootstrap?

Usé sus componentes en lugar de escribir las clases de Bootstrap a mano:

- `Form`, `Form.Group`, `Form.Label`, `Form.Control` y `Form.Select` en el formulario de la barra lateral.
- `Button` en el botón de crear tarea, en los filtros y en los botones de editar y eliminar.
- `Card`, `Card.Body`, `Card.Title` y `Card.Text` en cada tarjeta de tarea.

## ¿Cómo usé React Router?

La app tiene una sola página, el Inicio, que está en la ruta `/`. Cualquier otra ruta redirige a `/`. Como es una app de una sola página, agregué un `vercel.json` para que Vercel siempre devuelva el `index.html`. Sin eso, al entrar a una ruta distinta de `/` en el deploy daría error 404 en lugar de redirigir.

## Estructura de carpetas

```
src/
├── components/
│   ├── Filtros/     (botones de categoría y de pendientes)
│   ├── Seo/         (título y descripción de la página)
│   ├── Sidebar/     (barra lateral con el formulario)
│   └── Tareas/      (listado, tarjeta y botones de cada tarea)
├── pages/
│   └── Inicio.jsx
├── utils/
│   └── tareas.js    (estados, localStorage y notificaciones)
├── App.jsx          (rutas y estado de las tareas)
└── main.jsx
```

## ¿Dónde usé map()?

Lo usé donde antes tenía que repetir código:

- En `ListaTareas`, para dibujar una `TarjetaTarea` por cada tarea.
- En `Filtros`, para crear los botones de categoría a partir del objeto de categorías.
- En `FormularioTarea`, para armar las opciones del select de categorías.

En todos los casos le puse una `key` para que React sepa identificar cada elemento.

## ¿Cómo usé las props?

El estado con la lista de tareas vive en `App`, y desde ahí baja por props hasta donde se necesita. Por ejemplo `App` le pasa `tareas`, `onGuardar` y `onEliminar` a `Inicio`, que le pasa a `ListaTareas` las tareas ya filtradas, y esta le pasa a cada `TarjetaTarea` su `tarea` y las funciones `onEditar` y `onEliminar`.

Con las funciones pasa al revés: el hijo las ejecuta (por ejemplo cuando tocás "Eliminar") y el cambio se hace arriba, en el componente que tiene el estado.

Los botones `BotonEditar` y `BotonEliminar` reciben el `onClick` desde la tarjeta, y `Seo` recibe el `titulo` y la `descripcion` de la página.

## ¿Qué estrategias de SEO apliqué?

- **Etiquetas semánticas**: `main` para el contenido, `aside` para la barra lateral del formulario, `section` para el listado y `article` para cada tarjeta.
- **Un solo `h1` por página** y los títulos siguientes ordenados (`h2` para cada tarjeta, por ejemplo).
- **Título y descripción de la página**: hice un componente `Seo` que cambia el `title` y la `meta description`. Lo armé actualizando las etiquetas que ya existen en `index.html` porque si las agregaba como etiquetas nuevas en React 19 me quedaban duplicadas en el `head`.
- **Descripción y `lang="es"` en el `index.html`**, para que haya una descripción por defecto aunque no corra JavaScript.
- **Diseño responsive**: en celular el formulario pasa a ser un panel desplegable y los filtros se apilan.
