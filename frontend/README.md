# Frontend README

## Project Overview

This project is the frontend component of the SecurepassAI-Admin-Development application. It is built using modern web technologies to provide a seamless user experience.

## Technologies Used

- **React**: A JavaScript library for building user interfaces.
- **Redux**: A predictable state container for JavaScript apps.
- **Axios**: Promise-based HTTP client for the browser and Node.js.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **Sass**: A preprocessor scripting language that is interpreted or compiled into CSS.

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js (>= 14.x)
- npm (>= 6.x) or yarn (>= 1.x)

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/chathuradissanayake/SecurepassAI-Admin-Development.git
    ```
2. Navigate to the frontend directory:
    ```sh
    cd SecurepassAI-Admin-Development/frontend
    ```
3. Install the dependencies:
    ```sh
    npm install
    ```
    or
    ```sh
    yarn install
    ```

### Environment Variables

Create a `.env` file in the root of the `frontend` directory and add the following environment variable:

```
VITE_API_URL=<your_api_url>
```

    

### Running the Application

To start the development server, run:
```sh
npm start
```
or
```sh
yarn start
```
The application will be available at `http://localhost:3000`.

### Building for Production

To create a production build, run:
```sh
npm run build
```
or
```sh
yarn build
```
The production-ready files will be in the `build` directory.
