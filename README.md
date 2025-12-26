# ClashChat - Real-Time Chat Application Backend

## 📝 Short Description (for GitHub repo description)

A production-ready real-time chat application backend built with Node.js, TypeScript, MongoDB, and Socket.io. Features JWT authentication, friend management, real-time messaging, typing indicators, and comprehensive API documentation.

---

## 🚀 Full Description

**ClashChat** is a modern, scalable real-time chat application backend designed for building instant messaging platforms. Built with enterprise-grade technologies and best practices, it provides a robust foundation for real-time communication applications.

### ✨ Key Features

#### 🔐 Authentication & Security
- **JWT-based Authentication** with access and refresh tokens
- **Secure Password Hashing** using bcrypt
- **Token Refresh Mechanism** for seamless user experience
- **Protected Routes** with authentication middleware
- **CORS Configuration** for secure cross-origin requests
- **Helmet.js Integration** for security headers

#### 💬 Real-Time Messaging
- **Socket.io Integration** for bidirectional real-time communication
- **1-to-1 Chat Support** with message persistence
- **Message Status Tracking** (sent, delivered, read)
- **Typing Indicators** for enhanced user experience
- **Online/Offline Status** tracking
- **Message History** with pagination support
- **Multiple Message Types** (text, image, file)

#### 👥 Friend Management
- **Friend Request System** (send, accept, reject)
- **User Search** by username or email
- **Friend List Management** with status indicators
- **Pending Requests** tracking
- **Friend Removal** functionality

#### 📚 Developer Experience
- **Comprehensive Swagger Documentation** at `/api-docs`
- **TypeScript** for type safety and better DX
- **RESTful API Design** following best practices
- **Input Validation** using express-validator
- **Error Handling** with custom middleware
- **Logging** with Morgan
- **Hot Reload** in development with Nodemon
- **Socket.io Test Client** included for easy testing

### 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Runtime** | Node.js v20+ |
| **Language** | TypeScript 5.3+ |
| **Framework** | Express.js 4.18+ |
| **Database** | MongoDB 8.0+ with Mongoose ODM |
| **Real-time** | Socket.io 4.6+ |
| **Authentication** | JWT (jsonwebtoken) |
| **Validation** | express-validator |
| **Documentation** | Swagger UI + swagger-jsdoc |
| **Security** | Helmet, bcryptjs, CORS |
| **Dev Tools** | Nodemon, ts-node, ESLint |

### 📁 Project Architecture

```
ClashChat/
├── src/
│   ├── config/           # Database & Swagger configuration
│   ├── controllers/      # Business logic for routes
│   │   ├── authController.ts
│   │   ├── friendController.ts
│   │   └── messageController.ts
│   ├── middleware/       # Custom middleware (auth, error handling)
│   ├── models/           # MongoDB schemas
│   │   ├── User.ts
│   │   ├── Message.ts
│   │   └── Friendship.ts
│   ├── routes/           # API route definitions
│   │   ├── authRoutes.ts
│   │   ├── friendRoutes.ts
│   │   └── messageRoutes.ts
│   ├── socket/           # Socket.io event handlers
│   │   └── socketHandler.ts
│   ├── utils/            # Helper functions (JWT, responses)
│   ├── types/            # TypeScript type definitions
│   └── server.ts         # Application entry point
├── tests/                # Socket.io test client
├── .env.example          # Environment variables template
└── package.json          # Dependencies and scripts
```

### 🔌 API Endpoints

#### Authentication (`/api/auth`)
- `POST /signup` - Register a new user
- `POST /login` - Authenticate user and get tokens
- `POST /refresh` - Refresh access token
- `POST /logout` - Logout and invalidate tokens

#### Friends (`/api/friends`)
- `GET /` - Get all friends with status
- `GET /search?query=` - Search users by username/email
- `GET /requests` - Get pending friend requests
- `POST /add` - Send friend request
- `PUT /accept/:requestId` - Accept friend request
- `DELETE /remove/:friendId` - Remove friend

#### Messages (`/api/messages`)
- `GET /:friendId?limit=50&skip=0` - Get chat history with pagination
- `POST /send` - Send message via HTTP

### 🔄 Socket.io Events

#### Client → Server Events
```javascript
socket.emit('send_message', { receiverId, content, messageType })
socket.emit('typing', { receiverId })
socket.emit('stop_typing', { receiverId })
socket.emit('message_read', { messageId })
```

#### Server → Client Events
```javascript
socket.on('receive_message', (message) => {})
socket.on('message_sent', (message) => {})
socket.on('user_online', ({ userId }) => {})
socket.on('user_offline', ({ userId }) => {})
socket.on('typing', ({ userId }) => {})
socket.on('stop_typing', ({ userId }) => {})
socket.on('message_read', ({ messageId }) => {})
socket.on('error', ({ message }) => {})
```

### 🚀 Quick Start

#### Prerequisites
- Node.js v20 or higher
- MongoDB v6 or higher (local or Atlas)
- npm or yarn package manager

#### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/ClashChat.git
cd ClashChat
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start MongoDB** (if using local instance)
```bash
mongod
```

5. **Run the application**
```bash
# Development mode with hot reload
npm run dev

# Production build
npm run build
npm start
```

6. **Access the application**
- API Server: `http://localhost:5000`
- Swagger Docs: `http://localhost:5000/api-docs`
- Socket.io Test Client: `tests/socket-test.html`

### 🔧 Environment Variables

Create a `.env` file with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/clashchat

# JWT Secrets (use strong random strings in production)
JWT_ACCESS_SECRET=your_access_token_secret_key
JWT_REFRESH_SECRET=your_refresh_token_secret_key
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# CORS
CORS_ORIGIN=http://localhost:3000
```

### 🧪 Testing

A Socket.io test client is included in `tests/socket-test.html`:

1. Start the server: `npm run dev`
2. Open `tests/socket-test.html` in a browser
3. Login via Postman to get an access token
4. Paste the token in the test client and connect
5. Test real-time messaging, typing indicators, and more

### 📊 Database Models

#### User Model
- username, email, password (hashed)
- avatar, status (online/offline/away)
- lastSeen, refreshToken
- Timestamps (createdAt, updatedAt)

#### Message Model
- sender, receiver (User references)
- content, messageType (text/image/file)
- status (sent/delivered/read)
- Timestamps

#### Friendship Model
- requester, recipient (User references)
- status (pending/accepted/rejected)
- Timestamps

### 🔒 Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT token-based authentication
- Refresh token rotation
- Protected routes with authentication middleware
- Input validation and sanitization
- CORS configuration
- Helmet.js security headers
- MongoDB injection prevention via Mongoose

### 📈 Scalability Considerations

- Stateless JWT authentication for horizontal scaling
- MongoDB for flexible schema and scalability
- Socket.io with Redis adapter support (can be added)
- Modular architecture for easy feature additions
- TypeScript for maintainability

### 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### 📄 License

ISC License

### 👨‍💻 Author

[Sourabh Semalty](https://github.com/Sourabh-Semalty)

### 🔗 Links

- [API Documentation](http://localhost:5000/api-docs)
- [Postman Collection](./ClashChat.postman_collection.json)
- [Setup Guide](./SETUP.md)
- [Quick Start Guide](./QUICKSTART.md)

---

**Built with ❤️ using Node.js, TypeScript, MongoDB, and Socket.io**
