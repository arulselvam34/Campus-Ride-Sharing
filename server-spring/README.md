# Campus Ride Spring Boot Backend

## Run
1. Create MySQL DB:
```sql
CREATE DATABASE campus_ride CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
2. Configure `src/main/resources/application.yml` with username/password.
3. Start:
```bash
mvn spring-boot:run
```

## REST Endpoints
- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- Rides: `GET /api/rides?page=&size=&start=&destination=&date=YYYY-MM-DD`, `POST /api/rides?driverId=`, `GET /api/rides/driver/{driverId}`
- Bookings: `POST /api/bookings` (body: `{riderId, rideId, seats}`), `DELETE /api/bookings/{id}`, `GET /api/bookings/user/{userId}`
- Users (Admin): CRUD `/api/users`

