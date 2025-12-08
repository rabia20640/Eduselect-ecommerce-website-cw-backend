Eduselect Backend 

Eduselect is a lesson booking system built with Node.js, Express, MongoDB Atlas, and a Vue frontend. This project provides RESTful APIs for managing lessons and orders, with proper validation, logging, and error handling. Frontend components fetch data and submit orders using the backend APIs.

Project Structure
eduselect-backend/
│
├─ config/
│   └─ db.js            # MongoDB connection
│
├─ middleware/
│   ├─ errorHandler.js  # Global error handling
│   ├─ logger.js        # Request logging
│   └─ validateOrder.js # Order input validation
│
├─ routes/
│   ├─ lessons.js       # Lessons CRUD & spaces management
│   └─ orders.js        # Orders CRUD
│
├─ utils/
│   └─ logger.js        # Logging utilities (info, warn, error)
│
├─ server.js            # Entry point
├─ .env                 # Environment variables
└─ package.json

Environment Variables

Create a .env file in the root:

MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/eduselect?retryWrites=true&w=majority
PORT=5000
DB_NAME=eduselect


MONGO_URI – MongoDB Atlas connection string

PORT – Backend server port

DB_NAME – Database name (default: eduselect)

Installation
git clone <repo-url>
cd eduselect-backend
npm install

Server Startup
npm start


Connects to MongoDB Atlas

Health check at GET / → "Eduselect backend is running"

Graceful shutdown on SIGINT

Database Configuration

config/db.js manages MongoDB connections:

connectDB() – Connects to MongoDB

getDB() – Returns DB instance

closeDB() – Closes DB connection

API Routes
Lessons (/lessons)

GET /lessons – Fetch all lessons

POST /lessons – Create a lesson:

{
  "topic": "Mathematics",
  "location": "London",
  "price": 50,
  "space": 10
}


PUT /lessons/:id – Update lesson spaces:

// Set absolute space
{ "space": 5 }

// Increment/decrement space
{ "delta": -1 }

Orders (/orders)

GET /orders – Fetch all orders

POST /orders – Create order:

{
  "name": "John Doe",
  "phone": "07123456789",
  "items": ["<lessonId1>", "<lessonId2>"]
}


Validations:

name – 2–50 letters, spaces/hyphens allowed

phone – 11 digits, starts with 07

items – Must include at least one lesson

Middleware

Logger Middleware – Logs all incoming requests with method, URL, timestamp

Order Validator – Validates order payload before insertion

Error Handler – Catches unhandled errors and returns JSON responses

Logging

utils/logger.js provides:

logInfo(message) – Info logs

logWarn(message) – Warning logs

logError(message, err) – Error logs with stack trace

Error Handling

All errors return JSON:

{
  "error": "Error message"
}


Default HTTP status: 500 unless overridden.

Frontend Integration
API.js

Fetch integration functions:

import { fetchLessons, createOrder, updateLessonSpaces, cancelOrder } from './api.js';

// Example 
const lessons = await fetchLessons();
await createOrder({ name: "Alice", phone: "07123456789", items: [lessons[0]._id] });
await updateLessonSpaces(lessons[0]._id, -1);

CheckoutForm.vue

Captures user name & phone number

Loops through cart lessons, creating orders via createOrder()

Updates lesson spaces via updateLessonSpaces()

Emits checkout-success on completion

await createOrder({ name: this.name, phone: this.phone, lessonId: lesson._id });
await updateLessonSpaces(lesson._id, -1);

LessonGrid.vue

Fetches all lessons using fetchLessons() on component creation

Displays lessons via LessonCard component

Handles loading state and errors

async created() {
  try {
    this.lessons = await fetchLessons();
  } catch (err) {
    this.error = "Failed to load lessons.";
  } finally {
    this.loading = false;
  }
}

Testing with Postman

All backend endpoints were tested using Postman, a popular API client.

Lessons endpoints:

GET /lessons – Verify all lessons are returned

POST /lessons – Test lesson creation with valid/invalid data

PUT /lessons/:id – Test updating spaces (absolute or delta)

Orders endpoints:

GET /orders – Verify all orders

POST /orders – Test order creation, including validation for name, phone, and items

Example Postman workflow:

Import the backend API endpoints into Postman.

Use the Body tab to send JSON payloads for POST/PUT requests.

Inspect the JSON responses and HTTP status codes.

Test error handling by sending invalid data (e.g., missing phone, invalid lesson ID).

Example API Usage
JavaScript (frontend)
const lessons = await fetchLessons();

const order = {
  name: "Alice",
  phone: "07123456789",
  items: [lessons[0]._id]
};

await createOrder(order);
await updateLessonSpaces(lessons[0]._id, -1);

cURL (backend)

Get all lessons:

curl http://localhost:5000/lessons


Create a lesson:

curl -X POST http://localhost:5000/lessons \
-H "Content-Type: application/json" \
-d '{"topic":"Math","location":"London","price":50,"space":10}'


Create an order:

curl -X POST http://localhost:5000/orders \
-H "Content-Type: application/json" \
-d '{"name":"Alice","phone":"07123456789","items":["<lessonId>"]}'


Update lesson spaces:

curl -X PUT http://localhost:5000/lessons/<lessonId> \
-H "Content-Type: application/json" \
-d '{"space":5}'

Frontend Components Workflow
[User]
   ↓
[LessonGrid.vue] → fetchLessons() → [Backend /lessons]
   ↓
[LessonCard.vue] → Add to Cart
   ↓
[CheckoutForm.vue] → createOrder() → [Backend /orders]
                   → updateLessonSpaces() → [Backend /lessons]
   ↓
[MongoDB Atlas] stores lessons & orders

User views lessons in LessonGrid

Adds lessons to cart via LessonCard

Submits checkout form (CheckoutForm.vue)

Backend validates orders, updates lesson spaces and gets the lesson cards 