# InventorCS - Inventory Management System App
![inventorcs-app](https://github.com/user-attachments/assets/55489197-ceda-43c9-b3b9-938ec63a3a7e)


**inventorCS** is a **full-stack inventory management system** built with the **MERN Stack** (MongoDB, Express.js, React, Node.js). It’s designed for efficient stock tracking, allows user to loan the item/inventory, reporting, and secure user authentication.

> **Project Link**: [InventorCS Web App](https://inventorcs.csbihub.id/)

## 📑 Table of Contents
- ✅ [Features](#-features)
- ✅ [Tech Stack](#-tech-stack)
- ✅ [System Requirements](#-system-requirements)
- ✅ [Installation and Setup](#-installation-and-setup)
- ✅ [Available Scripts](#-available-scripts)
- ✅ [API Documentation](#-api-documentation)
- ✅ [Screenshots](#-screenshots)
- ✅ [Development Notes](#-development-notes)
- ✅ [Project Members](#-project-members)

## ✨ Features
- **User Authentication**: JWT-based login & registration. There are 3 user roles: User, Staff, and Admin.
- **Inventory Management**: Create, update, delete, and view stock.
- **Item Loan Transaction**: Borrow, return, and track item loan history.
- **Request Meeting Scheduling**: Users can request meetings with staff to discuss loan transactions.
- **Dashboard Analytics**: Real-time data visualization using charts, and each user role has a different dashboard.
- **Date Filters & Reports**: Filter data by date, export to Excel/PDF.
- **Search, Sort, Filter, and Pagination**: Efficient data browsing with multiple criteria. 
- **Email Notifications**: Automated transactional emails.
- **Background Jobs**: Scheduled tasks via Cron & RabbitMQ workers.
- **Security**: Input sanitization, Helmet, CORS, and cookie management.
- **Responsive UI Design**: Built with TailwindCSS and Material Tailwind.

## 🧑‍💻 Tech Stack
=> **Frontend**:
- ➡️ **React 18** with **Vite**
- ➡️ **Redux Toolkit** for state management
- ➡️ **Axios** for making HTTP requests from backend
- ➡️ **Tailwind CSS** & **Material Tailwind** for UI
- ➡️ **Recharts** for data visualization
- ➡️ **ExcelJS, jsPDF, FileSaver** for export features
- ➡️ **Framer Motion** for animations
- ➡️ **QR Code & Barcode** support

=> **Backend**:
- ➡️ **Node.js** + **Express.js**
- ➡️ **MongoDB** + **Mongoose**
- ➡️ **JWT** authentication & **bcrypt** password hashing
- ➡️ **Swagger** for API documentation
- ➡️ **RabbitMQ** integration (via amqplib) for async job processing
- ➡️ **Helmet**, **CORS**, **cookie-parser** for security
- ➡️ **Nodemailer** for email notifications

=> **Deployment & DevOps**:

<img width="758" height="340" alt="InventorCS - CICD Pipeline" src="https://github.com/user-attachments/assets/15f99a24-4b68-4526-8119-134709e3221f" />

- ➡️ GitHub Actions: CI/CD automation for build & deployment
- ➡️ Docker & Docker Compose: Containerization for backend & frontend services
- ➡️ Cloudflare Zero Trust: Secure remote access & protection
- ➡️ NGINX: Serving the frontend and reverse proxy for backend API

## 💻 System Requirements
- ➡️ NodeJS v22 or above
- ➡️ npm v9 or above
- ➡️ MongoDB v6 or above
- ➡️ RabbitMQ v3 or above

## 📥 Installation and Setup
### **1. Clone Repository**
```bash
git clone https://github.com/Juwono136/inventorCS_apps.git
cd inventorCS_apps
```

### **2. Install Backend Dependencies**
```bash
cd server
npm install
```

### **3. Install Frontend Dependencies**
```bash
cd client
npm install
```

### **4. Configure Environment Variables**
Create a `.env` file inside the `server` folder:
```env
PORT = 5001
CONNECTION_URL = MONGODB_CONNECTION_URI
DB_NAME = inventorCS
CLIENT_URL = http://localhost:5173 (OR USING VITE URI)
INTERNET_SERVER = http://localhost:5001
API_USERS_URL = http://localhost:5000/api/user
NODE_ENV = production

REFRESH_TOKEN_SECRET = YOUR_REFRESH_TOKEN_SECRET
ACCESS_TOKEN_SECRET = YOUR_ACCESS_TOKEN_SECRET
ACTIVATION_TOKEN_SECRET = YOUR_ACTIVATION_TOKEN_SECRET

EMAIL_USER = YOU_HOST_EMAIL
EMAIL_PASSWORD = YOUR_EMAIL_PASSWORD

RABBITMQ_URL = amqp://<USERNAME>:<PASSWORD>@<YOUR_LOCAL_IP>:5672 
```

### 5. Running the app
```bash
cd inventorCS_apps
npm start
```

> Backend URL: http://Localhost:5001

> Frontend URL: http://localhost:5173

## 📜 Available Scripts
### Backend
| Script           | Description                              |
| ---------------- | ---------------------------------------- |
| `npm start`      | Start server and worker concurrently |
| `npm run dev`    | Development mode with live reload        |
| `npm run worker` | Start background worker only             |

### Frontend
| Script            | Description                      |
| ----------------- | -------------------------------- |
| `npm run dev`     | Start dev server with hot reload |
| `npm run build`   | Build for production             |
| `npm run preview` | Preview production build         |
| `npm run lint`    | Run ESLint checks                |

## 🌐 API Documentation
- Swagger API documentation for inventorCS Server: Coming soon...
- Swagger API documentation for User REST API: [Click Here](https://csbi-users.csbihub.id/users/api-docs/)

## 🖼 Screenshots
### Home Page

### Sign In Page

### Sign Up Page

### Inventory lists Page

### Inventory Detail Page

### My Cart / Create Loan Transaction Page

### User Dashboard

### Staff Dashboard

### Admin Dashboard

## 📝 Development Notes
- Ensure MongoDB & RabbitMQ are running before starting backend (running via docker).
- Worker script (worker/autoCancelWorker.js) runs scheduled tasks automatically.
- Use nodemon for live reload during backend development.
- Cron jobs handle automatic cancellations & periodic maintenance tasks.

## 🤝 Project Members
- Juwono (https://github.com/Juwono136)
- Ida Bagus Kerthyayana Manuaba
- Wilbert Wirawan Ichwan
- Brilian Yudha
