# InventorCS - Inventory Management System App
![inventorcs-app](https://github.com/user-attachments/assets/55489197-ceda-43c9-b3b9-938ec63a3a7e)


**inventorCS** is a **full-stack inventory management system** built with the **MERN Stack** (MongoDB, Express.js, React, Node.js). It’s designed for efficient stock tracking, allows user to loan the item/inventory, reporting, and secure user authentication.

> **Project Link**: [InventorCS Web App](https://inventorcs.csbihub.id/)

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
### Frontend:
- ➡️ **React 18** with **Vite**
- ➡️ **Redux Toolkit** for state management
- ➡️ **Axios** for making HTTP requests from backend
- ➡️ **Tailwind CSS** & **Material Tailwind** for UI
- ➡️ **Recharts** for data visualization
- ➡️ **ExcelJS, jsPDF, FileSaver** for export features
- ➡️ **Framer Motion** for animations
- ➡️ **QR Code & Barcode** support

### Backend:
- ➡️ **Node.js** + **Express.js**
- ➡️ **MongoDB** + **Mongoose**
- ➡️ **JWT** authentication & **bcrypt** password hashing
- ➡️ **Swagger** for API documentation
- ➡️ **RabbitMQ** integration (via amqplib) for async job processing
- ➡️ **Helmet**, **CORS**, **cookie-parser** for security
- ➡️ **Nodemailer** for email notifications

### Deployment & DevOps:
<img width="758" height="340" alt="InventorCS - CICD Pipeline" src="https://github.com/user-attachments/assets/76d02772-8333-497f-8a5f-ac61cb85e556" />

- ➡️ GitHub Actions: CI/CD automation for build & deployment
- ➡️ Docker & Docker Compose: Containerization for backend & frontend services
- ➡️ Cloudflare Zero Trust: Secure remote access & protection, and create tunnel
- ➡️ NGINX: Serving reverse proxy for frontend

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
<img width="1911" height="862" alt="image" src="https://github.com/user-attachments/assets/d1af3391-b7df-43c5-88cb-1224956bb84a" />

### Sign Up Page
<img width="1920" height="1453" alt="image" src="https://github.com/user-attachments/assets/1c1c740b-7e61-4f57-9fee-0f8accab2f50" />

### Select Role Page (If user has more than 1 role)
<img width="1916" height="1013" alt="image" src="https://github.com/user-attachments/assets/cfce1ea2-9f74-4d9d-95a0-e760fe71435c" />

### Inventory lists Page
<img width="1920" height="3233" alt="image" src="https://github.com/user-attachments/assets/8c6c7a74-fac6-4a36-b2b6-5ff5f2155d1d" />

### Inventory Detail Page
<img width="1911" height="866" alt="image" src="https://github.com/user-attachments/assets/d714da25-813b-4705-8946-3c09122fe3b4" />

### My Cart / Create Loan Transaction Page
<img width="1912" height="860" alt="image" src="https://github.com/user-attachments/assets/17c4c019-4aec-42df-916c-d0d4761a7551" />

### User Dashboard
<img width="1910" height="867" alt="image" src="https://github.com/user-attachments/assets/4f6a7bf7-5cf6-409f-839a-92b1386bde53" />

### User Loan Transactions Page
<img width="1912" height="862" alt="image" src="https://github.com/user-attachments/assets/88756054-7665-4366-b350-a02d40798e7a" />

### User Loan Transaction Detail Form Page
<img width="1920" height="2080" alt="image" src="https://github.com/user-attachments/assets/f7e4c086-acfe-406a-ad31-a1bab529172a" />

### My Profile Page
<img width="1920" height="1135" alt="image" src="https://github.com/user-attachments/assets/f911f63d-b407-44c1-ba98-a936363f8449" />

### Notification Page
<img width="1920" height="1135" alt="image" src="https://github.com/user-attachments/assets/3e8811a0-8e61-44bb-b311-218029c52ec0" />

### Staff Dashboard
<img width="1920" height="1135" alt="image" src="https://github.com/user-attachments/assets/b40a2d99-46bc-4766-bc90-c402cae9e8a2" />

### Inventories List
<img width="1920" height="1135" alt="image" src="https://github.com/user-attachments/assets/d5905e50-a32a-486a-a95f-64256bb5cfb3" />

### Inventory Detail Page (Update Inventory)
<img width="1920" height="1135" alt="image" src="https://github.com/user-attachments/assets/0bbbac67-4d00-4caa-921d-055856f2dba6" />

### Add Inventory Page
<img width="1920" height="1135" alt="image" src="https://github.com/user-attachments/assets/48dd1acd-e6d3-4282-a41b-0e5a4756578a" />

### Borrowed Items Info Page
<img width="1920" height="1135" alt="image" src="https://github.com/user-attachments/assets/8d58d8d7-da01-478f-bcee-6c9a2bd00eb2" />

### Meeting Requests Info Page
<img width="1920" height="1135" alt="image" src="https://github.com/user-attachments/assets/e3c438ce-5de3-4a47-8247-3a0962e199b2" />

### Admin Dashboard
Under process...

## 📝 Development Notes
- Ensure MongoDB & RabbitMQ are running before starting backend (running via docker).
- Worker script (worker/autoCancelWorker.js) runs scheduled tasks automatically.
- Use nodemon for live reload during backend development.
- Cron jobs handle automatic cancellations & periodic maintenance tasks.

## 🤝 Project Members
- Juwono (https://github.com/Juwono136)
- Ida Bagus Kerthyayana Manuaba (https://github.com/bagzcode)
- Wilbert Wirawan Ichwan (https://github.com/Rktify)
- Brilian Yudha (https://github.com/brilianvy2)
