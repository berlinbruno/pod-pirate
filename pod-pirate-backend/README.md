# 🎙️ Pod Pirate - Backend API

[![Java](https://img.shields.io/badge/Java-21-blue.svg)](https://openjdk.java.net/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.1-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-green.svg)](https://www.mongodb.com/)
[![Azure](https://img.shields.io/badge/Azure-Cloud%20Storage-0078D4.svg)](https://azure.microsoft.com/)

> Production-ready REST API for podcast platform built with Java and Spring Boot.

*Part of the [Pod Pirate](../README.md) full-stack podcast platform. See [Frontend](../pod-pirate-frontend/README.md) for the web application.*

## ✨ Features

### Authentication & Security
- 🔐 **JWT Authentication** - Access and refresh tokens with rotation
- 📧 **Email Verification** - Secure user registration flow
- 🔑 **Password Management** - Change and reset with email tokens
- 🛡️ **Role-Based Access** - Admin, Creator, and Listener roles
- 🌐 **CORS Configuration** - Secure cross-origin requests

### User Management
- 👤 **Profile Management** - Update user information
- 🖼️ **Profile Images** - Upload to Azure Blob Storage
- 🗑️ **Account Deletion** - Cascade cleanup of user data
- 🎭 **Role Management** - Admin-controlled user roles

### Podcast Management
- 🎙️ **Podcast CRUD** - Create, read, update, delete operations
- 📸 **Cover Images** - Upload podcast artwork
- 📝 **Metadata** - Rich podcast information
- 🔒 **Creator Control** - Podcast ownership and permissions
- 🌍 **Public Discovery** - Browse published podcasts

### Episode Management
- 📻 **Episode CRUD** - Full episode lifecycle management
- 🎵 **Audio Upload** - Support for files up to 1GB
- 🖼️ **Episode Images** - Custom episode artwork
- ⏱️ **Secure URLs** - Time-limited SAS tokens for uploads
- 📊 **Metadata** - Episode details and show notes

### Admin Features
- 👥 **User Management** - Admin dashboard for user oversight
- 🎯 **Content Moderation** - Review and manage content
- 📊 **System Monitoring** - Health checks and actuator endpoints

### Media Storage
- ☁️ **Azure Integration** - Blob Storage for media files
- 🔐 **SAS Tokens** - Secure, time-limited access
- 📤 **Large Files** - Support up to 1GB uploads
- 🔗 **CDN Ready** - Optimized for content delivery

## 🛠️ Tech Stack

**Core Framework**
- Java 21
- Spring Boot 3.4.1
- Spring Security
- Spring Data MongoDB

**Database & Storage**
- MongoDB - NoSQL database
- Azure Blob Storage - Media file storage

**Security**
- JWT (jjwt 0.12.3) - Token authentication
- Spring Security - Authorization

**API & Documentation**
- SpringDoc OpenAPI 2.3.0 - Swagger UI
- Spring Validation - Request validation

**Additional**
- Lombok - Boilerplate reduction
- Spring Boot Actuator - Health monitoring
- Spring Mail - Email service
- Spring Retry - Resilience
- Maven - Build automation

## � Quick Start

### Prerequisites
- Java Development Kit (JDK) 21 or higher
- Maven 3.8+ (or use included wrapper)
- MongoDB 6.0+ (local or Atlas cluster)
- Azure Storage Account
- SMTP server access (for emails)

### Installation

1. **Install dependencies**
   ```bash
   cd pod-pirate-backend
   ./mvnw clean install
   ```

2. **Set up environment variables**
   
   Create environment variables or add to your IDE configuration:
   ```bash
   # MongoDB
   MONGODB_URI=mongodb://localhost:27017/podpirate
   # Or MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/podpirate

   # Azure Storage
   AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=...
   AZURE_STORAGE_CONTAINER_NAME=podcasts

   # Email Configuration
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-app-password

   # CORS
   ALLOWED_ORIGINS=http://localhost:3000

   # Frontend URL
   FRONTEND_BASE_URL=http://localhost:3000

   # Admin
   ADMIN_EMAIL=admin@podpirate.com

   # JWT Secret (generate with: openssl rand -base64 32)
   JWT_SECRET=your-super-secret-256-bit-key
   ```

3. **Run the application**
   ```bash
   ./mvnw spring-boot:run
   ```

4. **Access the API**
   - API: http://localhost:8080
   - Swagger UI: http://localhost:8080/swagger-ui.html
   - Health Check: http://localhost:8080/actuator/health

## � Available Commands

```bash
# Development
./mvnw spring-boot:run              # Run in development mode
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev  # Run with dev profile

# Build
./mvnw clean install                # Build and install
./mvnw clean package                # Build JAR
./mvnw clean package -DskipTests    # Build without tests

# Testing
./mvnw test                         # Run all tests
./mvnw test -Dtest=ClassName        # Run specific test
./mvnw clean test jacoco:report     # Run tests with coverage

# Code Quality
./mvnw verify                       # Run verification
./mvnw clean                        # Clean build artifacts
```

## 📚 API Documentation

Once the application is running, access the interactive API documentation:

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/v3/api-docs

**Main Endpoint Groups:**
- `/api/auth` - Authentication (register, login, refresh, password reset)
- `/api/me` - User profile and content management
- `/api/me/podcasts` - User's podcast management
- `/api/me/podcasts/{id}/episodes` - Episode management
- `/api/public` - Public content browsing
- `/api/admin` - Admin operations
- `/actuator` - Health checks and monitoring

## 📁 Project Structure

```
pod-pirate-backend/
├── src/
│   ├── main/
│   │   ├── java/dev/berlinbruno/PodPirateBackendApplication/
│   │   │   ├── config/              # Configuration classes
│   │   │   │   ├── CorsConfig.java
│   │   │   │   ├── SecurityConfig.java
│   │   │   │   ├── JWTAuthFilter.java
│   │   │   │   └── OpenApiConfig.java
│   │   │   ├── controller/          # REST controllers
│   │   │   │   ├── AuthController.java
│   │   │   │   ├── MeController.java
│   │   │   │   ├── PublicController.java
│   │   │   │   └── AdminController.java
│   │   │   ├── dto/                 # Data Transfer Objects
│   │   │   │   ├── auth/
│   │   │   │   ├── podcast/
│   │   │   │   ├── episode/
│   │   │   │   └── appuser/
│   │   │   ├── model/               # Domain models
│   │   │   │   ├── AppUser.java
│   │   │   │   ├── Podcast.java
│   │   │   │   └── Episode.java
│   │   │   ├── repository/          # MongoDB repositories
│   │   │   ├── service/             # Business logic
│   │   │   ├── exception/           # Custom exceptions
│   │   │   ├── validation/          # Custom validators
│   │   │   ├── utils/               # Utility classes
│   │   │   ├── types/               # Enums and types
│   │   │   ├── constants/           # Application constants
│   │   │   └── properties/          # Configuration properties
│   │   └── resources/
│   │       └── application.yaml     # Application configuration
│   └── test/                        # Test classes
├── pom.xml                          # Maven dependencies
├── mvnw, mvnw.cmd                   # Maven wrapper
└── README.md                        # This file
```

## 🔧 Environment Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/podpirate` | Yes |
| `AZURE_STORAGE_CONNECTION_STRING` | Azure Blob Storage connection | `DefaultEndpointsProtocol=https;...` | Yes |
| `AZURE_STORAGE_CONTAINER_NAME` | Azure container name | `podcasts` | Yes |
| `SMTP_USER` | SMTP email username | `noreply@podpirate.com` | Yes |
| `SMTP_PASSWORD` | SMTP email password | `app-password` | Yes |
| `ALLOWED_ORIGINS` | CORS allowed origins | `http://localhost:3000` | Yes |
| `FRONTEND_BASE_URL` | Frontend application URL | `http://localhost:3000` | Yes |
| `ADMIN_EMAIL` | Admin user email | `admin@podpirate.com` | Yes |
| `JWT_SECRET` | JWT signing secret (256-bit) | Generate with `openssl rand -base64 32` | Yes |

## 🧪 Testing

```bash
# Run all tests
./mvnw test

# Run specific test class
./mvnw test -Dtest=AuthControllerTests

# Run tests with coverage report
./mvnw clean test jacoco:report

# Skip tests during build
./mvnw clean package -DskipTests
```

## � Related

- [Main README](../README.md) - Full project documentation
- [Frontend](../pod-pirate-frontend/README.md) - Next.js web application
