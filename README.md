# Car Parking System Application

A web-based Car Parking System application built using Node.js, MongoDB, Pug.js, Sass, and JavaScript. This project provides a user-friendly interface for managing parking slots, reserving spots, and tracking parking history.

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [Acknowledgements](#acknowledgements)

## Project Overview
This application streamlines parking management by allowing users to:
- View available parking slots in real-time
- Reserve parking spots for specific time periods
- Manage user accounts and parking history
- Administer parking zones (admin role)

The backend is built with **Node.js** and **Express.js**, while the frontend uses **Pug.js** for templating and **Sass** for styling. Data is persisted in **MongoDB**, and client-side interactivity is handled with vanilla JavaScript.

## Features
### User Features
- 🚀 User registration and authentication
- 📍 Real-time parking slot availability visualization
- 🕒 Time-based reservation system
- 📅 Parking history tracking
- 📱 Responsive mobile-first design

### Admin Features
- 🔑 Admin dashboard with analytics
- 🛠 Parking slot management (add/remove/update slots)
- 📊 User activity monitoring
- ⚙ Reservation override capabilities

## Technologies Used
- **Backend**: 
  - Node.js
  - Express.js
  - MongoDB (with Mongoose ODM)
- **Frontend**:
  - Pug.js (templating engine)
  - Sass (CSS preprocessor)
  - Vanilla JavaScript
- **Tools**:
  - Bcrypt (password hashing)
  - Passport.js (authentication)
  - Dotenv (environment variables)
  - Nodemon (development server)

## Installation
Follow these steps to set up the project locally:

1. **Clone the repository**:
   bash
   git clone https://github.com/Abram-Emad/Car-Parking-System-Application-Using-Node.js-MongoDB-Pug.js-Sass-and-JavaScript.git
   cd Car-Parking-System-Application-Using-Node.js-MongoDB-Pug.js-Sass-and-JavaScript
   

2. **Install dependencies**:
   bash
   npm install
   

## Configuration
Create a `.env` file in the root directory with the following variables:
env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/parking-system
SESSION_SECRET=your_session_secret_here
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=securepassword123


**Important**: 
- Replace the session secret with a strong random string
- Change default admin credentials before deployment
- Never commit the `.env` file to version control

## API Endpoints
The application provides RESTful API endpoints for integration:

| Endpoint                | Method | Description                     |
|-------------------------|--------|---------------------------------|
| `/api/reservations`     | GET    | Get all reservations           |
| `/api/reservations`     | POST   | Create new reservation         |
| `/api/users`            | GET    | Get all users (admin only)     |
| `/api/parking-spots`    | GET    | Get all parking spots          |
| `/admin/api/stats`      | GET    | Get system statistics          |

## Project Structure

- ├── models/
- │   ├── user.js
- │   ├── parkingSpot.js
- │   └── reservation.js
- ├── routes/
- │   ├── auth.js
- │   ├── user.js
- │   └── admin.js
- ├── views/
- │   ├── layouts/
- │   ├── partials/
- │   └── *.pug
= ├── public/
- │   ├── sass/
- │   ├── js/
- │   └── css/
- ├── controllers/
- ├── middleware/
- ├── .env.example
- └── app.js


## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

**Guidelines**:
- Write clear commit messages
- Include tests for new features
- Maintain consistent coding style
- Update documentation as needed

## Acknowledgements
- Node.js community for ecosystem support
- MongoDB for flexible database solutions
- Express.js team for robust web framework
- Pug.js maintainers for templating engine
- Open source contributors for various dependencies
