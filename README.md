# PDF2Voice

PDF2Voice es una aplicacion web que permite convertir archivos PDF en audio. Los usuarios invitados pueden hacer conversiones temporales sin cuenta, mientras que los usuarios registrados pueden guardar sus documentos y gestionarlos desde su panel. El sistema tambien incluye un panel de administracion para supervisar usuarios y documentos.

**Creadores:** Diego Di Stefano y Alejandro Barrero

## Tecnologias

- Frontend: React
- Backend: Node.js, Express
- Base de datos: PostgreSQL
- ORM: Prisma

## Requisitos previos

Antes de comenzar, necesitas tener instalado:

- Node.js
- npm
- PostgreSQL
- Git

## Despliegue en local

### 1. Clonar el repositorio

```bash
git clone <https://github.com/AlejBarrero/Proyecto-TFG-DAM.git>
cd TFG
```

### 2. Instalar dependencias

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd ../frontend
npm install
```

## Configuracion del backend

### 3. Crear el archivo `.env` en `backend`

IMPORTANTE: Recuerda utilizar los datos de tu usuario, contraseña y/o clave secreta

Crea un archivo llamado `.env` dentro de la carpeta `backend` con este contenido:

```env
DATABASE_URL="postgresql://USUARIO:CONTRASENA@localhost:5432/pdf2voice"
JWT_SECRET="tu_clave_secreta"
PORT=5000
ALLOWED_ORIGIN="http://localhost:3000"
BASE_URL="http://localhost:5000"
NODE_ENV=development
```

### 4. Crear la base de datos en PostgreSQL

Usa ese nombre:

```sql
CREATE DATABASE pdf2voice;
```

### 5. Ejecutar migraciones de Prisma

Desde la carpeta `backend`:

```bash
npx prisma migrate deploy
npx prisma generate
```

### 6. Iniciar el backend

```bash
npm run dev
```

El backend quedara disponible en:

```text
http://localhost:5000
```

## Configuracion del frontend

### 7. Crear el archivo `.env` en `frontend`

Crea un archivo `.env` dentro de `frontend` con este contenido:

```env
REACT_APP_API_URL=http://localhost:5000
```

### 8. Iniciar el frontend

```bash
npm start
```

El frontend quedara disponible en:

```text
http://localhost:3000
```

## Nota importante

Los usuarios registrados se crean con rol `user` por defecto. Si quieres acceder al panel de administracion, tendras que cambiar manualmente el rol de un usuario en la base de datos a `admin`.

## Scripts utiles

### Backend

```bash
npm run dev
npm test
npm run lint
```

### Frontend

```bash
npm start
npm run build
npm test
```
