# 🏟️ CanchApp

**Full-stack sports field reservation system** built with **Spring Boot + React**, featuring **JWT authentication**, **role-based authorization**, **Dockerized infrastructure**, and **REST API documentation with Swagger**.

---

# ✨ Features

- 🔐 JWT Authentication (**Access + Refresh Tokens**)
- 👥 Role-Based Access Control (**ADMIN / OWNER / USER**)
- 📅 Reservation & Availability Management
- 🏟️ Sports Fields Administration
- 📄 Swagger/OpenAPI Documentation
- ☁️ Cloudinary Image Uploads
- 📧 Email Notifications (SMTP)
- 🐳 Fully Dockerized Architecture
- 🧱 Layered Backend Architecture

---

# 🛠️ Tech Stack

## Backend
- Java 21
- Spring Boot
- Spring Security
- Hibernate / JPA
- MySQL
- JWT Authentication

## Frontend
- React
- Vite
- React Router DOM
- Context API
- Bootstrap

## DevOps & Infrastructure
- Docker
- Docker Compose

## Other Tools
- Swagger / OpenAPI
- Cloudinary
- JavaMail SMTP

---

# 📁 Project Structure

```plaintext
canchapp/
├── backend/
│   ├── src/main/java/
│   │   ├── auth/
│   │   ├── configuration/
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── entity/
│   │   ├── exception/
│   │   ├── mapper/
│   │   ├── repository/
│   │   └── service/
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
│   │   └── pages/
│   └── Dockerfile
│
├── docker-compose.yml
├── CanchApp.sql
└── README.md
```

---

# 🚀 Running the Project with Docker

## 1️⃣ Clone Repository

```bash
git clone https://github.com/JoaquinMorillas/canchapp.git
cd canchapp
```

---

## 2️⃣ Configure Environment Variables

Create a `.env` file in the root directory:

```env
DB_URL=jdbc:mysql://mysql:3306/canchapp_db
DB_USER=root
DB_PASSWORD=root
```

---

## 3️⃣ Run Containers

```bash
docker compose up --build
```

---

# 🌐 Application URLs

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8080 |
| Swagger UI | http://localhost:8080/swagger-ui/index.html |
| MySQL | localhost:3307 |

---

# 🐳 Docker Architecture

The application runs with 3 containers:

| Container | Description |
|---|---|
| `canchapp-frontend` | React + Vite frontend |
| `canchapp-backend` | Spring Boot API |
| `canchapp-db` | MySQL database |

The database uses a persistent Docker volume:

```yaml
volumes:
  - mysql_data:/var/lib/mysql
```

This means data persists between container restarts.

---

# 💾 Database Initialization

On first startup:

- MySQL creates the database automatically
- `CanchApp.sql` initializes:
  - tables
  - relationships
  - seed data
  - test users

---

# 🧪 Test Users

| Role | Email | Password |
|---|---|---|
| ADMIN | joaquin@morillas.com | hola |
| OWNER | juan@perez.com | hola |
| USER | ana@garcia.com | hola |

---

# 🔐 Authentication Flow

## Login

```http
POST /auth/login
```

Response:

```json
{
  "accessToken": "jwt_access_token",
  "refreshToken": "jwt_refresh_token"
}
```

---

## Authenticated Requests

```http
Authorization: Bearer <accessToken>
```

---

## Refresh Token

```http
POST /auth/refresh
```

---

# 📌 Main Endpoints

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/auth/register` | Register user | Public |
| POST | `/auth/login` | Login | Public |
| POST | `/auth/refresh` | Refresh JWT token | USER |
| GET | `/fields` | Get sports fields | Public |
| POST | `/fields` | Create sports field | OWNER |
| POST | `/reservations` | Create reservation | USER |
| GET | `/admin/users` | List users | ADMIN |

---

# ⚙️ Local Development Without Docker

## Backend

```bash
cd backend
./mvnw spring-boot:run
```

---

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# ⚙️ application.properties Example

Create:

```plaintext
backend/src/main/resources/application.properties
```

Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/canchapp
spring.datasource.username=root
spring.datasource.password=1234

jwt.secret=your_secret_key
```

---

# 🧠 Technical Highlights

- Stateless JWT Authentication
- Refresh Token Mechanism
- Layered Architecture
- DTO Pattern
- RESTful API Design
- Spring Security Role Authorization
- Persistent Docker Volumes
- Multi-Container Docker Architecture
- Environment-Based Configuration

---

# 🚀 Future Improvements

- CI/CD Pipeline
- Unit & Integration Testing
- AWS Deployment
- NGINX Reverse Proxy
- Kubernetes Deployment
- Redis Caching
- Monitoring & Logging

---

# 👨‍💻 Author

**Joaquín Morillas**

GitHub:  
[JoaquinMorillas GitHub](https://github.com/JoaquinMorillas)

LinkedIn:  
[Joaquín Morillas LinkedIn](https://www.linkedin.com/in/joaquin-morillas-7b97b1254)

---

# 📄 License

Educational / Portfolio Project
