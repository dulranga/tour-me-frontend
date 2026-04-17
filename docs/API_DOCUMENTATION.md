# TourMe API Documentation

This document provides a comprehensive guide to all API endpoints available in the TourMe application, including request parameters, expected request bodies, and response formats.

---

## Table of Contents

1. [Authentication Controller](#authentication-controller)
2. [User Controller](#user-controller)
3. [Itinerary Controller](#itinerary-controller)
4. [Bid Controller](#bid-controller)

---

## Authentication Controller

**Base URL:** `/api/auth`

**Purpose:** Handles user authentication, login/logout operations, and JWT token management.

### 1. User Login

- **Endpoint:** `POST /api/auth/login`
- **Description:** Authenticates a user by verifying credentials and generates JWT access and refresh tokens.
- **URL Parameters:** None
- **Query Parameters:** None
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "status": 200,
    "message": "Login successful",
    "data": {
      "userId": "123",
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```
- **Error Response (404):**
  ```json
  {
    "status": 404,
    "message": "User not found",
    "data": null
  }
  ```
- **Notes:**
  - Tokens are also set as HttpOnly cookies for security
  - Access token expires in 24 hours
  - Refresh token expires in 7 days

---

### 2. User Logout

- **Endpoint:** `POST /api/auth/logout`
- **Description:** Invalidates user tokens and clears authentication cookies.
- **URL Parameters:** None
- **Query Parameters:** None
- **Request Body:**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Success Response (200):**
  ```json
  {
    "status": 200,
    "message": "Logout successful",
    "data": null
  }
  ```
- **Notes:**
  - Clears both Authorization and RefreshToken cookies
  - Requires valid JWT token in request

---

### 3. Refresh Access Token

- **Endpoint:** `POST /api/auth/refresh-token`
- **Description:** Generates a new access token using a valid refresh token.
- **URL Parameters:** None
- **Query Parameters:** None
- **Request Body:**
  ```json
  {
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Success Response (200):**
  ```json
  {
    "status": 200,
    "message": "Token refreshed successfully",
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```
- **Error Response (401):**
  ```json
  {
    "status": 401,
    "message": "Invalid or expired refresh token",
    "data": null
  }
  ```
- **Notes:**
  - Refresh token must be valid and not expired
  - New access token is set in Authorization cookie

---

## User Controller

**Base URL:** `/api/users`

**Purpose:** Manages user accounts, registration, and user profile operations for Tourists, Drivers, and Administrators.

### 1. Get All Users

- **Endpoint:** `GET /api/users`
- **Description:** Retrieves all users in the system (Tourists, Drivers, and Administrators).
- **URL Parameters:** None
- **Query Parameters:** None
- **Request Body:** None
- **Success Response (200):**
  ```json
  {
    "status": 200,
    "message": "Users retrieved successfully",
    "data": [
      {
        "userId": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "userType": "TOURIST"
      },
      {
        "userId": 2,
        "name": "Jane Smith",
        "email": "jane@example.com",
        "userType": "DRIVER"
      }
    ]
  }
  ```

---

### 2. Get User by ID

- **Endpoint:** `GET /api/users/{id}`
- **Description:** Retrieves a specific user by their ID.
- **URL Parameters:**
  - `id` (required): Integer - User ID
- **Query Parameters:** None
- **Request Body:** None
- **Success Response (200):**
  ```json
  {
    "status": 200,
    "message": "User retrieved successfully",
    "data": {
      "userId": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "userType": "TOURIST",
      "registrationDate": "2024-01-15"
    }
  }
  ```
- **Error Response (404):**
  ```json
  {
    "status": 404,
    "message": "User not found",
    "data": null
  }
  ```

---

### 3. Register Tourist

- **Endpoint:** `POST /api/users/register/tourist`
- **Description:** Creates a new tourist account.
- **URL Parameters:** None
- **Query Parameters:** None
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "status": 200,
    "message": "Tourist registered successfully",
    "data": {
      "userId": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "userType": "TOURIST",
      "registrationDate": "2024-04-17"
    }
  }
  ```
- **Notes:**
  - Password is hashed before storage
  - Email must be unique in the system

---

### 4. Register Driver

- **Endpoint:** `POST /api/users/register/driver`
- **Description:** Creates a new driver account.
- **URL Parameters:** None
- **Query Parameters:** None
- **Request Body:**
  ```json
  {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "passwordHash": "securePassword123",
    "licenseNumber": "DL123456",
    "vehicleDetails": "Toyota Camry, Silver, License: ABC123"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "status": 200,
    "message": "Driver registered successfully",
    "data": {
      "userId": 2,
      "name": "Jane Smith",
      "email": "jane@example.com",
      "userType": "DRIVER",
      "licenseNumber": "DL123456",
      "vehicleDetails": "Toyota Camry, Silver, License: ABC123",
      "registrationDate": "2024-04-17"
    }
  }
  ```
- **Notes:**
  - License number must be unique
  - Vehicle details are required

---

### 5. Register Administrator

- **Endpoint:** `POST /api/users/register/admin`
- **Description:** Creates a new administrator account.
- **URL Parameters:** None
- **Query Parameters:** None
- **Request Body:**
  ```json
  {
    "name": "Admin User",
    "email": "admin@example.com",
    "passwordHash": "securePassword123"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "status": 200,
    "message": "Administrator registered successfully",
    "data": {
      "userId": 3,
      "name": "Admin User",
      "email": "admin@example.com",
      "userType": "ADMINISTRATOR",
      "registrationDate": "2024-04-17"
    }
  }
  ```

---

### 6. Update User Profile

- **Endpoint:** `PUT /api/users/{id}/profile`
- **Description:** Updates a user's profile information.
- **URL Parameters:**
  - `id` (required): Integer - User ID
- **Query Parameters:** None
- **Request Body:**
  ```json
  {
    "name": "John Updated",
    "email": "john.updated@example.com"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "status": 200,
    "message": "Profile updated successfully",
    "data": {
      "userId": 1,
      "name": "John Updated",
      "email": "john.updated@example.com",
      "userType": "TOURIST",
      "registrationDate": "2024-01-15"
    }
  }
  ```
- **Error Response (404):**
  ```json
  {
    "status": 404,
    "message": "User not found",
    "data": null
  }
  ```

---

### 7. Update Vehicle Details

- **Endpoint:** `PUT /api/users/{id}/vehicle`
- **Description:** Updates a driver's vehicle information.
- **URL Parameters:**
  - `id` (required): Integer - Driver ID
- **Query Parameters:** None
- **Request Body:**
  ```json
  "Toyota Corolla, White, License: XYZ789"
  ```
- **Success Response (200):**
  ```json
  {
    "status": 200,
    "message": "Vehicle details updated successfully",
    "data": {
      "userId": 2,
      "name": "Jane Smith",
      "vehicleDetails": "Toyota Corolla, White, License: XYZ789",
      "userType": "DRIVER"
    }
  }
  ```
- **Error Response (404):**
  ```json
  {
    "status": 404,
    "message": "User not found",
    "data": null
  }
  ```
- **Error Response (400):**
  ```json
  {
    "status": 400,
    "message": "User is not a driver",
    "data": null
  }
  ```

---

### 8. Get All Tourists

- **Endpoint:** `GET /api/users/tourists`
- **Description:** Retrieves all tourists in the system.
- **URL Parameters:** None
- **Query Parameters:** None
- **Request Body:** None
- **Success Response (200):**
  ```json
  {
    "status": 200,
    "message": "Tourists retrieved successfully",
    "data": [
      {
        "userId": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "userType": "TOURIST"
      }
    ]
  }
  ```

---

### 9. Get All Drivers

- **Endpoint:** `GET /api/users/drivers`
- **Description:** Retrieves all drivers in the system.
- **URL Parameters:** None
- **Query Parameters:** None
- **Request Body:** None
- **Success Response (200):**
  ```json
  {
    "status": 200,
    "message": "Drivers retrieved successfully",
    "data": [
      {
        "userId": 2,
        "name": "Jane Smith",
        "email": "jane@example.com",
        "userType": "DRIVER",
        "licenseNumber": "DL123456",
        "vehicleDetails": "Toyota Camry, Silver"
      }
    ]
  }
  ```

---

### 10. Health Check

- **Endpoint:** `GET /api/users/status`
- **Description:** Simple health check endpoint to verify the service is running.
- **URL Parameters:** None
- **Query Parameters:** None
- **Request Body:** None
- **Success Response (200):**
  ```json
  {
    "status": 200,
    "message": "Service is healthy",
    "data": "TourMe service is running"
  }
  ```

---

## Itinerary Controller

**Base URL:** `/api/itineraries`

**Purpose:** Manages itinerary creation, retrieval, and cancellation. Itineraries represent trips created by tourists that drivers can bid on.

### 1. Create Itinerary

- **Endpoint:** `POST /api/itineraries`
- **Description:** Creates a new itinerary for a tourist.
- **URL Parameters:** None
- **Query Parameters:**
  - `touristId` (required): Integer - ID of the tourist creating the itinerary
- **Request Body:**
  ```json
  {
    "pickupLocation": "123 Main Street, City A",
    "destination": "456 Oak Avenue, City B",
    "pickupTime": "2024-04-20T14:30:00",
    "estimatedDuration": 120,
    "maxBudget": 5000,
    "numberOfPassengers": 4,
    "specialRequirements": "Wheelchair accessible vehicle"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "status": 200,
    "message": "Itinerary created successfully",
    "data": {
      "itineraryId": 1,
      "touristId": 1,
      "pickupLocation": "123 Main Street, City A",
      "destination": "456 Oak Avenue, City B",
      "pickupTime": "2024-04-20T14:30:00",
      "estimatedDuration": 120,
      "maxBudget": 5000,
      "numberOfPassengers": 4,
      "specialRequirements": "Wheelchair accessible vehicle",
      "status": "OPEN",
      "createdAt": "2024-04-17T10:00:00"
    }
  }
  ```

---

### 2. Get Available Itineraries

- **Endpoint:** `GET /api/itineraries/available`
- **Description:** Retrieves all itineraries that are currently available for drivers to bid on.
- **URL Parameters:** None
- **Query Parameters:** None
- **Request Body:** None
- **Success Response (200):**
  ```json
  {
    "status": 200,
    "message": "Available itineraries retrieved successfully",
    "data": [
      {
        "itineraryId": 1,
        "touristId": 1,
        "pickupLocation": "123 Main Street, City A",
        "destination": "456 Oak Avenue, City B",
        "pickupTime": "2024-04-20T14:30:00",
        "estimatedDuration": 120,
        "maxBudget": 5000,
        "numberOfPassengers": 4,
        "status": "OPEN",
        "createdAt": "2024-04-17T10:00:00"
      }
    ]
  }
  ```

---

### 3. Get Itinerary Details

- **Endpoint:** `GET /api/itineraries/{id}`
- **Description:** Retrieves detailed information about a specific itinerary.
- **URL Parameters:**
  - `id` (required): Integer - Itinerary ID
- **Query Parameters:** None
- **Request Body:** None
- **Success Response (200):**
  ```json
  {
    "status": 200,
    "message": "Itinerary retrieved successfully",
    "data": {
      "itineraryId": 1,
      "touristId": 1,
      "pickupLocation": "123 Main Street, City A",
      "destination": "456 Oak Avenue, City B",
      "pickupTime": "2024-04-20T14:30:00",
      "estimatedDuration": 120,
      "maxBudget": 5000,
      "numberOfPassengers": 4,
      "specialRequirements": "Wheelchair accessible vehicle",
      "status": "OPEN",
      "createdAt": "2024-04-17T10:00:00"
    }
  }
  ```
- **Error Response (404):**
  ```json
  {
    "status": 404,
    "message": "Itinerary not found",
    "data": null
  }
  ```

---

### 4. Get User Itineraries

- **Endpoint:** `GET /api/itineraries/user/{userId}`
- **Description:** Retrieves all itineraries created by a specific tourist.
- **URL Parameters:**
  - `userId` (required): Integer - Tourist's user ID
- **Query Parameters:** None
- **Request Body:** None
- **Success Response (200):**
  ```json
  {
    "status": 200,
    "message": "User itineraries retrieved successfully",
    "data": [
      {
        "itineraryId": 1,
        "touristId": 1,
        "pickupLocation": "123 Main Street, City A",
        "destination": "456 Oak Avenue, City B",
        "pickupTime": "2024-04-20T14:30:00",
        "maxBudget": 5000,
        "status": "OPEN",
        "createdAt": "2024-04-17T10:00:00"
      },
      {
        "itineraryId": 2,
        "touristId": 1,
        "pickupLocation": "789 Pine Road, City C",
        "destination": "321 Elm Street, City D",
        "pickupTime": "2024-04-25T16:00:00",
        "maxBudget": 3500,
        "status": "CANCELLED",
        "createdAt": "2024-04-18T11:30:00"
      }
    ]
  }
  ```

---

### 5. Cancel Itinerary

- **Endpoint:** `DELETE /api/itineraries/{id}`
- **Description:** Cancels an itinerary (soft delete - sets status to CANCELLED without removing the record from the database).
- **URL Parameters:**
  - `id` (required): Integer - Itinerary ID to cancel
- **Query Parameters:** None
- **Request Body:** None
- **Success Response (200):**
  ```json
  {
    "status": 200,
    "message": "Itinerary cancelled successfully",
    "data": {
      "itineraryId": 1,
      "touristId": 1,
      "status": "CANCELLED",
      "cancelledAt": "2024-04-17T12:00:00"
    }
  }
  ```
- **Error Response (404):**
  ```json
  {
    "status": 404,
    "message": "Itinerary not found",
    "data": null
  }
  ```

---

## Bid Controller

**Base URL:** `/api/bids`

**Purpose:** Manages bidding system where drivers submit bids for tourist itineraries and tourists select preferred bids.

### 1. Submit Bid

- **Endpoint:** `POST /api/bids`
- **Description:** Allows a driver to submit a bid for a specific itinerary.
- **URL Parameters:** None
- **Query Parameters:**
  - `driverId` (required): Integer - ID of the driver placing the bid
  - `itineraryId` (required): Integer - ID of the itinerary being bid on
- **Request Body:**
  ```json
  {
    "bidAmount": 4500,
    "estimatedArrivalTime": "2024-04-20T14:15:00",
    "notes": "I have a comfortable sedan with AC",
    "vehicleDetails": "Toyota Camry, Silver"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "status": 200,
    "message": "Bid submitted successfully",
    "data": {
      "bidId": 1,
      "driverId": 2,
      "itineraryId": 1,
      "bidAmount": 4500,
      "estimatedArrivalTime": "2024-04-20T14:15:00",
      "notes": "I have a comfortable sedan with AC",
      "vehicleDetails": "Toyota Camry, Silver",
      "status": "PENDING",
      "submittedAt": "2024-04-17T10:30:00"
    }
  }
  ```

---

### 2. Get Bids for Itinerary

- **Endpoint:** `GET /api/bids/itinerary/{itineraryId}`
- **Description:** Retrieves all bids placed for a specific itinerary.
- **URL Parameters:**
  - `itineraryId` (required): Integer - Itinerary ID
- **Query Parameters:** None
- **Request Body:** None
- **Success Response (200):**
  ```json
  {
    "status": 200,
    "message": "Bids retrieved successfully",
    "data": [
      {
        "bidId": 1,
        "driverId": 2,
        "itineraryId": 1,
        "bidAmount": 4500,
        "estimatedArrivalTime": "2024-04-20T14:15:00",
        "notes": "I have a comfortable sedan with AC",
        "status": "PENDING",
        "submittedAt": "2024-04-17T10:30:00"
      },
      {
        "bidId": 2,
        "driverId": 3,
        "itineraryId": 1,
        "bidAmount": 4200,
        "estimatedArrivalTime": "2024-04-20T14:10:00",
        "notes": "SUV available",
        "status": "PENDING",
        "submittedAt": "2024-04-17T11:00:00"
      }
    ]
  }
  ```

---

### 3. Get Bids for Driver

- **Endpoint:** `GET /api/bids/driver/{driverId}`
- **Description:** Retrieves all bids submitted by a specific driver.
- **URL Parameters:**
  - `driverId` (required): Integer - Driver's user ID
- **Query Parameters:** None
- **Request Body:** None
- **Success Response (200):**
  ```json
  {
    "status": 200,
    "message": "Driver bids retrieved successfully",
    "data": [
      {
        "bidId": 1,
        "driverId": 2,
        "itineraryId": 1,
        "bidAmount": 4500,
        "notes": "I have a comfortable sedan with AC",
        "status": "PENDING",
        "submittedAt": "2024-04-17T10:30:00"
      },
      {
        "bidId": 3,
        "driverId": 2,
        "itineraryId": 5,
        "bidAmount": 3200,
        "notes": "Can leave immediately",
        "status": "SELECTED",
        "submittedAt": "2024-04-17T09:00:00"
      }
    ]
  }
  ```

---

### 4. Get Bid by ID

- **Endpoint:** `GET /api/bids/{id}`
- **Description:** Retrieves detailed information about a specific bid.
- **URL Parameters:**
  - `id` (required): Integer - Bid ID
- **Query Parameters:** None
- **Request Body:** None
- **Success Response (200):**
  ```json
  {
    "status": 200,
    "message": "Bid retrieved successfully",
    "data": {
      "bidId": 1,
      "driverId": 2,
      "itineraryId": 1,
      "bidAmount": 4500,
      "estimatedArrivalTime": "2024-04-20T14:15:00",
      "notes": "I have a comfortable sedan with AC",
      "vehicleDetails": "Toyota Camry, Silver",
      "status": "PENDING",
      "submittedAt": "2024-04-17T10:30:00"
    }
  }
  ```
- **Error Response (404):**
  ```json
  {
    "status": 404,
    "message": "Bid not found",
    "data": null
  }
  ```

---

### 5. Select Bid

- **Endpoint:** `POST /api/bids/{id}/select`
- **Description:** Allows a tourist to select a specific bid for their itinerary.
- **URL Parameters:**
  - `id` (required): Integer - Bid ID to select
- **Query Parameters:**
  - `touristId` (required): Integer - ID of the tourist selecting the bid
- **Request Body:** None
- **Success Response (200):**
  ```json
  {
    "status": 200,
    "message": "Bid selected successfully",
    "data": {
      "bidId": 1,
      "driverId": 2,
      "itineraryId": 1,
      "touristId": 1,
      "bidAmount": 4500,
      "status": "SELECTED",
      "selectedAt": "2024-04-17T12:00:00"
    }
  }
  ```
- **Error Response (404):**
  ```json
  {
    "status": 404,
    "message": "Bid not found",
    "data": null
  }
  ```
- **Notes:**
  - The tourist making the selection must be the owner of the itinerary
  - Once a bid is selected, other bids for the same itinerary may be rejected

---

## Response Format

All API responses follow a consistent format:

```json
{
  "status": 200,
  "message": "Descriptive message",
  "data": {}
}
```

### Common HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200  | OK - Request successful |
| 400  | Bad Request - Invalid parameters |
| 401  | Unauthorized - Invalid/missing authentication |
| 404  | Not Found - Resource not found |
| 500  | Internal Server Error - Server error |

---

## Authentication

Most endpoints require JWT authentication via:
- **Bearer Token:** Include in `Authorization: Bearer <token>` header
- **Cookies:** Automatic with `Authorization` and `RefreshToken` cookies

---

## Error Handling

All errors follow the standard response format with appropriate HTTP status codes and descriptive messages.

