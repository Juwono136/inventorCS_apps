# InventorCS - Inventory Management System App

**inventorCS** is a **full-stack inventory management system** built with the **MERN Stack** (MongoDB, Express.js, React, Node.js).  
It’s designed for efficient stock tracking, allows user to loan the item/inventory, reporting, and secure user authentication.

> **Project Link**: [InventorCS Web App](https://inventorcs.csbihub.id/)


## 📑 Table of Contents
1. [Features](#-features)
2. [Tech Stack](#-tech-stack)
3. [System Requirements](#-system-requirements)
4. [Project Structure](#-project-structure)
5. [Installation](#-installation)
6. [Backend Setup](#-backend-setup)
7. [Frontend Setup](#-frontend-setup)
8. [Available Scripts](#-available-scripts)
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
- ➡️ **Tailwind CSS** & **Material Tailwind** for UI
- ➡️ **Recharts** for data visualization
- ➡️ **Day.js / Moment.js / Date-fns** for date handling
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

## ⚙️ Installation & Setup
### **1. Clone Repository**




