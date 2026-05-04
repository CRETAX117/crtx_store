# CRTX Store

## Información

* Nombre: Brandon Cardenas
* Grupo: N1
* Sede: Cuenca
* URL: https://cretax-systems.com/web/U2/

## Qué es

Una tienda web para gestionar productos. Se pueden crear, ver, editar y eliminar productos con imágenes. Tiene login y las rutas están protegidas.

## Stack

Node.js, Express, MongoDB, Handlebars, Multer, Socket.io

## Funcionalidades

### Productos (CRUD completo)
- Crear producto con nombre, precio, descripción e imagen
- Ver todos los productos en tarjetas
- Editar cualquier campo y cambiar la imagen
- Eliminar producto (también borra la imagen del servidor)
- Validaciones: nombre mínimo 3 caracteres, precio positivo, descripción mínimo 10 caracteres

### Imágenes con Multer
- Sube imágenes en JPG, PNG o WebP
- Máximo 5MB por archivo
- Nombre único para evitar colisiones
- Si no se sube imagen, usa un placeholder

### Login y sesiones
- Acceso protegido: sin login no se puede ver nada
- Contraseñas encriptadas con bcrypt
- Sesiones guardadas en MongoDB (persisten si el servidor reinicia)
- Logout destruye la sesión

### Interfaz
- Layout con Handlebars (partials para navbar y mensajes)
- CSS propio con variables, dark mode y responsive
- Mensajes de éxito/error que desaparecen solos
- Navbar con usuario logueado y botón de salir

### Chat en tiempo real
- Mensajes con Socket.io (se actualizan sin recargar la página)
- Historial guardado en MongoDB (últimos 50 mensajes)
- Burbujas estilo WhatsApp (propias a la derecha, ajenas a la izquierda)
- Solo accesible si estás logueado

## Estructura

```
crtx_store/
├── app.js
├── config/db.js
├── models/ (Product, User, Message)
├── routes/ (products, auth)
├── middlewares/ (auth, upload, validators)
├── views/
│   ├── layouts/main.hbs
│   ├── partials/ (navbar, flashMessages)
│   ├── products/ (index, form)
│   └── auth/login.hbs
├── public/ (css, js, img)
├── uploads/
└── seeds/createAdmin.js
```

## Uso

```bash
npm install
cp .env.example .env
node seeds/createAdmin.js
npm run dev
```

Abrir `http://localhost:3000` → login con las credenciales del seed.
