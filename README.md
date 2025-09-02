
# 📦 SwiftParcel – Parcel Delivery Management System

[Live Server Link](https://parcel-delivery-backend-nine.vercel.app)

---

## **Project Overview**

SwiftParcel is a secure, role-based parcel delivery management system similar to Pathao Courier and Sundarban.  
It allows **Senders**, **Receivers**, and **Admins** to manage parcel delivery requests efficiently.  

- **Sender:** Create, cancel, and track their parcels.  
- **Receiver:** View incoming parcels, confirm delivery, and track delivery history.  
- **Admin:** Manage all users and parcels, update delivery status, block/unblock users.  

---

## **Tech Stack**

**Frontend:** React.js, Redux Toolkit, RTK Query, TypeScript, Tailwind CSS  
**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Bcrypt  
**Testing:** Postman  

---

## **Setup & Environment Instructions**

1. Clone the repository:  
```bash
git clone https://github.com/abubakrsiddikl/Parcel-Delivery-System-Backend
cd swiftparcel-backend


Install dependencies:

npm install


Configure environment variables in .env:

MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-secret-key>
JWT_EXPIRES_IN=7d
PORT=5000


Start the server:

npm run dev


Server will run at: http://localhost:5000

Endpoints Summary
Authentication

POST /auth/register – Register as sender or receiver

POST /auth/login – Login with JWT

GET /auth/me – Get logged-in user info

Sender APIs

POST /parcels/create – Create a new parcel

GET /parcels/me – List sender's parcels

PATCH /parcels/cancel/:id – Cancel a parcel (if not dispatched)

Receiver APIs

GET /parcels/me – List incoming parcels

PATCH /parcels/confirm-delivery/:id – Confirm parcel delivery

Admin APIs

GET /parcels – View all parcels

GET /parcels/:parcelId – Get parcel details

PATCH /parcels/:id/status – Update parcel status

GET /users – List all users

PATCH /users/block/:id – Block or unblock user

Tracking API

GET /parcels/track/:trackingId – Track parcel by ID

Key Features

Role-based access control (Sender, Receiver, Admin)

Parcel status workflow: Requested → Approved → Dispatched → In Transit → Delivered

Status logs stored for tracking changes

Parcel validation (weight, fee, receiver info)

Pagination, search, and filtering for large datasets

Toast notifications and clean responsive UI

Secure JWT authentication with HTTP-only cookies

Testing

All endpoints tested via Postman

Postman collection included in the repos