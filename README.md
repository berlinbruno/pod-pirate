# 🏴‍☠️ Pod Pirate

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-blue.svg)](https://react.dev/)
[![Java](https://img.shields.io/badge/Java-21-blue.svg)](https://openjdk.java.net/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.1-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-green.svg)](https://www.mongodb.com/)
[![Azure](https://img.shields.io/badge/Azure-Cloud%20Storage-0078D4.svg)](https://azure.microsoft.com/)

> Set sail on an audio adventure! Your ultimate destination for discovering, streaming, and managing podcasts.

Pod Pirate is a modern, full-stack podcast platform that combines powerful content creation tools with an elegant listening experience. Whether you're a podcast enthusiast, content creator, or platform administrator, Pod Pirate provides everything you need in one seamless application.

---

## 🌟 Why Pod Pirate?

**For Listeners**
- Stream your favorite podcasts with a beautiful, responsive audio player
- Discover new content through an intuitive browse and search interface
- Enjoy seamless playback with our mini-player that follows you across pages
- Install as a Progressive Web App for offline listening

**For Creators**
- Publish and manage your podcast shows with ease
- Upload episodes with rich metadata and artwork
- Track your content with a dedicated creator dashboard
- Reach your audience with professional-grade tools

**For Administrators**
- Comprehensive user management dashboard
- Content moderation and platform oversight
- System monitoring and health checks
- Role-based access control

---

## ✨ Key Features

### 🎧 Audio Experience
- Advanced audio player with playback controls
- Mini-player mode for continuous listening
- Seamless navigation without interrupting playback
- Support for large audio files (up to 1GB)

### 🔐 Security & Authentication
- Secure JWT-based authentication
- Email verification and password reset
- Role-based access (Listener, Creator, Admin)
- Protected routes and API endpoints

### 🎙️ Content Management
- Create and manage podcast shows
- Upload episodes with metadata and artwork
- Browse and discover public podcasts
- Search and filter capabilities

### 🎨 Modern Interface
- Clean, responsive design
- Dark mode support
- Progressive Web App (PWA) capabilities
- Optimized for mobile and desktop

### ☁️ Cloud Integration
- Azure Blob Storage for media files
- Secure, time-limited upload URLs
- CDN-ready content delivery
- Scalable infrastructure

---

## 🏗️ Architecture

Pod Pirate is built as a full-stack application with a clear separation between frontend and backend:

```
┌─────────────────────────────────────────────┐
│           🏴‍☠️ Pod Pirate Platform           │
└─────────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌──────────────┐          ┌──────────────┐
│   Frontend   │ ◄──────► │   Backend    │
│   Next.js    │   REST   │  Spring Boot │
│   React 19   │   API    │   Java 21    │
│ TypeScript 5 │          │   MongoDB    │
└──────────────┘          └──────────────┘
        │                         │
        │                         ▼
        │                  ┌──────────────┐
        │                  │   Storage    │
        │                  │    Azure     │
        │                  │ Blob Storage │
        │                  └──────────────┘
        │
        ▼
┌──────────────┐
│    Users     │
│  Browsers    │
│   Mobile     │
└──────────────┘
```

**Frontend** - Modern web interface built with Next.js and React  
**Backend** - RESTful API built with Spring Boot and Java  
**Database** - MongoDB for flexible data storage  
**Storage** - Azure Blob Storage for media files  

---

## 🚀 Getting Started

### Quick Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/berlinbruno/pod-pirate.git
   cd pod-pirate
   ```

2. **Set up the Backend**
   ```bash
   cd pod-pirate-backend
   # See pod-pirate-backend/README.md for detailed setup
   ```

3. **Set up the Frontend**
   ```bash
   cd pod-pirate-frontend
   # See pod-pirate-frontend/README.md for detailed setup
   ```

### Prerequisites

- **Node.js** 20.x or higher
- **Java** JDK 21 or higher
- **MongoDB** 6.0+ (local or Atlas)
- **Azure** Storage Account
- **SMTP** server for emails

### Detailed Documentation

- 📱 [Frontend Setup](pod-pirate-frontend/README.md) - Next.js web application
- 🔧 [Backend Setup](pod-pirate-backend/README.md) - Spring Boot API
- 🚀 [Deployment Guide](#deployment) - Production deployment

---

## 🛠️ Technology Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **NextAuth.js** - Authentication
- **shadcn/ui** - UI components

### Backend
- **Java 21** - Modern programming language
- **Spring Boot 3.4** - Application framework
- **MongoDB** - NoSQL database
- **Spring Security** - Authentication & authorization
- **JWT** - Token-based auth
- **Maven** - Build automation

### Infrastructure
- **Azure Blob Storage** - Media file storage
- **SMTP** - Email delivery
- **RESTful API** - Communication protocol

---

## 📦 Project Structure

```
pod-pirate/
├── pod-pirate-frontend/     # Next.js web application
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # React components
│   ├── actions/             # Server actions
│   ├── lib/                 # Utilities and API clients
│   └── package.json
│
├── pod-pirate-backend/      # Spring Boot API
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/        # Java source code
│   │   │   └── resources/   # Configuration files
│   │   └── test/            # Test files
│   └── pom.xml
│
└── README.md                # This file
```

---

## 🔧 Environment Setup

Both applications require environment variables. Create `.env.local` files in respective directories:

**Frontend Environment**
```env
NEXT_BACKEND_URL=http://localhost:8080
NEXTAUTH_URL=http://localhost:3000
AUTH_SECRET=<generate-secret>
NEXT_IMAGES_REMOTE_PATTERN=<azure-hostname>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Backend Environment**
```bash
MONGODB_URI=mongodb://localhost:27017/podpirate
AZURE_STORAGE_CONNECTION_STRING=<azure-connection>
AZURE_STORAGE_CONTAINER_NAME=podcasts
SMTP_USER=<email>
SMTP_PASSWORD=<password>
ALLOWED_ORIGINS=http://localhost:3000
FRONTEND_BASE_URL=http://localhost:3000
ADMIN_EMAIL=<admin-email>
JWT_SECRET=<generate-secret>
```

For detailed configuration, see individual README files in each directory.

---

## 🚀 Deployment

### Deployment Platforms

**Frontend**
- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify
- Azure Static Web Apps

**Backend**
- Azure App Service
- AWS Elastic Beanstalk
- Heroku
- Docker + Kubernetes

---

## 📊 Features Breakdown

| Feature | Frontend | Backend | Status |
|---------|----------|---------|--------|
| User Authentication | ✅ NextAuth.js | ✅ JWT + Spring Security | ✅ Complete |
| Podcast Management | ✅ CRUD UI | ✅ REST API | ✅ Complete |
| Episode Management | ✅ Upload & Browse | ✅ Azure Integration | ✅ Complete |
| Audio Player | ✅ Custom Player | ✅ Secure URLs | ✅ Complete |
| Admin Dashboard | ✅ Admin UI | ✅ Admin Endpoints | ✅ Complete |
| Email Service | ✅ Templates | ✅ SMTP Integration | ✅ Complete |
| PWA Support | ✅ Manifest + SW | N/A | ✅ Complete |
| Dark Mode | ✅ Theme Toggle | N/A | ✅ Complete |

---

## 🎯 Roadmap

- [ ] Advanced analytics dashboard
- [ ] Social features (comments, likes, shares)
- [ ] Playlist creation and management
- [ ] Episode transcripts with search
- [ ] Multi-language support
- [ ] Podcast RSS feed import

---

## 📝 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Berlin Bruno**
- GitHub: [@berlinbruno](https://github.com/berlinbruno)

---

## 📧 Support

For questions or support:
- 📖 Check the [Frontend README](pod-pirate-frontend/README.md)
- 📖 Check the [Backend README](pod-pirate-backend/README.md)
- 🐛 Open an issue on GitHub

---

<div align="center">

**Built with ❤️ using Next.js, React, Spring Boot, and Java**

⭐ Star this repo if you find it useful!

</div>
