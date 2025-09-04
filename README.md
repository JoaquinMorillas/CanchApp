# 🏟️ CanchApp – Sports Field Reservation System

CanchApp is a **full-stack web application** that allows users to search, view, and reserve sports fields by city, sport, and date.  
It’s built with **React (Vite)** on the frontend and **Spring Boot** on the backend.

---

## 🚀 Tech Stack
- **Frontend**: React, Vite, React Router DOM, Context API, Bootstrap, SweetAlert  
- **Backend**: Spring Boot, Hibernate, JPA 
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
🔹 2. Run the Backend (Spring Boot)
```bash
cd backend
./mvnw spring-boot:run   # Linux/Mac
mvnw spring-boot:run     # Windows
```
Server runs at: http://localhost:8080
Swagger/OpenAPI docs (if enabled): http://localhost:8080/swagger-ui.html



### 🔹 2.1 Configure database and properties

The project includes a **template** `application.properties` with placeholders:

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
```
Import the SQL script provided in the repo (canchapp_db.sql) to create tables and populate data:

```bash

mysql -u your_user -p canchapp < canchapp_db.sql
```
Or run it directly from your SQL client.

🔹 3. Run the Frontend (React + Vite)
Open a new terminal:

```bash

cd frontend
npm install
npm run dev
```
App runs at: http://localhost:5173




👨‍💻 Author
Joaquín Morillas
🔗 LinkedIn | 🐙 GitHub


# 📙 README (Español)


# 🏟️ CanchApp – Sistema de Reservas de Canchas Deportivas

CanchApp es una **aplicación web full stack** que permite a los usuarios buscar, visualizar y reservar canchas deportivas por ciudad, deporte y fecha.  
Está desarrollada con **React (Vite)** en el frontend y **Spring Boot** en el backend.

---

## 🚀 Tecnologías
- **Frontend**: React, Vite, React Router DOM, Context API, Bootstrap, SweetAlert  
- **Backend**: Spring Boot, Hibernate, JPA 
- **Base de Datos**: MySql

---

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
🔹 2. Ejecutar el Backend (Spring Boot)
```bash

cd backend
./mvnw spring-boot:run   # Linux/Mac
mvnw spring-boot:run     # Windows
```
El servidor corre en: http://localhost:8080

Swagger/OpenAPI: http://localhost:8080/swagger-ui.html

### 🔹 2.1 Configurar base de datos y properties

El proyecto incluye un **template** `application.properties` con placeholders:

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

🔹 3. Ejecutar el Frontend (React + Vite)
En otra terminal:

```bash
cd frontend
npm install
npm run dev
```
La app corre en: http://localhost:5173


👨‍💻 Autor
Joaquín Morillas
🔗 LinkedIn | 🐙 GitHub


---

# 🎨 Color Palette (Sports / Outdoor inspired)


| Purpose        | HEX     | Example Use |
|----------------|---------|-------------|
| **Primary (Blue)**   | `#0d6efd` | Navbar, buttons (main actions) |
| **Success (Green)**  | `#198754` | Confirmation, available fields |
| **Warning (Yellow)** | `#ffc107` | Reservation pending, highlights |
| **Danger (Red)**     | `#dc3545` | Errors, cancellations |
| **Background Light** | `#f8f9fa` | General background |
| **Background Dark**  | `#212529` | Footer / dark sections |

👉 For a **sports vibe**:  
-**blue** for navigation & headers (trustworthy, energetic).  
**green** for "available" / positive states (healthy, outdoor).  
-**yellow** as accent for “attention” or “selected slot”.  
-**red** only for destructive actions or warnings.  
