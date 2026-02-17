🌾 Gaon2Ghar – Farm to Customer Marketplace

Gaon2Ghar is a full-stack marketplace platform that connects local farmers directly with customers.
It enables farmers to list products and customers to order fresh produce with real-time order tracking and lifecycle management.

🚀 Live Project

Frontend: https://gaon2ghar-git-main-abhinav-sachans-projects.vercel.app
Backend: https://gaon2ghar-backend.onrender.com

🛠 Tech Stack
Frontend

React (Vite)
Tailwind CSS
Axios
React Router
React Hot Toast

Backend
Node.js
Express.js
MongoDB (Atlas)
Mongoose
JWT Authentication
Multer (Image Upload)
Cloudinary (Product Images)

Deployment

Frontend: Vercel
Backend: Render
Database: MongoDB Atlas

👥 User Roles
🧑‍🌾 Farmer

Register / Login
Add products (up to 10 images)
Add description & stock
Restock products
Delete products
View incoming orders
Accept / Reject orders
Update order status (Packed → Out for Delivery → Delivered)

🛒 Customer

Register / Login
Browse products
Add to cart
Update quantity (up to 50kg)
Remove items
Checkout
Cancel order (if pending)
Track delivery timeline
Rate farmer after delivery

📦 Core Features (v1.0 – MVP)
🔐 Authentication

Role-based access (Farmer / Customer)

JWT-based protected routes

🛍 Product System

Multi-image upload (Cloudinary)
Auto-hide when stock = 0
Restock capability
Product descriptions

🛒 Cart & Checkout
Add to cart API
Update quantity
Remove item
Checkout from cart
Orders created from cart
Automatic stock reduction
Stock restore on cancellation

📍 Delivery Logic

Pincode-based delivery charges
Manual delivery zones
Order lifecycle management:
pending
accepted
packed
out_for_delivery
delivered
rejected
cancelled

📊 Order Management

Customer Order History
Delivery Progress Bar
Cancel Order (only if pending)
Farmer Order Panel
Status updates
Rating system after delivery

🧠 System Design Highlights

Role-based middleware protection
Clean REST API structure
Enum-based order lifecycle control
Automatic stock synchronization
Delivery charge logic per pincode
Modular controller structure
Production-ready folder structure

📂 Backend Structure
backend/
│
├── controllers/
├── models/
├── routes/
├── middleware/
├── config/
├── server.js

📂 Frontend Structure
frontend/
│
├── pages/
├── components/
├── api/
├── App.jsx

🔄 Order Lifecycle Flow
Customer places order
↓
Stock auto-reduces
↓
Farmer accepts/rejects
↓
Packed
↓
Out for delivery
↓
Delivered
↓
Customer rates farmer

📌 Future Roadmap (v2.0)
Razorpay payment integration
Admin panel
Farmer earnings dashboard
Delivery partner system
Google Maps live location
Real-time notifications

💡 Why This Project?
Gaon2Ghar solves a real-world problem:

Connecting rural farmers directly with urban consumers
Removing middlemen
Increasing farmer profit margins.

It is built with scalability and real-world deployment in mind.

👨‍💻 Author
Abhinav Sachan
Full Stack Developer | AI & ML Enthusiast

GitHub: https://github.com/AbhinavS0007
LinkedIn: https://www.linkedin.com/in/abhinav-sachan-35a706274/

⭐ If You Like This Project
Give it a star and feel free to contribute!