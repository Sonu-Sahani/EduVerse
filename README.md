<div align="center">

# 🎓 Learning Management System (LMS)

### A Modern Full-Stack Learning Platform Inspired by Udemy

<img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react"/>
<img src="https://img.shields.io/badge/Node.js-22-green?style=for-the-badge&logo=node.js"/>
<img src="https://img.shields.io/badge/Express.js-Backend-black?style=for-the-badge&logo=express"/>
<img src="https://img.shields.io/badge/MongoDB-Database-green?style=for-the-badge&logo=mongodb"/>
<img src="https://img.shields.io/badge/Stripe-Payments-blueviolet?style=for-the-badge&logo=stripe"/>
<img src="https://img.shields.io/badge/Cloudinary-Media-blue?style=for-the-badge&logo=cloudinary"/>

A complete Learning Management System where students can enroll in courses, watch lectures, track progress, and educators can create and manage courses.

</div>

---

# 🚀 Live Demo

🌐 **Live Website**

https://lms-frontend-gold-nu.vercel.app

---

# 📸 Screenshots

> Add screenshots inside the `screenshots/` folder.

| Home Page | Course Details |
|------------|---------------|
| ![](screenshots/home.png) | ![](screenshots/course.png) |

| Student Dashboard | Educator Dashboard |
|-------------------|-------------------|
| ![](screenshots/student.png) | ![](screenshots/educator.png) |

---

# ✨ Features

## 👨‍🎓 Student

- User Authentication
- Browse Courses
- Search Courses
- Course Details
- Buy Course
- Secure Stripe Payment
- Watch Lectures
- Track Course Progress
- Responsive UI
- Profile Dashboard

---

## 👨‍🏫 Educator

- Create Courses
- Upload Thumbnail
- Upload Lectures
- Add Chapters
- Edit Course
- Delete Course
- View Enrolled Students
- Dashboard Analytics
- Revenue Overview

---

## 🔐 Authentication

- Clerk Authentication
- Protected Routes
- Secure User Sessions

---

## 💳 Payments

- Stripe Checkout
- Secure Payment Gateway
- Enrollment after Successful Payment

---

## 📱 Responsive Design

- Desktop
- Laptop
- Tablet
- Mobile

---

# 🛠 Tech Stack

## Frontend

- React.js
- React Router DOM
- Tailwind CSS
- Axios
- Clerk
- React Hot Toast

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Multer
- Cloudinary

## Payment

- Stripe

---

# 🏗 Project Architecture

```text
                 Client (React)
                        │
                        │ REST API
                        ▼
              Express.js Backend
                        │
     ┌──────────────────┼──────────────────┐
     │                  │                  │
 Authentication      Course APIs      Payment APIs
 (Clerk/JWT)                           (Stripe)
     │                  │                  │
     └──────────────┬───┴──────────────────┘
                    │
               MongoDB Atlas
                    │
              Course Database
                    │
             Cloudinary Storage
```

---

# 🔄 Application Flow

```text
Student
   │
   ▼
Login / Register
   │
   ▼
Browse Courses
   │
   ▼
Select Course
   │
   ▼
Stripe Checkout
   │
   ▼
Payment Success
   │
   ▼
Course Enrollment
   │
   ▼
Watch Videos
   │
   ▼
Track Progress
```

---

# 📂 Folder Structure

```
LMS
│
├── client
│   ├── src
│   ├── components
│   ├── pages
│   ├── context
│   └── assets
│
├── server
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   └── server.js
│
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/Sonu-Sahani/LMS.git
```

Go into project

```bash
cd LMS
```

---

## Install Client

```bash
cd client
npm install
```

---

## Install Server

```bash
cd ../server
npm install
```

---

# ▶ Run Project

### Backend

```bash
npm run server
```

### Frontend

```bash
npm run dev
```

---

# 🔑 Environment Variables

## Backend

```env
PORT=

MONGODB_URI=

JWT_SECRET=

STRIPE_SECRET_KEY=

STRIPE_WEBHOOK_SECRET=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=

CLERK_SECRET_KEY=
```

---

## Frontend

```env
VITE_API_URL=

VITE_CLERK_PUBLISHABLE_KEY=
```

---

# 📡 REST API

## Authentication

```
POST /api/user/login

POST /api/user/register

GET /api/user/profile
```

---

## Course

```
GET /api/course

GET /api/course/:id

POST /api/course/create

PUT /api/course/update

DELETE /api/course/delete
```

---

## Enrollment

```
POST /api/user/enroll

GET /api/user/enrolled
```

---

## Payment

```
POST /api/payment/create-checkout-session

POST /api/payment/webhook
```

---

# 🎯 Future Improvements

- Live Classes
- Video Streaming
- Quiz System
- Certificates
- AI Course Recommendation
- Chat Feature
- Notes Section
- Assignment Submission
- Discussion Forum

---

# 📈 Performance

✔ Lazy Loading

✔ Responsive UI

✔ RESTful APIs

✔ Optimized Database Queries

✔ Secure Authentication

---

# 👨‍💻 Author

## Sonu Sahani

📧 sonusahani.tech@gmail.com

🌐 https://www.sonusahani.com.np

💼 https://www.linkedin.com/in/sonu-sahani-928209371/

---

# ⭐ Support

If you like this project,

⭐ Star the repository

🍴 Fork it

🛠 Contribute

---

<div align="center">

### Made with ❤️ by Sonu Sahani

</div>