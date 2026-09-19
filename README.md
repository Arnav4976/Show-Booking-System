# CinePrime

A full-stack movie and theatre ticket booking platform built with React.js and Spring Boot. CinePrime allows users to browse movies, view showtimes, select seats, book tickets, cancel bookings, and view their booking history. Administrators can manage movies, theatres, screens, and scheduled shows through a dedicated admin portal.

The application uses PostgreSQL for persistent data storage, Docker for database containerization, and JWT-based authentication with Spring Security for secure user and admin access.

## Features

### Guest / User Features

- Browse currently showing and upcoming movies
- View movie details
- View available showtimes
- Select seats using interactive seat layouts
- Book tickets
- Prevent double-booking of seats
- Cancel bookings
- View previous and active tickets
- View booking details and movie posters
- View total amount spent on active bookings
- User-specific booking history
- JWT-based authentication

### Admin Features

- Admin authentication with role-based access control
- Create, edit, and delete movies
- Set movie status between Now Showing and Coming Soon
- Create and manage theatres
- Configure theatre city and address
- Create and manage screens
- Configure different screen layouts
- Automatically generate seats for newly created screens
- Schedule shows
- Set show start/end times
- Set ticket prices
- Manage scheduled shows
- Protected admin dashboard

### Security Features

- JWT authentication
- BCrypt password hashing
- Spring Security authorization
- Role-based access control
- Protected API endpoints
- Protected React routes
- Admin-only CRUD operations
- Dynamic authenticated user IDs
- Authorization headers automatically attached to API requests
- Stateless authentication

### Data Integrity

- PostgreSQL foreign-key constraints
- Prevention of invalid deletion of referenced entities
- Booking history preserved after cancellation
- Cancelled bookings retain their historical records
- Seat availability is restored after cancellation
- Concurrent seat booking protection
- HTTP 409 Conflict handling for booking conflicts
- Frontend error handling for failed operations

## Screenshots

### Home Page

<p align="center">
  <img src="screenshots/home.png" width="800">
</p>

### Movie Details

<p align="center">
  <img src="screenshots/movie-details.png" width="800">
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

> Replace the screenshot filenames above with the actual files included in the repository.

## Tech Stack

### Frontend

- React.js
- JavaScript
- Vite
- React Router
- HTML5
- CSS3

### Backend

- Java
- Spring Boot
- Spring Security
- JWT
- Spring Data JPA
- Hibernate
- Maven

### Database

- PostgreSQL
- Docker
- Docker Compose

### Development Tools

- Git
- GitHub
- Postman

## Architecture

                         ┌─────────────────────┐
                         │     React.js UI     │
                         │      Vite App       │
                         └──────────┬──────────┘
                                    │
                                    │ HTTP / REST
                                    │ JWT
                                    ▼
                         ┌─────────────────────┐
                         │   Spring Boot API   │
                         │                     │
                         │ Controllers         │
                         │ Services            │
                         │ Spring Security     │
                         │ JWT Authentication  │
                         └──────────┬──────────┘
                                    │
                                    │ JPA / Hibernate
                                    ▼
                         ┌─────────────────────┐
                         │ PostgreSQL Database │
                         │                     │
                         │ Docker Container    │
                         └─────────────────────┘
