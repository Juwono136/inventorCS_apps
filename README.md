# InventorCS - Inventory Management System App
![inventorcs-app](https://github.com/user-attachments/assets/55489197-ceda-43c9-b3b9-938ec63a3a7e)


**inventorCS** is a **full-stack inventory management system** built with the **MERN Stack** (MongoDB, Express.js, React, Node.js).  
It’s designed for efficient stock tracking, allows user to loan the item/inventory, reporting, and secure user authentication.

> **Project Link**: [InventorCS Web App](https://inventorcs.csbihub.id/)

## 📑 Table of Contents
1. [Features](#-features)
2. [Tech Stack](#-tech-stack)
3. [System Requirements](#-system-requirements)
4. [Installation](#-installation)
5. [Backend Setup](#-backend-setup)
6. [Frontend Setup](#-frontend-setup)
7. [Available Scripts](#-available-scripts)
9. [Environment Variables](#-environment-variables)
10. [API Documentation](#-api-documentation)
11. [Development Notes](#-development-notes)
12. [License](#-license)
13. [Author](#-author)

## ✨ Features
- **User Authentication**: JWT-based login & registration.
- **Inventory Management**: Create, update, delete, and view stock.
- **Item Loan Transaction**: Borrow, return, and track item loan history.
- **Request Meeting Scheduling**: Users can request meetings with staff to discuss loan transactions.
- **Dashboard Analytics**: Real-time data visualization using charts.
- **Date Filters & Reports**: Filter data by date, export to Excel/PDF.
- **Search, Sort, Filter, and Pagination**: Efficient data browsing with multiple criteria. 
- **Email Notifications**: Automated transactional emails.
- **Background Jobs**: Scheduled tasks via Cron & RabbitMQ workers.
- **Security**: Input sanitization, Helmet, CORS, and cookie management.
- **Responsive UI**: Built with TailwindCSS and Material Tailwind.

## 🧑‍💻 Tech Stack:
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

## 💻 System Requirements
- ➡️ NodeJS v22 or above
- ➡️ npm v9 or above
- ➡️ MongoDB v6 or above
- ➡️ RabbitMQ v3 or above

## 📥 Installation
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
cd ../frontend
npm install
```

## ⚙️ Backend Setup
### **1. Configure Environment Variables**
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




