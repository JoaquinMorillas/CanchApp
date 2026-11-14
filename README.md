# 🏟️ CanchApp

> **Jugá más, buscá menos.**

Sistema full-stack de reservas de canchas deportivas. Los dueños de establecimientos publican sus canchas y horarios; los usuarios buscan por deporte, ciudad y fecha, y reservan su turno. Backend en **Spring Boot**, frontend en **React**, base de datos **PostgreSQL**.

🌐 **Demo en producción:** [canch-app.vercel.app](https://canch-app.vercel.app/)

> ⏳ El backend corre en un host gratuito que se duerme con la inactividad: la primera request puede tardar más de un minuto. Ver [Despliegue](#️-despliegue).

---

## ✨ Funcionalidades

**Para jugadores (USER)**
- 🔎 Búsqueda de canchas por deporte, ciudad y fecha
- 📅 Reserva de turnos según la disponibilidad real de cada cancha
- ⭐ Calificaciones y opiniones de establecimientos
- ❤️ Establecimientos favoritos
- 🗺️ Ubicación en mapa (Leaflet) y botones para compartir / contactar por WhatsApp
- 📧 Emails de bienvenida y de confirmación / cancelación de reservas

**Para dueños (OWNER)**
- 🏢 Alta de establecimientos y canchas mediante formularios paso a paso
- 🖼️ Carga de fotos (Cloudinary)
- 🕒 Configuración de disponibilidad por día de la semana y generación de turnos por rango de fechas
- ✅ Gestión de reservas: confirmar o cancelar

**Para administradores (ADMIN)**
- 👥 Gestión de usuarios
- ⚽ Gestión de deportes, políticas y características (amenities)
- 🏢 Activar / desactivar establecimientos

**Técnicas**
- 🔐 Autenticación JWT con **access + refresh token**
- 👮 Autorización por roles con Spring Security (`@PreAuthorize`)
- ⏱️ Tarea programada que marca como *cumplidas* las reservas confirmadas ya vencidas (cada 30 minutos)
- 📄 API documentada con Swagger / OpenAPI
- 🧪 Tests con JUnit (controladores y servicios)

---

## ☁️ Despliegue

| Componente    | Plataforma | Detalle                |
| ------------- | ---------- | ---------------------- |
| Frontend      | **Vercel** | React + Vite (SPA)     |
| Backend (API) | **Render** | Spring Boot en Docker  |
| Base de datos | **Neon**   | PostgreSQL serverless  |

```
Usuario ──▶ Vercel (React) ──▶ Render (Spring Boot) ──▶ Neon (PostgreSQL)
                                      │
                                      ├──▶ Cloudinary (imágenes)
                                      └──▶ SMTP / Gmail (emails)
```

> ⏳ **Importante:** el backend está en un plan gratuito de Render, que se "duerme" tras un período de inactividad. Por eso **la primera request (por ejemplo, el primer login o la carga inicial de canchas) puede tardar más de un minuto** en responder. Una vez que despierta, la app funciona con normalidad. La base en Neon (plan gratuito) también puede tardar unos segundos en reactivarse.

> 🔄 El proyecto empezó con **MySQL** y fue migrado a **PostgreSQL**.

---

## 🛠️ Stack tecnológico

| Capa           | Tecnologías |
| -------------- | ----------- |
| **Backend**    | Java 17+ (la imagen Docker usa JDK 21), Spring Boot 3.5, Spring Security, Spring Data JPA / Hibernate, JJWT, Thymeleaf + JavaMail, springdoc-openapi, Lombok, Maven |
| **Frontend**   | React 19, Vite 7, React Router 7, Axios, Material UI, Leaflet / React-Leaflet, SweetAlert2, dayjs, react-datepicker, react-calendar |
| **Base de datos** | PostgreSQL 16 (Neon en producción) |
| **Servicios externos** | Cloudinary (imágenes), Gmail SMTP (emails) |
| **Infra**      | Docker, Docker Compose, Nginx (sirve el frontend en el contenedor) |

---

## 📁 Estructura del proyecto

```
CanchApp/
├── backend/
│   ├── src/main/java/com/joaquin/CanchApp/
│   │   ├── auth/            # login, registro, refresh, JWT
│   │   ├── configuration/   # Security, CORS, Swagger
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── entity/
│   │   ├── exception/
│   │   ├── mapper/
│   │   ├── repository/
│   │   └── service/         # incluye job/ (tareas programadas)
│   ├── src/main/resources/application.properties
│   ├── src/test/
│   ├── pom.xml
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── Component/       # componentes reutilizables
│   │   ├── context/         # Auth, Loading, Establecimientos, Axios
│   │   ├── hooks/
│   │   ├── pages/           # pantallas (y pasos de los formularios)
│   │   └── data/
│   ├── public/
│   ├── vercel.json          # rewrite de la SPA hacia index.html
│   └── Dockerfile
│
├── docker-compose.yml
├── CanchApp.sql             # dump de PostgreSQL: esquema + datos de ejemplo
└── README.md
```

---

## 🚀 Ejecutar con Docker

### Requisitos
- Docker y Docker Compose

### 1️⃣ Clonar

```bash
git clone https://github.com/JoaquinMorillas/CanchApp.git
cd CanchApp
```

### 2️⃣ Crear el `.env` en la raíz

```env
# Base de datos (el host "postgres" es el servicio de docker-compose)
DB_URL=jdbc:postgresql://postgres:5432/canchapp_db
DB_USER=canchapp
DB_PASSWORD=cambiar_esta_password

# JWT
JWT_SECRET=una_clave_larga_y_aleatoria
JWT_ACCESS_EXPIRATION=900000        # 15 minutos
JWT_REFRESH_EXPIRATION=604800000    # 7 días

# Cloudinary
CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>

# Email (SMTP)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=tu_correo@gmail.com
MAIL_PASSWORD=tu_app_password
MAIL_PROTOCOL=smtp
MAIL_AUTH=true
MAIL_STARTTLS_ENABLE=true
MAIL_STARTTLS_REQUIRED=true

# URLs
FRONTEND_URL=http://localhost:5173
VITE_API_URL=http://localhost:8080
```

> ⚠️ El `.env` está en el `.gitignore`; no lo subas al repositorio.

### 3️⃣ Crear `frontend/nginx.conf`

El `Dockerfile` del frontend copia un `nginx.conf` que **no está versionado** (está en el `.gitignore`), así que hay que crearlo antes de construir la imagen:

```nginx
server {
  listen 80;
  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri /index.html;   # necesario para las rutas de React Router
  }
}
```

### 4️⃣ Levantar

```bash
docker compose up --build
```

| Servicio    | URL                                                                                        |
| ----------- | ------------------------------------------------------------------------------------------ |
| Frontend    | [http://localhost:5173](http://localhost:5173)                                             |
| Backend API | [http://localhost:8080](http://localhost:8080)                                             |
| Swagger UI  | [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html) |
| PostgreSQL  | `localhost:5433`                                                                           |

### Contenedores

| Contenedor          | Descripción                                      |
| ------------------- | ------------------------------------------------ |
| `canchapp-frontend` | Build de Vite servido por Nginx                  |
| `canchapp-backend`  | API Spring Boot                                  |
| `canchapp-db`       | PostgreSQL 16, con volumen persistente `pg_data` |

La primera vez que se crea el volumen, PostgreSQL carga automáticamente `CanchApp.sql` (esquema y datos de ejemplo) gracias a este montaje del servicio `postgres` en `docker-compose.yml`:

```yaml
volumes:
  - pg_data:/var/lib/postgresql/data
  - ./CanchApp.sql:/docker-entrypoint-initdb.d/init.sql
```

> Si querés reiniciar la base desde cero (volver a cargar el dump): `docker compose down -v && docker compose up --build`.

---

## 🐘 Base de datos

PostgreSQL en producción (Neon) y en local (contenedor Docker).

**Esquema y datos iniciales.** `CanchApp.sql` es un dump de PostgreSQL con el esquema completo y datos de ejemplo (usuarios, establecimientos, canchas, disponibilidad y reservas). Es la fuente del esquema: el backend corre con `spring.jpa.hibernate.ddl-auto=${DDL_AUTO:validate}`, es decir, **solo valida** que las tablas coincidan con las entidades y no las modifica.

> Si en algún momento necesitás que Hibernate cree las tablas sobre una base vacía, arrancá el backend con `DDL_AUTO=update`.

### Cargar el dump manualmente

```bash
psql "postgresql://<usuario>:<password>@<host>:<puerto>/<db>" -f CanchApp.sql
```

(Para una base local de Docker: `localhost:5433`. Para Neon, agregá `?sslmode=require`.)

### Regenerar el dump

```bash
pg_dump "<connection-string>" --no-owner --no-privileges --clean --if-exists -f CanchApp.sql
```

### Conectarse a Neon

Neon exige SSL:

```env
DB_URL=jdbc:postgresql://<host-de-neon>/<nombre_db>?sslmode=require
DB_USER=<usuario_neon>
DB_PASSWORD=<password_neon>
```

Los datos de conexión están en el panel de tu proyecto en Neon.

---

## 🧪 Probar la aplicación y los roles

Todo usuario nuevo se registra con rol **USER**.

- **Rol USER (jugador):** podés probarlo directamente en la [demo en vivo](https://canch-app.vercel.app/): registrate, buscá canchas y reservá.
- **Roles OWNER y ADMIN (panel de administración):** si ejecutás el proyecto en local, registrá un usuario desde la app y luego cambiale el rol directamente en la base de datos (por ejemplo desde el SQL Editor de Neon o con `psql`):

```sql
UPDATE users SET role = 'OWNER' WHERE email = 'tu_correo@ejemplo.com';   -- dueño de establecimientos
UPDATE users SET role = 'ADMIN' WHERE email = 'tu_correo@ejemplo.com';   -- administrador
```

Cerrá sesión y volvé a ingresar para que el nuevo rol se aplique en el token.

---

## 🔐 Autenticación

| Endpoint             | Descripción                         |
| -------------------- | ----------------------------------- |
| `POST /auth/register`| Registro (envía email de bienvenida)|
| `POST /auth/login`   | Devuelve `accessToken` y `refreshToken` |
| `POST /auth/refresh` | Renueva el access token             |

Las requests autenticadas llevan el header:

```http
Authorization: Bearer <accessToken>
```

El frontend guarda el token y lo renueva automáticamente con un interceptor de Axios cuando expira.

---

## 📌 API: endpoints principales

Todos los `GET` de consulta (establecimientos, canchas, deportes, disponibilidad, reservas, direcciones, políticas y calificaciones) son públicos; el resto de los métodos requieren token. La referencia completa está en Swagger.

| Recurso | Endpoints destacados | Acceso |
| ------- | -------------------- | ------ |
| **Auth** | `POST /auth/register`, `/auth/login`, `/auth/refresh` | Público |
| **Establecimientos** `/stablishment` | `GET /all`, `/{id}`, `/city/{city}`, `/sport/{sport}`, `/name/{name}`, `/user/{id}` | Público |
| | `POST /save`, `PUT /update/{id}` | ADMIN / OWNER |
| | `PUT /delete/{id}`, `PUT /activate/{id}` | ADMIN |
| **Canchas** `/sport_field` | `GET /all`, `/{id}`, `/find?city=&sport=`, `/stablishment/{id}` | Público |
| | `POST /save`, `PUT /update/{id}`, `/delete/{id}`, `/restore/{id}` | ADMIN / OWNER |
| **Disponibilidad** `/availability` | `GET /{id}`, `/sportField/{id}` | Público |
| | `POST /save`, `PUT /update/{id}`, `DELETE /delete/{id}` | ADMIN / OWNER |
| **Reservas** `/reservation` | `GET /sport-field/{id}/slots?date=` (turnos libres) | Público |
| | `POST /generate-slots` (turnos por rango de fechas) | ADMIN / OWNER |
| | `GET /user/{id}`, `PUT /cancel/{id}`, `PUT /confirm/{id}` | Autenticado |
| **Usuarios** `/user` | `GET /all`, `/{id}`, `/owners`; `PUT /update/{id}` | ADMIN o el propio usuario |
| | `POST /{userId}/favorites/{stablishmentId}` (y `/favorites/delete/...`) | Autenticado |
| **Calificaciones** `/rating` | `POST /rate/{stablishmentId}` | Autenticado |
| **Deportes** `/sport` | `GET` | Público |
| | `POST /save`, `PUT /update/{id}`, `DELETE /delete/{id}` | ADMIN |
| **Amenities** `/amenity` | `GET /all` | Público |
| | `POST /save`, `/update`, `DELETE /delete/{name}` | ADMIN |
| **Imágenes** `/images` | `POST /upload`, `DELETE /delete/{publicId}` | ADMIN / OWNER |

---

## 🖥️ Rutas del frontend

| Ruta | Pantalla | Acceso |
| ---- | -------- | ------ |
| `/` | Inicio (buscador, categorías, recomendados) | Público |
| `/login`, `/register` | Ingreso y registro | Público |
| `/establecimientos/buscar/:sport` | Establecimientos por deporte | Público |
| `/establecimientos/:id` | Detalle del establecimiento | Público |
| `/canchas/reservar/:sport/:city/:date` | Turnos por deporte, ciudad y fecha | Público |
| `/establecimientos/:id/:sport/reservar` | Reservar en un establecimiento | Autenticado |
| `/perfil` | Perfil, reservas y favoritos | Autenticado |
| `/administracion/**` | Panel: establecimientos, canchas, disponibilidad, reservas | ADMIN / OWNER |
| `/administracion/usuarios`, `deportes`, `politicas`, `caracteristicas` | Gestión global | ADMIN |

---

## ⚙️ Desarrollo local sin Docker

Requisitos: **JDK 17+**, **Node.js 20+** y una base PostgreSQL accesible.

### Backend

El backend lee variables de entorno y, además, un archivo `.env` (en la raíz del repo, en `backend/` o un nivel arriba del directorio de ejecución). Podés reutilizar el `.env` de arriba, apuntando a tu Postgres:

```env
DB_URL=jdbc:postgresql://localhost:5433/canchapp_db   # o tu URL de Neon
```

Si usás una base nueva, cargá primero `CanchApp.sql` (ver sección Base de datos).

```bash
cd backend
./mvnw spring-boot:run
```

Tests:

```bash
./mvnw test
```

### Frontend

Creá `frontend/.env`:

```env
VITE_API_URL=http://localhost:8080
```

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

---

## 🚢 Guía de despliegue

### 1. Base de datos — Neon
1. Crear un proyecto y una base en [Neon](https://neon.tech).
2. Copiar host, usuario y contraseña.
3. Restaurar el esquema y los datos iniciales:
   ```bash
   psql "postgresql://<usuario>:<password>@<host-de-neon>/<db>?sslmode=require" -f CanchApp.sql
   ```

### 2. Backend — Render
1. Crear un **Web Service** con la carpeta `backend` (usa su `Dockerfile`). Render inyecta el puerto en `PORT`, que la app ya respeta.
2. Variables de entorno:

| Variable | Valor |
| -------- | ----- |
| `DB_URL`, `DB_USER`, `DB_PASSWORD` | Datos de Neon (con `?sslmode=require`) |
| `JWT_SECRET` | Clave larga y aleatoria |
| `CLOUDINARY_URL` | URL de Cloudinary |
| `MAIL_USERNAME`, `MAIL_PASSWORD` | Cuenta SMTP (Gmail con *app password*) |
| `FRONTEND_URL` | `https://canch-app.vercel.app` (se usa para **CORS**) |

### 3. Frontend — Vercel
1. Importar el repo con **Root Directory** = `frontend`.
2. Variable `VITE_API_URL` = URL pública del backend en Render.
3. `vercel.json` ya redirige todas las rutas a `index.html` para que funcione React Router.

---

## 🧠 Aspectos técnicos destacados

- Autenticación JWT stateless con refresh token y renovación automática en el cliente
- Autorización por roles (`ROLE_USER`, `ROLE_OWNER`, `ROLE_ADMIN`) en backend (`@PreAuthorize`) y rutas protegidas en frontend
- Arquitectura en capas: controller → service → repository, con DTOs y mappers
- Excepciones de dominio centralizadas en un manejador global
- Generación de turnos (*slots*) a partir de la disponibilidad semanal de cada cancha
- Tarea programada (`@Scheduled`) para el cierre automático de reservas
- Configuración 100 % por variables de entorno

---

## 🚀 Mejoras futuras

- Pipeline de CI/CD
- Más tests (integración y frontend)
- Migraciones con Flyway o Liquibase (reemplazar `ddl-auto`)
- Pagos online de reservas
- Monitoreo y logging

---

## 👨‍💻 Autor

**Joaquín Morillas**

- GitHub: [JoaquinMorillas](https://github.com/JoaquinMorillas)
- LinkedIn: [Joaquín Morillas](https://www.linkedin.com/in/joaquin-morillas-7b97b1254)

---

## 📄 Licencia

Proyecto educativo / de portafolio.

---

# 📄 License

Educational / Portfolio Project
