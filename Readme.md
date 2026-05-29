# Event Management App

Event Mania is a comprehensive event management platform that allows users to create, discover, and manage events effectively. It is designed to cater to both regular users wanting to organize their own events, and platform administrators who require robust tools to oversee the entire platform. Built with a modern MERN stack architecture, the application provides a seamless, responsive, and interactive user interface alongside a secure and scalable backend.

## 🌟 Key Features & Pages

### 1. Robust Authentication & Authorization
- **Role-Based Access Control (RBAC):** The system distinguishes between regular Users and Administrators. Admins have elevated privileges to globally manage events and users, ensuring platform integrity.
- **Secure Authentication:** Utilizes JSON Web Tokens (JWT) for secure, stateless user sessions, and bcrypt for encrypting passwords before storing them in the database.

### 2. Admin Dashboard
- **Global Event Management:** System administrators are provided with comprehensive controls. Admins can view all events across the platform and have the authority to update event details, cancel events, or permanently delete them globally.
- **User Management:** Includes dedicated options for registering new admins or managing existing users to maintain platform security and order.

### 3. Comprehensive Event Listing & Discovery
- **Paginated Event Feed:** A clean, paginated list of all upcoming events ensures smooth browsing even as the platform scales. Users can navigate through multiple pages of events effortlessly.
- **Detailed Event Information:** Each event listing prominently displays crucial details such as the date, venue, title, and an action panel. Depending on the user's role (Organizer or Admin), additional management buttons (Update, Cancel, Delete) become available dynamically.

### 4. User Profile & Organized Events Dashboard
- **Personalized Profile:** Users have a dedicated profile section displaying their account details (Username, Email, Role).
- **Organizer's Hub:** Below their profile, users can manage all the events they have personally organized. This section features a powerful search bar, category filtering, and dynamic sorting options (e.g., Latest Upcoming) for quick and efficient access to their specific events.

### 5. Advanced Event Creation & Modification
- **Detailed Event Forms:** A comprehensive and validated form allows users to create new events or update existing ones. It captures essential details such as precise start and end times, concise short descriptions, rich full event content/details, and structured pricing information.
- **Free/Paid Events:** It includes a seamless toggle to mark an event as completely "Free" or set a specific price, catering to different event types.

## 🚀 Tech Stack

**Frontend (Client):**
- **React 18** - Component-based UI library
- **Vite** - High-performance frontend tooling and bundler
- **Tailwind CSS** - Utility-first CSS framework for rapid UI styling and responsive design
- **React Router DOM** - Dynamic client-side routing for seamless navigation
- **Redux Toolkit & React Redux** - Centralized, predictable state management
- **React Hook Form & Zod** - Robust form handling paired with strict schema validation
- **React Leaflet** - Interactive maps integration for event locations

**Backend (Server):**
- **Node.js & Express.js** - Fast, scalable backend framework handling RESTful API routes
- **MongoDB & Mongoose** - NoSQL Database and Object Data Modeling (ODM) for flexible data storage
- **JSONWebToken (JWT)** - Secure authentication standard
- **Bcrypt** - Industry-standard password hashing algorithm
- **Validator** - String validation for incoming API payloads

## ⚙️ Setup Steps

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd "Event Management App"
   ```

2. **Install dependencies for the Server:**
   ```bash
   cd server
   npm install
   ```

3. **Install dependencies for the Client:**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Variables Configuration:**
   - **Server:** Create a `.env` file in the `server` directory and configure the following variables:
     ```env
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret_key
     ```
   - **Client:** Create a `.env` file in the `client` directory and configure necessary frontend variables (e.g., API base URL).

## ▶️ Run Commands

To run the application locally, you must start both the backend server and the frontend client simultaneously.

**1. Start the Server (Backend):**
```bash
cd server
node index.js
# Or if you prefer auto-reloading during development:
# nodemon index.js
```

**2. Start the Client (Frontend):**
Open a new terminal window or tab:
```bash
cd client
npm run dev
```
The client application will typically become accessible at `http://localhost:5173`.

## 💡 Assumptions & Prerequisites

- **Local Environment:** It is assumed that Node.js and MongoDB (either a local instance or a cloud Atlas cluster) are installed and accessible by the backend server.
- **Authentication Flow:** It is assumed that user roles (e.g., ADMIN vs USER) are correctly established during the registration process and strictly validated via JWT tokens on all protected backend routes.
- **Port Availability:** It is assumed that default ports 5000 (for the Express server) and 5173 (for the Vite client) are available and not blocked on the host machine.


## 🌟 Additional Features

- **Debouncing in Search:** Optimized search functionality with debouncing after every 500ms the moment user stops typing to minimize unnecessary API calls while typing, enhancing performance.
- **Pagination at Multiple Places:** Implemented robust pagination across event feeds and dashboards to manage large datasets and ensure fast load times.
- **Deployed on Render:** Fully configured and deployed on Render for reliable cloud hosting. (https://event-management-app-9ttz.onrender.com)
- **Map Feature using Leaflet:** Integrated React Leaflet to display interactive maps, allowing users to pinpoint and explore event locations.
- **Global Rate Limiting:** Secured backend APIs using `express-rate-limit` to prevent brute-force attacks and abuse.
- **Calendar View:** A custom retro-themed calendar interface on the homepage for intuitive date-based event discovery and filtering.
- **Role-Based Access Control:** Secure access levels differentiating standard users and administrators for platform integrity.


Video Demo - https://drive.google.com/file/d/1Hs8HthFyyVPrphvEIel_PkAR43JNKhmo/view?usp=drivesdk