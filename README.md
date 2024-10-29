# Vehicle Travel Tracker

This project is a comprehensive vehicle tracking system that visualizes and analyzes vehicle trips using GPS data. It includes features for calculating travel distance, idling, stoppages, and speed. The frontend, developed with React/Vue and Leaflet for mapping, displays routes and dynamically updates trip details. The backend, built with Express.js, manages data storage and calculations using MongoDB/MySQL.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Database Structure](#database-structure)
- [Project Structure](#project-structure)
- [Future Enhancements](#future-enhancements)
- [License](#license)

---

## Features

- **Upload GPS Data**: Upload CSV files containing GPS coordinates to track vehicle trips.
- **Map Visualization**: Display vehicle routes on a map with color-coded paths for speed zones.
  - **Green**: Normal speed
  - **Cyan**: Over-speeding (above 60)
  - **Red**: Stoppage points (ignition off)
  - **Pink**: Idling points (ignition on, speed = 0)
- **Trip Metrics**: Calculate total distance, idling time, and stoppage time.
- **Multi-Trip Viewing**: Select multiple trips to display simultaneously on the map.
- **Authentication**: Secure login and registration to ensure user-specific trip management.

## Technologies

### Frontend

- **Framework**: React.js / Vue.js
- **Libraries**: Leaflet (for map visualization), Tailwind CSS
- **State Management**: React Context / Vuex
- **Notifications**: React Hot Toast
- **Validation**: Formik and Yup

### Backend

- **Framework**: Express.js
- **Libraries**: Mongoose (MongoDB), Multer (for file uploads), Geolib (for distance calculation)
- **Authentication**: JWT (JSON Web Tokens)

### Database

- **Options**: MongoDB / MySQL

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- MongoDB or MySQL database instance

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/vehicle-travel-tracker.git
   cd vehicle-travel-tracker
   ```

2. **Backend Setup**

   - Navigate to the backend directory and install dependencies.
     ```bash
     cd backend
     npm install
     ```
   - Create a `.env` file in the `backend` directory with the following details:
     ```plaintext
     PORT=5000
     FRONT_END_URL=http://localhost:3000
     DATABASE_URI=your_database_uri
     JWT_SECRET=your_jwt_secret
     ```
   - Start the backend server.
     ```bash
     npm run dev
     ```

3. **Frontend Setup**

   - Navigate to the frontend directory and install dependencies.
     ```bash
     cd frontend
     npm install
     ```
   - Create a `.env` file in the `frontend` directory with:
     ```plaintext
     VITE_BACKEND_URL=http://localhost:5000
     ```
   - Start the frontend server.
     ```bash
     npm run dev
     ```

4. **Access the Application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

## Usage

1. **Login** or **Register** to begin.
2. **Upload a Trip**: On the upload screen, select a CSV file containing GPS data.
3. **View Trips**: Select and view multiple trips on the map.
4. **View Trip Details**: Click on a trip to see distance, duration, idling, stoppages, and speed metrics.

## API Endpoints

| Method | Endpoint                 | Description                      |
| ------ | ------------------------ | -------------------------------- |
| POST   | `/auth/register`         | Register a new user              |
| POST   | `/auth/login`            | Login user                       |
| GET    | `/trip/getTrips`         | Retrieve all trips for a user    |
| POST   | `/trip/addTrip`          | Upload a new trip                |
| DELETE | `/trip/deleteTrips`      | Delete selected trips            |
| POST   | `/trip/getSelectedTrips` | Fetch details for selected trips |

## Database Structure

### MongoDB / MySQL Tables

- **Users**: Store user details (name, email, password)
- **Trips**: Contains trip details like trip ID, user ID, start time, end time, and distance.
- **Coordinates**: Stores GPS coordinates (latitude, longitude, timestamp, speed)

## Project Structure

### Backend

```plaintext
backend/
├── config/             # Configuration files (e.g., MongoDB connection)
├── controller/         # Controllers for handling request logic
├── middleware/         # Authentication middleware
├── models/             # Mongoose/Sequelize models
├── routes/             # Express routes
├── .env                # Environment variables
└── index.js            # Entry point for the Express app
```

### Frontend

```plaintext
frontend/
├── src/
│   ├── components/       # UI Components
│   ├── pages/            # Page components
│   ├── services/         # API service functions
│   ├── App.js            # Main app component
│   └── main.js           # Entry point for React/Vue app
├── public/               # Static assets
└── .env                  # Frontend environment variables
```

## Future Enhancements

- **Real-Time Tracking**: Add WebSocket support for real-time tracking.
- **Enhanced Authentication**: Support multi-factor authentication.
- **Additional Map Overlays**: Weather data overlay on the map.
- **Analytics Dashboard**: Display aggregate data for multiple trips.

## License

This project is licensed under the MIT License.
