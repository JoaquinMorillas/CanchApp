# 🏟️ CanchApp 
–  

Sports Field Reservation System CanchApp is a **full-stack web application** that allows users to search, view, and reserve sports fields by city, sport, and date. It’s built with **React (Vite)** on the frontend and **Spring Boot** on the backend. 
--- 
## 🚀 Tech Stack 
- **Frontend**: React, Vite, React Router DOM, Context API, Bootstrap, SweetAlert -
- **Backend**: Spring Boot, Hibernate, JPA -
- **Data Base**: MySQL 
--- 
## 📂 Project Structure
```plaintext
canchapp/
├── backend/ # Spring Boot application
│ └── src/
|── frontend/ # React + Vite application
|   └── src/
└──CanchApp.sql # contains schema and initial data
```
## ⚙️ Installation & Running Locally 
### 🔹 1. Clone the repository
```bash
git clone https://github.com/<your-username>/canchapp.git
cd canchapp
```
 ### 🔹2. Run the Backend (Spring Boot)
```bash
cd backend
./mvnw spring-boot:run   # Linux/Mac
mvnw spring-boot:run     # Windows
```
Server runs at: http://localhost:8080 Swagger/OpenAPI docs: http://localhost:8080/swagger-ui.html 

### 🔹 2.1 Configure database and properties The project includes a **template** application.properties with placeholders:
```properties

spring.application.name=CanchApp
spring.datasource.url={YourMySQLUrl}
spring.datasource.username={YourUserName}
spring.datasource.password={YourPassword}

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

cloudinary.url={YourCloudinaryUrl}

logging.level.org.springdoc=DEBUG
logging.level.org.springdoc.api=DEBUG
logging.level.org.springdoc.core=DEBUG

jwt.secret = {YourBase64Secret}
#15 minutes:
jwt.access.expiration = 900000
#7 days= 
jwt.refresh.expiration = 604800000

spring.mail.host = smtp.gmail.com
spring.mail.port = 587
spring.mail.username = {YourGmailUsername}
spring.mail.password = {YourGmailAppPassword}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
spring.mail.protocol=smtp
```

Copy this file into src/main/resources/application.properties. 
Replace the placeholders with your own credentials (do not commit the real values). 

Example for MySQL on localhost:

```properties

spring.datasource.url=jdbc:mysql://localhost:3306/canchapp?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=1234
```
Create the database:

```sql

CREATE DATABASE canchapp;
Import the SQL script provided in the repo (canchapp_db.sql) to create tables and populate data:
```
```bash

mysql -u your_user -p canchapp < canchapp_db.sql
```
Or run it directly from your SQL client. 
### 🔹 3. Run the Frontend (React + Vite) Open a new terminal:
```bash

cd frontend
npm install
npm run dev
```
App runs at: http://localhost:5173 To enter the Adim panel go to: http://localhost:5173/administracion
# 🔐 Authentication & JWT

The backend implements **JWT-based authentication** with **access** and **refresh tokens**.  
Users register and log in via API or the frontend, then use the provided tokens to access protected resources.

---

## 🔹 Registration Endpoint
```http
POST /auth/register
```
**Body example:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

---

## 🔹 Login Endpoint
```http
POST /auth/login
```
**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 🔹 Token Usage
Include the `accessToken` in the Authorization header for any protected request:
```
Authorization: Bearer <accessToken>
```

Access tokens have a short lifetime. When expired, request a new one using your refresh token.

---

## 🔹 Refresh Token Endpoint
```http
POST /auth/refresh
```
**Body example:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
**Response:**
```json
{
  "accessToken": "newAccessToken",
  "refreshToken": "newRefreshToken"
}
```

The refresh token has a longer lifetime and can be used multiple times until revoked or expired.  
If the refresh token is invalid or expired, the API returns `403 Forbidden`.

---

## 🔹 Protected Routes
Endpoints related to **reservations**, **user profile**, and **admin actions** require a valid JWT.  
Requests with missing or invalid tokens will return `401 Unauthorized`.

## 👨‍💻 Author **Joaquín Morillas** 
[![GitHub](https://img.shields.io/badge/GitHub-000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/JoaquinMorillas) [![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/joaquin-morillas-7b97b1254/)


# 📙 README (Español) 
# 🏟️ CanchApp
– 
Sistema de Reservas de Canchas Deportivas CanchApp es una **aplicación web full stack** que permite a los usuarios buscar, visualizar y reservar canchas deportivas por ciudad, deporte y fecha. 
Está desarrollada con **React (Vite)** en el frontend y **Spring Boot** en el backend. 
--- 
## 🚀 Tecnologías 
- **Frontend**: React, Vite, React Router DOM, Context API, Bootstrap, SweetAlert -
- **Backend**: Spring Boot, Hibernate, JPA -
- **Base de Datos**: MySql --- 
## 📂 Estructura del proyecto
```plaintext
canchapp/
├── backend/ # Spring Boot
│ └── src/
|── frontend/ # React + Vite 
|   └── src/
└──CanchApp.sql # contiene el esquema y datos para iniciar
```
--- 
## ⚙️ Instalación y ejecución local 
### 🔹 1. Clonar el repositorio
```bash
git clone https://github.com/<tu-usuario>/canchapp.git
cd canchapp
```
### 🔹 2. Ejecutar el Backend (Spring Boot)
```bash

cd backend
./mvnw spring-boot:run   # Linux/Mac
mvnw spring-boot:run     # Windows
```
El servidor corre en: http://localhost:8080 Swagger/OpenAPI: http://localhost:8080/swagger-ui.html 
### 🔹 2.1 Configurar base de datos y properties 
El proyecto incluye un **template** application.properties con placeholders:
```properties
spring.application.name=CanchApp

spring.datasource.url={YourMySQLUrl}
spring.datasource.username={YourUserName}
spring.datasource.password={YourPassword}

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

cloudinary.url={YourCloudinaryUrl}

logging.level.org.springdoc=DEBUG
logging.level.org.springdoc.api=DEBUG
logging.level.org.springdoc.core=DEBUG

jwt.secret = {YourBase64Secret}
#15 minutes:
jwt.access.expiration = 900000
#7 days= 
jwt.refresh.expiration = 604800000

spring.mail.host = smtp.gmail.com
spring.mail.port = 587
spring.mail.username = {YourGmailUsername}
spring.mail.password = {YourGmailAppPassword}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
spring.mail.protocol=smtp
```
Copiá este archivo en src/main/resources/application.properties.

Reemplazá los placeholders con tus credenciales reales (⚠️ no subas tus datos al repositorio). 

Ejemplo para MySQL en localhost:
```properties

spring.datasource.url=jdbc:mysql://localhost:3306/canchapp?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=1234
```
Crear la base de datos:
```sql

CREATE DATABASE canchapp;
```
Importar el script SQL que está en el repositorio (canchapp_db.sql) para crear las tablas y poblarlas con datos de prueba:
```bash

mysql -u tu_usuario -p canchapp < canchapp_db.sql
```
O bien, copiar y ejecutar el contenido del archivo directamente desde tu cliente SQL (Workbench, DBeaver, etc.). 

### 🔹 3. Ejecutar el Frontend (React + Vite) En otra terminal:
```bash
cd frontend
npm install
npm run dev
```
La app corre en: http://localhost:5173

## 🔐 Autenticación & JWT

El backend utiliza **autenticación basada en JWT** con **access tokens** y **refresh tokens**.  
Los usuarios pueden registrarse e iniciar sesión desde la API o la interfaz del frontend.  
Luego, los tokens se usan para acceder a rutas protegidas.

---

### 🔹 Endpoint de Registro
```http
POST /auth/register
```
Ejemplo de body:
```json
{
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan@example.com",
  "password": "123456"
}
```
🔹 Endpoint de Login
```http
POST /auth/login
```
Respuesta:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
🔹 Uso del Token

Incluír el accessToken en el encabezado Authorization de cada petición protegida:
```plaintext
Authorization: Bearer <accessToken>
```
El access token tiene una vida corta.
Cuando expira, se puede solicitar uno nuevo utilizando el refresh token.
🔹 Endpoint de Refresh Token
```http
POST /auth/refresh
```
Ejemplo de body:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
Respuesta:
```json
{
  "accessToken": "newAccessToken",
  "refreshToken": "newRefreshToken"
}
```
El refresh token tiene una duración más larga y puede reutilizarse hasta que expire o sea revocado.
Si el refresh token es inválido o expiró, la API responde con 403 Forbidden.
### 🔹 Rutas Protegidas

Las rutas relacionadas con reservas, perfil de usuario y panel de administración requieren un JWT válido.
Si el token falta o es inválido, la API devuelve 401 Unauthorized.
## 👨‍💻 Autor **Joaquín Morillas** 
[![GitHub](https://img.shields.io/badge/GitHub-000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/JoaquinMorillas) [![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/joaquin-morillas-7b97b1254/)
