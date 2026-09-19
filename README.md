# CinePrime

A full-stack movie and theatre ticket booking system built with **React.js, Spring Boot, PostgreSQL, Docker, and JWT authentication**.

Users can browse movies, view shows, select seats, book tickets, cancel bookings, and view their ticket history. Administrators can manage movies, theatres, screens, and shows through a protected admin portal.

## Screenshots

### Home Page
<p align="center">
  <img src="screenshots/home.png" width="800">
</p>

### Seat Selection
<p align="center">
  <img src="screenshots/seat-selection.png" width="800">
</p>

### My Tickets
<p align="center">
  <img src="screenshots/my-tickets.png" width="800">
</p>

### Admin Dashboard
<p align="center">
  <img src="screenshots/admin-dashboard.png" width="800">
</p>

## Features

- User registration and JWT-based authentication
- Role-based access control for users and admins
- Browse movies and scheduled shows
- Interactive seat selection
- Automatic seat generation for new screens
- Multiple theatre and screen layouts
- Ticket booking and cancellation
- Real-time seat availability
- Concurrent booking protection
- Booking history and total spending
- Movie, theatre, screen, and show management
- Ticket price management
- PostgreSQL referential integrity

## Tech Stack

- **Frontend:** React.js, JavaScript, Vite, React Router
- **Backend:** Java, Spring Boot, Spring Security, Spring Data JPA
- **Authentication:** JWT, BCrypt
- **Database:** PostgreSQL
- **Containerization:** Docker, Docker Compose
- **API Testing:** Postman
- **Version Control:** Git, GitHub

## Architecture

```text
React.js
    │
    │ REST API + JWT
    ▼
Spring Boot
    │
    │ JPA / Hibernate
    ▼
PostgreSQL
    │
    ▼
Docker Container
