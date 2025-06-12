# Food App Backend

Este es el backend para la aplicación "Food App". Está construido con Node.js, Express, y TypeScript, y utiliza MongoDB como base de datos. Proporciona una API RESTful para gestionar productos, usuarios y carritos de compra.

---

## ✨ Características

- **Stack Moderno:** TypeScript para un código robusto y escalable.
- **Base de Datos NoSQL:** MongoDB con Mongoose para una gestión de datos flexible.
- **API RESTful:** Endpoints bien definidos para las operaciones principales de la aplicación.
- **Estructura Organizada:** Lógica de negocio separada en servicios, controladores y modelos.
- **Seguridad Básica:** Middlewares como Helmet y CORS configurados.

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Lenguaje:** TypeScript
- **Base de Datos:** MongoDB (con Mongoose)
- **Manejo de Dependencias:** npm
- **Variables de Entorno:** dotenv
- **Logging:** morgan
- **Seguridad:** helmet, cors
- **Desarrollo:** ts-node-dev, nodemon

---

## 🚀 Guía de Inicio Rápido

Sigue estos pasos para tener una instancia local del backend funcionando.

### 1. Prerrequisitos

- [Node.js](https://nodejs.org/en/) (v16 o superior)
- [npm](https://www.npmjs.com/)
- Una instancia de [MongoDB](https://www.mongodb.com/) (local o en la nube como MongoDB Atlas)

### 2. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/food-app-backend.git
cd food-app-backend
```

### 3. Instalar Dependencias

```bash
npm install
```

### 4. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto. Puedes copiar el archivo de ejemplo `.env.sample`.

```bash
cp .env.sample .env
```

Luego, edita el archivo `.env` con tus propias credenciales y configuraciones:

```env
MONGODB_URI="tu_uri_de_mongodb_aqui"
PORT=3001
API_PREFIX="/api/v1"
```

### 5. Iniciar el Servidor

Para iniciar el servidor en modo de desarrollo (con recarga automática):

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3001` (o el puerto que hayas configurado).

---

## 📜 Scripts Disponibles

- `npm run dev`: Inicia el servidor en modo desarrollo con `ts-node-dev`.
- `npm run build`: Compila el código TypeScript a JavaScript en el directorio `dist/`.
- `npm start`: Inicia el servidor en modo producción desde los archivos compilados en `dist/`.

---

## 📖 Documentación de la API

El prefijo base para todos los endpoints es `/api/v1`.

### Health Check

| Método | Endpoint         | Descripción                               |
|--------|------------------|-------------------------------------------|
| `GET`  | `/health`        | Verifica el estado de salud del servidor. |

### Carrito de Compras (Cart)

**Nota:** Todas las rutas del carrito requieren autenticación. Actualmente se usa un middleware de placeholder que simula un usuario autenticado.

| Método   | Endpoint                  | Descripción                                                                                             |
|----------|---------------------------|---------------------------------------------------------------------------------------------------------|
| `GET`    | `/cart`                   | Obtiene el carrito de compras del usuario actual. Si no existe, crea uno nuevo.                         |
| `POST`   | `/cart/items`             | Agrega un producto al carrito. Si el producto ya existe, incrementa su cantidad. **Body:** `{ "productId": "...", "quantity": 1 }` |
| `DELETE` | `/cart/items/:productId`  | Decrementa en uno la cantidad de un producto en el carrito. Si la cantidad llega a cero, se elimina.     |
| `DELETE` | `/cart`                   | Vacía completamente el carrito de compras del usuario.                                                  |


