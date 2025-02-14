# SecurepassAI-Admin

## Project Overview

SecurepassAI-Admin-Development is a MERN stack-based web application. It consists of a **frontend** built with React and a **backend** powered by Express.js and MongoDB. The application provides an admin panel for managing secure access control.

## Technologies Used

### Frontend
- **React**: A JavaScript library for building user interfaces.
- **Redux**: A predictable state container for JavaScript apps.
- **Axios**: Promise-based HTTP client for making API requests.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **Sass**: A preprocessor scripting language interpreted into CSS.

### Backend
- **Node.js**: JavaScript runtime for backend development.
- **Express.js**: A minimal and flexible Node.js web application framework.
- **MongoDB**: NoSQL database for storing application data.
- **Bcrypt**: Library for hashing passwords securely.

## Getting Started

### Prerequisites
Ensure you have the following installed:
- Node.js (>= 14.x)
- npm (>= 6.x) or yarn (>= 1.x)
- MongoDB (installed locally or a cloud instance like MongoDB Atlas)

## Installation

### Clone the Repository
```sh
git clone https://github.com/yourusername/SecurepassAI-Admin-Development.git
cd SecurepassAI-Admin-Development
```

### Backend Setup
1. Navigate to the backend directory:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the root of the `backend` directory and add:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   FRONTEND_URL=your_frontend_url
   ```
4. Start the backend server:
   ```sh
   npm start
   ```
   The backend will be running at `http://localhost:5000`.

### Frontend Setup
1. Navigate to the frontend directory:
   ```sh
   cd ../frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
   or
   ```sh
   yarn install
   ```
3. Create a `.env` file in the root of the `frontend` directory and add:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
4. Start the frontend development server:
   ```sh
   npm start
   ```
   or
   ```sh
   yarn start
   ```
   The application will be available at `http://localhost:3000`.

## Building for Production

### Backend
For production deployment, use a process manager like **PM2**:
```sh
npm install -g pm2
pm run build
pm start
```

### Frontend
To create a production build:
```sh
npm run build
```
The optimized files will be available in the `build` directory.

## Contributing
Feel free to fork this repository and submit pull requests. Any contributions are welcome!

## License
This project is licensed under the MIT License.

## Contact
For any issues or feature requests, please create an issue in the repository.

---

This README provides a structured overview of the **SecurepassAI-Admin-Development** application, combining both frontend and backend instructions in a seamless manner.

