# Aplicaciones web – Unidad 2

## Información

* Nombre: Brandon Cardenas

* Grupo: N1

* Sede: Cuenca

* Fecha: 01/05/2026

## Descripción del proyecto

Este proyecto es una aplicación web para gestión de productos. Estoy utilizando Node.js con Express como servidor, MongoDB como base de datos y Handlebars como motor de plantillas para generar las vistas.

## Lo que llevo implementado hasta ahora

### 1. Inicialización del proyecto

He creado el proyecto con npm init e instalado todas las dependencias que voy a necesitar: express, mongoose, express-handlebars, dotenv, multer, bcryptjs, express-session, connect-mongo, express-validator, socket.io y method-override. También he configurado nodemon como dependencia de desarrollo para que el servidor se reinicie solo cuando guardo cambios.

### 2. Estructura de carpetas MVC

He organizado el proyecto siguiendo el patrón MVC con las carpetas models, routes, views, public, middlewares, config y uploads. Cada carpeta tiene su propósito definido para mantener el código ordenado.

### 3. Conexión a MongoDB

He configurado la conexión a una instancia de MongoDB que corre en Docker. La conexión se maneja desde config/db.js usando Mongoose y los datos sensibles están en un archivo .env que no se sube al repositorio.

### 4. Esquemas de datos con Mongoose

He definido tres modelos:
- **Product**: nombre, precio, descripción e imagen del producto
- **User**: usuario y contraseña (la contraseña se encripta automáticamente al guardar)
- **Message**: usuario, texto del mensaje y fecha (para el chat que implementaré más adelante)

### 5. Servidor Express y Handlebars

He configurado app.js como punto de entrada. Express sirve los archivos estáticos desde la carpeta public y las imágenes subidas desde uploads. Handlebars está configurado como motor de vistas con un layout principal en views/layouts/main.hbs.

## Instrucciones de uso

```bash
npm install
cp .env.example .env    # configurar la URI de MongoDB
npm run dev
```

Abrir `http://localhost:3000` en el navegador.
