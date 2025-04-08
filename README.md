# 🎓 CareerConnect

[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB.svg)](https://reactjs.org/)
[![Node.js Version](https://img.shields.io/badge/Node.js->=14.0.0-339933.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.4+-47A248.svg)](https://www.mongodb.com/)

## 📚 Overview
CareerConnect is a comprehensive placement management system designed to revolutionize the campus recruitment process. Built with modern tech stack, it offers a seamless interface for students, TPOs, management, and administrators.

## 🚀 Key Features

### For Students
- 📝 Smart Profile Management
- 📄 Resume Builder & Manager
- 🎯 Intelligent Job Matching
- 📊 Real-time Application Tracking
- 📅 Interview Scheduler

### For TPO Admins
- 💼 Advanced Job Posting Interface
- 👥 Candidate Management Dashboard
- 📨 Automated Communication System
- 📋 Interview Coordination Tools
- 📬 Offer Letter Management

### For Management
- 📈 Advanced Analytics Dashboard
- 🎯 Placement Performance Metrics
- 📊 Custom Report Generation
- 🔍 Trend Analysis Tools

### For Super Admin
- ⚙️ System Configuration Control
- 👥 User Role Management
- 🔐 Security Settings
- 🔄 System Backup & Restore

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS 3.0, Bootstrap 5
- **State Management**: Context API
- **Routing**: React Router v6
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **File Storage**: Cloudinary
- **API Documentation**: Swagger

## 🔧 Installation & Setup

### Prerequisites
```bash
Node.js >= 14.0.0
MongoDB >= 4.4
npm >= 6.14.0
```

### Quick Start

1. **Clone & Install**
```bash
git clone https://github.com/debashisparidame/CareerConnect.git
cd CareerConnect
```

2. **Backend Setup**
```bash
cd backend
npm install

# Create .env file
echo PORT=4518 >> .env
echo MONGO_URI=your_mongodb_uri >> .env
echo JWT_SECRET=your_secret >> .env
echo CLOUDINARY_CLOUD_NAME=your_cloud_name >> .env
echo CLOUDINARY_API_KEY=your_api_key >> .env
echo CLOUDINARY_API_SECRET=your_api_secret >> .env

# Start Server
npm start
```

3. **Frontend Setup**
```bash
cd frontend
npm install

# Configure Backend URL
# Edit src/config/backend_url.js
# Set BASE_URL = 'http://localhost:4518'

# Start Development Server
npm run dev
```

## 🌐 Environment Configuration

### Backend (.env)
```env
PORT=4518
MONGO_URI=mongodb://localhost:27017/careerconnect
JWT_SECRET=your_secure_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 📦 Project Structure
```plaintext
CareerConnect/
├── frontend/                # React application
│   ├── src/
│   │   ├── api/            # API integration
│   │   ├── components/     # Reusable components
│   │   ├── context/        # Global state management
│   │   ├── hooks/         # Custom React hooks
│   │   └── pages/         # Route components
└── backend/                # Node.js server
    ├── controllers/       # Business logic
    ├── models/           # Database schemas
    ├── routes/           # API endpoints
    └── middleware/       # Custom middleware
```

## 🔑 API Security
- JWT-based authentication
- Rate limiting
- CORS protection
- Request validation
- Error handling middleware

## 🤝 Contributing
1. Fork the repository
2. Create feature branch (`git checkout -b feature/NewFeature`)
3. Commit changes (`git commit -am 'Add NewFeature'`)
4. Push to branch (`git push origin feature/NewFeature`)
5. Open Pull Request

## 👨‍💻 Core Team
- **Debashis Parida** - _Project Lead & Full Stack Developer_

## 📄 License
This project is licensed under the MIT License

---
*Built with ❤️ by Debashis Parida*

