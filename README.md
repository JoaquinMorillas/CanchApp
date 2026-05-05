# 🏟️ CanchApp

**Full-stack sports field reservation system** with **JWT authentication**, **role-based access control (ADMIN / OWNER / USER)**, and **REST API documentation via Swagger**.

---

## ✨ Key Features

- 🔐 JWT authentication (**access + refresh tokens**)  
- 👥 Role-based authorization (**ADMIN / OWNER / USER**)  
- 📅 Reservation system with availability management  
- 🏟️ Sports field (courts) management  
- 📄 Interactive API documentation (**Swagger**)  
- ☁️ Image upload integration (**Cloudinary**)  
- 📧 Email notifications (SMTP)  
- 🧱 Layered architecture (Controller → Service → Repository)  

---

## 🛠️ Tech Stack

### Backend
- Java + Spring Boot  
- Spring Security  
- JPA / Hibernate  
- MySQL  

### Frontend
- React (Vite)  
- React Router DOM  
- Context API  
- Bootstrap  

### Other
- Swagger (OpenAPI)  
- Cloudinary  
- JavaMail (SMTP)  

---

## ⚡ Quick Start

```bash
git clone https://github.com/JoaquinMorillas/canchapp.git
cd canchapp
```


▶ Run Backend
```bash
cd backend
./mvnw spring-boot:run
```
Swagger UI:
http://localhost:8080/swagger-ui/index.html


▶ Run Frontend
```bash
cd frontend
npm install
npm run dev
```
App:
http://localhost:5173

## 🧪 Test Users
| Role  | Email                                               | Password |
| ----- | --------------------------------------------------- | -------- |
| ADMIN | [joaquin@morillas.com](mailto:joaquin@morillas.com) | hola     |
| OWNER | [juan@perez.com](mailto:juan@perez.com)             | hola     |
| USER  | [ana@garcia.com](mailto:ana@garcia.com)             | hola     |


## 🔐 Authentication Flow
```bash
Register or login via /auth/login
Receive accessToken and refreshToken
Use access token in requests:
Authorization: Bearer <accessToken>
Refresh token when expired via /auth/refresh
```

## 📌 Main Endpoints
| Method | Endpoint       | Description        | Access |
| ------ | -------------- | ------------------ | ------ |
| POST   | /auth/register | Register user      | Public |
| POST   | /auth/login    | Login              | Public |
| POST   | /auth/refresh  | Refresh token      | USER   |
| GET    | /fields        | List sports fields | Public |
| POST   | /fields        | Create field       | OWNER  |
| POST   | /reservations  | Create reservation | USER   |
| GET    | /admin/users   | List users         | ADMIN  |

## 📁 Project Structure
```bash
canchapp/
├── backend/
│   └── src/main/java/...
        ├── auth/
│       ├── configuration/
│       ├── controller/
│       ├── dto/
│       ├── entity/
        ├── exception/
│       ├── mapper/
│       ├── repository/
│       └── service/
│
├── frontend/
│   └── src/
│       ├── components/
        ├── assets/
│       ├── context/
│       ├── data/
│       └── pages/
│
└── canchapp_db.sql
```

## ⚙️ Configuration

Create application.properties in:

backend/src/main/resources/

Example:
```bash
spring.datasource.url=jdbc:mysql://localhost:3306/canchapp
spring.datasource.username=root
spring.datasource.password=1234

jwt.secret=your_secret_key

Create database:

CREATE DATABASE canchapp;

Import data:

mysql -u root -p canchapp < canchapp_db.sql

```

## 🧠 Technical Highlights
Stateless authentication using JWT
Separation of concerns via layered architecture
DTO pattern to avoid exposing entities
Role-based authorization with Spring Security
RESTful API design

## 🚀 Future Improvements
Deployment (Render / AWS / Railway)
Unit & integration testing
Pagination & filtering
UI/UX improvements
Admin dashboard enhancements

## 👨‍💻 Author

Joaquín Morillas

GitHub: https://github.com/JoaquinMorillas
LinkedIn: https://www.linkedin.com/in/joaquin-morillas-7b97b1254/
## 📄 License

Educational / portfolio project
