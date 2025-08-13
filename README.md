# Campus Ride Sharing

All-in-one campus ride-sharing application with a React frontend and a Spring Boot (Maven) backend using MySQL. Supports riders, drivers, and a powerful admin dashboard.

## Features

- Authentication with JWT (Register, Login, Logout)
- Roles: Rider, Driver, Admin
- Offer a ride (Drivers)
- Find and book rides (Riders)
- Manage bookings (view, cancel)
- Admin dashboard (stats, users, rides, bookings)
- Campus-friendly locations (Academic Blocks, Hostels, Library, etc.)

## Tech Stack

- Frontend: React, React Router, Context API, Axios, Tailwind (CDN)
- Backend: Spring Boot, Spring Data JPA, Spring Security (JWT), Validation
- Database: MySQL
- Build/Tools: Maven, Java 21, Node.js + npm

## Monorepo Structure

```
Campus_Ride/
  campus-ride-app/           # React app
  server-spring/             # Spring Boot backend (Maven)
  README.md                  # You are here
```

## Prerequisites

- Node.js 18+ and npm
- Java 21
- Maven 3.9+ (or use the Chocolatey-installed path in Windows)
- MySQL 8+ (running locally)

## Backend Setup (Spring Boot)

1) Create database in MySQL (adjust name if you like):
```sql
CREATE DATABASE campus_ride CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
```

2) Configure `server-spring/src/main/resources/application.yml` with your MySQL credentials and DB name.

3) Run the backend (Windows, using Chocolatey Maven path):
```bash
cd server-spring
C:\ProgramData\chocolatey\lib\maven\apache-maven-3.9.11\bin\mvn.cmd -DskipTests spring-boot:run
```

The API will be available at `http://localhost:8080/api`.

Admin seeding: On first run, an Admin user is created by `DataSeeder`.
- Email: `admin@gmail.com`
- Password: `Admin@123`

## Frontend Setup (React)

1) Install dependencies and run:
```bash
cd campus-ride-app
npm install
npm start
```

If port 3000 is busy, accept the prompt to use another port (e.g., 3001). The app will open at something like `http://localhost:3001/campus-ride-app`.

The frontend is configured to call the backend at `http://localhost:8080/api` via a centralized Axios instance in `src/api/index.js`.

## Key URLs

- User Login/Register: `/login`
- Admin Login: `/admin/login`
- Admin Dashboard: `/admin`
- Find Rides: `/rides`
- My Bookings: `/bookings`

## Common Commands

Frontend
```bash
cd campus-ride-app
npm install
npm start
npm run build
```

Backend
```bash
cd server-spring
C:\ProgramData\chocolatey\lib\maven\apache-maven-3.9.11\bin\mvn.cmd -DskipTests spring-boot:run
```

## Troubleshooting

- Port 8080 already in use
  - Find and kill process:
  ```bash
  netstat -ano | findstr :8080
  taskkill /F /PID <PID>
  ```

- Port 3000 already in use
  - When prompted by React, press Y to use the next available port (e.g., 3001).

- `mvn` not recognized on Windows
  - Use full path to Chocolatey’s Maven: `C:\ProgramData\chocolatey\lib\maven\apache-maven-3.9.11\bin\mvn.cmd`
  - Or install Maven and add it to PATH.

- Authentication errors in UI
  - Ensure backend is running on 8080 and MySQL credentials are correct.
  - Frontend stores JWT in `localStorage` and attaches it via Axios interceptor.

- CORS issues
  - `CorsConfig` allows `http://localhost:3000`. If you run on another port (e.g., 3001), update allowed origins.

## Notes

- Admin has full control over user and system data via the dashboard.
- Campus location names are used instead of city names per the requirement.

## License

This project is for educational purposes. Add a license of your choice if you plan to distribute.

