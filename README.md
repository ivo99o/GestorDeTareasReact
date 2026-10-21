# Gestor de Tareas (React)

## Integrantes

- Ivan Mena

## Descripción breve

Es la versión en React del gestor de tareas que hice en el primer repositorio con HTML, CSS, Bootstrap y JavaScript. Se pueden crear, editar y eliminar tareas, y cada una cambia de color según qué tan cerca está su fecha objetivo (vencida, naranja, amarilla o pendiente). Cuando una tarea cambia de estado (a amarilla, naranja o vencida), la app manda un aviso por WhatsApp al teléfono que se cargó en la tarea, usando la API de Twilio.

Las tareas se guardan en el navegador (localStorage), así que no se pierden si recargás la página.

## Tecnologías utilizadas

- React
- Vite
- React Bootstrap (Bootstrap 5)
- React Router
- Axios (para llamar a la API)
- SweetAlert2 (mensajes de error)
- Twilio (API de WhatsApp)
- Función serverless de Vercel (`api/notificar.js`)
- JavaScript
- Git / GitHub
- Vercel para el deploy

## Cómo correrlo en tu compu

Necesitás tener Node.js instalado. Después:

```
git clone https://github.com/ivo99o/GestorDeTareasReact.git
cd GestorDeTareasReact/web
npm install
npm run dev
```

Abrís el link que aparece en la terminal (normalmente `http://localhost:5173`).

Con `npm run dev` se ve toda la app, pero el aviso por WhatsApp no se manda porque la función `api/notificar.js` solo corre en Vercel. En ese caso aparece el mensaje de error de SweetAlert2. Para probar el aviso hay que usar la versión desplegada.

## Consumo de la API (TP8)

La API que consumo es la de Twilio para WhatsApp. La app manda el aviso cuando una tarea ya existente cambia de estado (pendiente → amarilla → naranja → vencida). Al crear una tarea no se manda nada.

El navegador no llama directo a Twilio porque eso obligaría a poner las credenciales en el código del frontend, y cualquiera las vería en el JavaScript de la página. Por eso hice una función serverless en `api/notificar.js` que recibe `telefono`, `titulo` y `estado`, y es la que habla con Twilio con las credenciales guardadas en Vercel.

### Variables de entorno

- `VITE_API_URL` (en `web/.env`): la URL de mi función. En los componentes no hay ninguna URL escrita, se lee con `import.meta.env.VITE_API_URL` en `web/src/utils/whatsapp.js`. Como empieza con `VITE_`, queda dentro del JavaScript que se descarga, así que no es un secreto.
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN` y `TWILIO_WHATSAPP_FROM`: las credenciales de Twilio. Solo existen en Vercel (y en un `.env` mío en la raíz). No llevan `VITE_` para que nunca lleguen al navegador.
- Los archivos `.env` están en el `.gitignore`, no se suben a GitHub. Para correr el frontend hay que crear `web/.env` con la línea `VITE_API_URL=/api/notificar`.

### Axios, useState y useEffect

- **Axios**: en `web/src/utils/whatsapp.js`, `enviarAvisoWhatsApp` hace el `axios.post` a `VITE_API_URL` con el teléfono, el título y el estado de la tarea.
- **useEffect**: en `hooks/useAvisosWhatsApp.js` hay un efecto con un `setInterval` que cada 10 segundos revisa si alguna tarea cambió de estado. Si cambió, llama a `enviarAvisoWhatsApp`. Al desmontarse hace `clearInterval`.
- **useState**: en `hooks/useAvisosWhatsApp.js` el estado `avisos` guarda los avisos que se están mostrando, y se actualiza en cada paso de la petición.

### Estado de carga y errores

- **Cargando**: apenas empieza la petición aparece abajo a la derecha una tarjeta emergente con un spinner que dice "Enviando aviso...". Cuando Twilio responde, la misma tarjeta pasa a "Notificación enviada" y muestra la tarea, el nuevo estado, el número al que se mandó, el estado que informó Twilio y la hora. Se cierra sola a los 8 segundos o con la X.
- **Errores**: si falla (servidor caído, sin internet, número que no se unió al sandbox, número inválido) se muestra un SweetAlert2 con el mensaje del error y se saca la tarjeta de carga.

### Cómo probar el aviso por WhatsApp

Twilio en modo de prueba (sandbox) solo le puede escribir a números que se unieron antes. No hace falta crear ninguna cuenta:

1. Desde WhatsApp, mandar el mensaje `join rubber-goes` al número **+1 415 523 8886**. Twilio contesta que ya se unió.
2. Entrar a la app desplegada en Vercel (rama `main`) y crear una tarea con tu número en el campo de teléfono (por ejemplo `3815551234`, sin 0 ni 15).
3. Ponerle una fecha objetivo que esté a más de 24 horas, y después editarla a una fecha más cercana (o esperar a que se acerque) para que cambie de estado.
4. Con la app abierta, en unos segundos aparece la tarjeta "Notificación enviada" y llega el WhatsApp.

Cosas a tener en cuenta del sandbox: el `join` dura 3 días, y la cuenta de prueba tiene un límite de unos 100 mensajes. Las tareas de ejemplo tienen un teléfono falso, así que si una de ellas cambia de estado con la app abierta va a aparecer el SweetAlert de error.

## ¿Dónde usé React Bootstrap?

Usé sus componentes en lugar de escribir las clases de Bootstrap a mano:

- `Form`, `Form.Group`, `Form.Label`, `Form.Control` y `Form.Select` en el formulario de la barra lateral.
- `Button` en el botón de crear tarea, en los filtros y en los botones de editar y eliminar.
- `Card`, `Card.Body`, `Card.Title` y `Card.Text` en cada tarjeta de tarea.
- `Toast`, `ToastContainer` y `Spinner` en la tarjeta emergente del aviso de WhatsApp.

## ¿Cómo usé React Router?

La app tiene una sola página, el Inicio, que está en la ruta `/`. Cualquier otra ruta redirige a `/`. Como es una app de una sola página, agregué un `vercel.json` para que Vercel siempre devuelva el `index.html`. Sin eso, al entrar a una ruta distinta de `/` en el deploy daría error 404 en lugar de redirigir.

## Estructura de carpetas

```
api/
├── notificar.js                 (función serverless que habla con Twilio)
└── package.json
web/
├── public/
├── src/
│   ├── components/
│   │   ├── AvisosWhatsApp.jsx   (tarjeta emergente del aviso)
│   │   ├── BotonEditar.jsx
│   │   ├── BotonEliminar.jsx
│   │   ├── Filtros.jsx          (botones de categoría y de pendientes)
│   │   ├── FormularioTarea.jsx
│   │   ├── ListaTareas.jsx
│   │   ├── Seo.jsx              (título y descripción de la página)
│   │   ├── Sidebar.jsx          (barra lateral con el formulario)
│   │   └── TarjetaTarea.jsx
│   ├── hooks/
│   │   ├── useAvisosWhatsApp.js (avisos y revisión de estados cada 10 segundos)
│   │   └── useTareas.js         (estado de las tareas y localStorage)
│   ├── pages/
│   │   └── Inicio.jsx
│   ├── routes/
│   │   └── AppRoutes.jsx        (rutas de la aplicación)
│   ├── utils/
│   │   ├── tareas.js            (estados y localStorage)
│   │   └── whatsapp.js          (llamada a la API con Axios)
│   ├── App.jsx                  (une las rutas, las tareas y los avisos)
│   └── main.jsx
├── index.html
└── package.json
```

El frontend está en la carpeta `web` y el backend en la carpeta `api`. En la raíz quedan el `README.md` y el `vercel.json`, que le indica a Vercel cómo construir `web` y deja pasar las rutas `/api` a la función. Los estilos son solo de Bootstrap y react-bootstrap: no hay archivos CSS propios ni media queries, el diseño responsive sale de los breakpoints de Bootstrap.

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
