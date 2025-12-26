# ClashChat API Documentation

## Base URL
```
http://localhost:5000
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_access_token>
```

---

## Authentication Endpoints

### 1. Sign Up

**Endpoint:** `POST /api/auth/signup`

**Description:** Register a new user account.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation:**
- `username`: 3-30 characters
- `email`: Valid email format
- `password`: Minimum 6 characters

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "email": "john@example.com",
      "avatar": "",
      "status": "offline"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (409):**
```json
{
  "success": false,
  "message": "User already exists",
  "error": "Email or username already registered"
}
```

---

### 2. Login

**Endpoint:** `POST /api/auth/login`

**Description:** Authenticate user and receive tokens.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "email": "john@example.com",
      "avatar": "",
      "status": "online"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Login failed",
  "error": "Invalid credentials"
}
```

---

### 3. Refresh Token

**Endpoint:** `POST /api/auth/refresh`

**Description:** Get new access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 4. Logout

**Endpoint:** `POST /api/auth/logout`

**Description:** Logout user and invalidate refresh token.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## Friend Management Endpoints

### 5. Get Friends

**Endpoint:** `GET /api/friends`

**Description:** Get list of all accepted friends.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Friends retrieved successfully",
  "data": {
    "friends": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "username": "jane_doe",
        "email": "jane@example.com",
        "avatar": "",
        "status": "online",
        "lastSeen": "2024-12-24T08:38:00.000Z"
      }
    ]
  }
}
```

---

### 6. Search Users

**Endpoint:** `GET /api/friends/search?query=<search_term>`

**Description:** Search for users by username or email.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `query` (required): Search term (username or email)

**Example:**
```
GET /api/friends/search?query=jane
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Users found",
  "data": {
    "users": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "username": "jane_doe",
        "email": "jane@example.com",
        "avatar": "",
        "status": "offline"
      }
    ]
  }
}
```

---

### 7. Get Pending Requests

**Endpoint:** `GET /api/friends/requests`

**Description:** Get all pending friend requests received.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Pending requests retrieved",
  "data": {
    "requests": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "requester": {
          "_id": "507f1f77bcf86cd799439012",
          "username": "jane_doe",
          "email": "jane@example.com",
          "avatar": "",
          "status": "online"
        },
        "status": "pending",
        "createdAt": "2024-12-24T08:38:00.000Z"
      }
    ]
  }
}
```

---

### 8. Send Friend Request

**Endpoint:** `POST /api/friends/add`

**Description:** Send a friend request to another user.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "recipientId": "507f1f77bcf86cd799439012"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Friend request sent",
  "data": {
    "friendship": {
      "_id": "507f1f77bcf86cd799439013",
      "requester": "507f1f77bcf86cd799439011",
      "recipient": {
        "_id": "507f1f77bcf86cd799439012",
        "username": "jane_doe",
        "email": "jane@example.com",
        "avatar": ""
      },
      "status": "pending",
      "createdAt": "2024-12-24T08:38:00.000Z"
    }
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Already friends",
  "error": "You are already friends with this user"
}
```

---

### 9. Accept Friend Request

**Endpoint:** `PUT /api/friends/accept/:requestId`

**Description:** Accept a pending friend request.

**Headers:**
```
Authorization: Bearer <access_token>
```

**URL Parameters:**
- `requestId`: ID of the friend request

**Success Response (200):**
```json
{
  "success": true,
  "message": "Friend request accepted",
  "data": {
    "friendship": {
      "_id": "507f1f77bcf86cd799439013",
      "requester": {
        "_id": "507f1f77bcf86cd799439012",
        "username": "jane_doe",
        "email": "jane@example.com",
        "avatar": "",
        "status": "online"
      },
      "recipient": "507f1f77bcf86cd799439011",
      "status": "accepted",
      "createdAt": "2024-12-24T08:38:00.000Z"
    }
  }
}
```

---

### 10. Remove Friend

**Endpoint:** `DELETE /api/friends/remove/:friendId`

**Description:** Remove a friend from your friend list.

**Headers:**
```
Authorization: Bearer <access_token>
```

**URL Parameters:**
- `friendId`: ID of the friend to remove

**Success Response (200):**
```json
{
  "success": true,
  "message": "Friend removed successfully"
}
```

---

## Message Endpoints

### 11. Get Messages

**Endpoint:** `GET /api/messages/:friendId?limit=50&skip=0`

**Description:** Get chat history with a specific friend.

**Headers:**
```
Authorization: Bearer <access_token>
```

**URL Parameters:**
- `friendId`: ID of the friend

**Query Parameters:**
- `limit` (optional): Number of messages to retrieve (default: 50)
- `skip` (optional): Number of messages to skip (default: 0)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Messages retrieved successfully",
  "data": {
    "messages": [
      {
        "_id": "507f1f77bcf86cd799439014",
        "sender": {
          "_id": "507f1f77bcf86cd799439011",
          "username": "john_doe",
          "avatar": ""
        },
        "receiver": {
          "_id": "507f1f77bcf86cd799439012",
          "username": "jane_doe",
          "avatar": ""
        },
        "content": "Hello!",
        "messageType": "text",
        "status": "read",
        "createdAt": "2024-12-24T08:38:00.000Z"
      }
    ],
    "unreadCount": 0
  }
}
```

---

### 12. Send Message

**Endpoint:** `POST /api/messages/send`

**Description:** Send a message to a friend.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "receiverId": "507f1f77bcf86cd799439012",
  "content": "Hello, how are you?",
  "messageType": "text"
}
```

**Fields:**
- `receiverId` (required): ID of the message receiver
- `content` (required): Message content
- `messageType` (optional): Type of message (text, image, file) - default: text

**Success Response (201):**
```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "message": {
      "_id": "507f1f77bcf86cd799439014",
      "sender": {
        "_id": "507f1f77bcf86cd799439011",
        "username": "john_doe",
        "avatar": ""
      },
      "receiver": {
        "_id": "507f1f77bcf86cd799439012",
        "username": "jane_doe",
        "avatar": ""
      },
      "content": "Hello, how are you?",
      "messageType": "text",
      "status": "sent",
      "createdAt": "2024-12-24T08:38:00.000Z"
    }
  }
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Not friends",
  "error": "You can only send messages to friends"
}
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Not allowed to access resource |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 500 | Internal Server Error |

---

## Common Error Response Format

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error description"
}
```

---

## Rate Limiting

Currently no rate limiting is implemented. For production, consider adding rate limiting middleware.

---

## Pagination

For endpoints that return lists (like messages), use `limit` and `skip` query parameters:

```
GET /api/messages/:friendId?limit=20&skip=0
```

- First page: `skip=0, limit=20`
- Second page: `skip=20, limit=20`
- Third page: `skip=40, limit=20`

---

## WebSocket Documentation

See `SETUP.md` for detailed Socket.io event documentation.
