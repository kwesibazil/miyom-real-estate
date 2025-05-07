# Full-Stack App – React & Express with TypeScript

This project is a full-stack web application built with **React + TypeScript** on the frontend and **Express + TypeScript** on the backend. It includes robust authentication, image upload, and email functionality.



## 📘 Project Description

It includes form validation, session management, persistent state, secure file handling, and rate-limiting features, all integrated with clean and maintainable code using TypeScript across both client and server.

## 🧰 Technologies Used

### Frontend

- **React** (with **TypeScript**)
- **Bootstrap 5**
- **Axios** for API requests
- **Redux** for state management
- **Redux-Persist** to maintain state across sessions
- **DOMPurify** for sanitizing HTML content

### Backend

- **Express.js** (with **TypeScript**)
- **MongoDB** for data storage
- **Joi** for input validation
- **Winston** for logging
- **Express-Rate-Limit** for rate limiting
- **Express-Session** for managing sessions
- **jsonwebtoken** for secure token-based auth
- **Passport.js** for authentication strategies
- **SendGrid** for sending transactional emails
- **Cloudinary** for cloud-based image storage
- **Multer** for file uploads


## 🚀 Getting Started

### Instructions to Run Locally

1.  **Clone the Repository:**

    ```bash
    git clone [https://github.com/kwesibazil/kwesibazil-miyom-real-estate.git]
    cd miyom-real-estate
    ```

2.  **Install Dependencies:**

    ```bash
    cd server
    npm install
    cd ../client
    npm install
    cd ..
    ```

3.  **Start the Development Servers:**

    Open two separate terminal windows or tabs.

    **Terminal 1 (Backend):**

    ```bash
    cd server
    npm run dev
    ```

    **Terminal 2 (Frontend):**

    ```bash
    cd client
    npm run dev
    ```

    The backend server will typically run on a port you've configured (check your `server/.env` file or server-side code), and the frontend development server (using Vite) will usually start at `http://localhost:5173`.


### 4. Create .env File

To run the server, ensure the following environment variables are set in your `.env` file located in the `server` directory:

```env
# General
LOG_LEVEL=warn
NODE_ENV=
PORT=
BASE_URL=

# Database
DATABASE_NAME=
MONGO_UR=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Lockout Configuration
TEMPORARY_PASSWORD_ATTEMPTS=
PERMANENT_PASSWORD_ATTEMPTS=
TEMPORARY_LOCKOUT_DURATION_MINUTES=
PERMANENT_LOCKOUT_DURATION_MINUTES=

# Security
JWT_SECRET=
STORE_SECRET=
SESSION_SECRET=

# Session/Token
TIMEOUT=
EXPIRES=

# SendGrid
MIOYM_EMAIL=
SEND_GRID_RESET_PASSWORD_TEMPLATE_ID=
SEND_GRID_WELCOME_PASSWORD_TEMPLATE_ID=
SEND_GRID_API_KEY=


## Contact
* if you need help getting started or have any questions, feel free to reach out to me