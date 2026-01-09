# ⚙️ TripMingle API - Scalable Travel Management Backend

The TripMingle Backend is a robust RESTful API architecture designed to handle complex travel data, user authentication, and multi-role authorization.

## 🚀 Core Functionality
The backend handles the business logic for the TripMingle ecosystem, including secure data persistence with PostgreSQL and an ORM-based approach to ensure data integrity and type safety across the application.

## ✨ Technical Highlights
- **Role-Based Access Control (RBAC):** Custom middleware to restrict access based on user roles (Admin, Host, Traveler).
- **Authentication:** Secure JWT-based authentication with password encryption via Bcrypt.
- **Data Integrity:** Schema-first development with Prisma ORM and Zod for runtime validation.
- **Scalable Architecture:** Modular structure dividing services, controllers, and routes for high maintainability.
- **File Management:** Multer integration for handling local file uploads (images).

## 🛠 Technology Stack
- **Runtime:** Node.js
- **Framework:** Express.js with TypeScript
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Security:** JWT, Bcrypt, CORS
- **Validation:** Zod
- **API Documentation:** REST Convention

## 📡 API Endpoints Summary
- **Auth:** `POST /api/v1/auth/login`, `POST /api/v1/auth/create-tourist`
- **Travel Plans:**
  - `GET /api/v1/travel-plans` - Public trips.
  - `POST /api/v1/travel-plans` - Proposal (Host).
  - `PATCH /api/v1/travel-plans/:id/publish` - Approval (Admin).
  - `GET /api/v1/travel-plans/my-plans` - Host specific trips.
- **Users:** `GET /api/v1/users/profile`, `PATCH /api/v1/users/update-profile`

## ⚙️ Installation & Setup
1. **Navigate to Directory:**
   ```bash
   cd TripMingle_Backend

### Install Dependencies:

Bash
npm install

## Environment Setup: Create a .env file:

### Code snippet

1. DATABASE_URL="postgresql://user:password@localhost:5432/tripmingle"
2. JWT_ACCESS_SECRET="your_jwt_secret"
3. PORT=5000
4. NODE_ENV="development"

### Database Migration:

Bash
npx prisma migrate dev --name init

### Start Server:

Bash
npm run dev

## Deployment 
### https://tripmingle-backend.onrender.com
