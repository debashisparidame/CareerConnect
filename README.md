# College Placement Management System

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [User Roles](#user-roles)
- [Installation](#installation)
- [Contributors](#contributors)

## Introduction
The **College Placement Management System** is a web application designed to streamline and digitize the placement process in colleges and universities. Developed by final year students of **Rizvi College of Engineering**, the system features a multi-role platform catering to students, TPO (Training and Placement Officer), management, and super admin. It aims to minimize manual efforts, improve transparency, and provide real-time tracking of the placement cycle.

## Features
- **Student Portal**: Register and login, update profile, upload resume, view available job opportunities, apply for jobs, and track application status.
- **TPO Admin Portal**: Post and manage job listings, approve/reject student applications, schedule interviews, upload offer letters.
- **Management Admin Portal**: Access analytics, monitor placement stats, and view comprehensive reports.
- **Super Admin Portal**: Full control of the system including onboarding TPOs and management users, managing system configurations.
- **Cloudinary Integration**: Handles secure storage of profile pictures, resumes, and offer letters.

## Tech Stack
- **Frontend**: Vite + React.js, Tailwind CSS, Bootstrap
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **File Storage**: Cloudinary
- **Styling**: Tailwind CSS, Bootstrap

## Project Structure
```plaintext
├── frontend
│   ├── public
│   ├── src
│   │   ├── api
│   │   ├── assets
│   │   ├── components
│   │   │   ├── LandingPages
│   │   │   └── students
│   │   ├── config
│   │   │   └── backend_url.js      # Contains: export const BASE_URL = 'https://cpms-api.vercel.app';
│   │   ├── context
│   │   ├── hooks
│   │   ├── pages
│   │   ├── styles
│   │   ├── utility
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .gitignore
│   ├── .eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── .env (NOTE: YOU NEED TO CREATE THIS FILE)
│   ├── .gitignore
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
└── README.md
```

## User Roles
- **Students**: View and apply for jobs, update profile, track status, and upload resumes.
- **TPO Admin**: Post jobs, manage applications, upload offer letters, and schedule interviews.
- **Management Admin**: Access dashboards and reports for data-driven decision making.
- **Super Admin**: Manage system settings, and create/manage TPO and Management users.

## Installation

### Prerequisites
- Node.js and npm installed
- MongoDB installed and running
- Cloudinary account for file uploads

### Clone the Repository
```bash
git clone https://github.com/moinmn/college-placement-management-system.git
cd college-placement-management-system
```

### Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install the necessary packages:
   ```bash
   npm install
   ```
3. Create a `.env` file for environment variables:
   ```env
   PORT=4518
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```
4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install the necessary packages:
   ```bash
   npm install
   ```
3. Change backend URL for local testing:
   Go to `src/config/backend_url.js` and update:
   ```js
   export const BASE_URL = 'http://localhost:4518';
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Contributors
- **Member 1**: [Moin MN](https://www.linkedin.com/in/moinnaik/)
- **Member 2**: Rafat Muskan Shaikh
- **Member 3**: Saquib Patel
- **Member 4**: Neeraj Kumar

