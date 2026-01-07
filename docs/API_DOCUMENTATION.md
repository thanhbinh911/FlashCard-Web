# Flashcard Web API Documentation

## Base URL
```
http://localhost:8080/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## ⚙️ Environment Setup

This application uses a `.env` file to store sensitive configuration. **Never commit `.env` to version control!**

### 1. Create the `.env` file
```bash
cd backend
cp .env.example .env
```

### 2. Configure your environment variables
Edit the `.env` file with your actual values:
```env
# Database Configuration
DB_URL=jdbc:postgresql://localhost:5432/flashcard_db
DB_USERNAME=your_database_username
DB_PASSWORD=your_database_password

# JWT Configuration (generate with: openssl rand -base64 32)
JWT_SECRET=your_base64_encoded_jwt_secret_here

# OpenAI API Key (get from: https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-your-openai-api-key-here
```

### 3. How it works
The application automatically loads `.env` variables on startup via the `FlashcardWebApplication.java`:
```java
Dotenv dotenv = Dotenv.configure()
        .directory("./")
        .ignoreIfMissing()
        .load();

dotenv.entries().forEach(entry -> {
    System.setProperty(entry.getKey(), entry.getValue());
});
```

These variables are then used in `application.properties`:
```properties
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
jwt.secret=${JWT_SECRET}
spring.ai.openai.api-key=${OPENAI_API_KEY}
```

---

## 🔐 Authentication Endpoints

### Register
```bash
POST /api/auth/register
```

**Request:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "username": "johndoe"
}
```

**cURL:**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"johndoe","email":"john@example.com","password":"password123","firstName":"John","lastName":"Doe"}'
```

---

### Login
```bash
POST /api/auth/login
```

**Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "username": "johndoe"
}
```

**cURL:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

---

### Change Password
```bash
PUT /api/auth/password
```
**Auth Required:** ✅

**Request:**
```json
{
  "currentPassword": "oldpass123",
  "newPassword": "newpass456"
}
```

---

## 📚 Deck Endpoints

### Get All Decks
```bash
GET /api/decks
```
Returns public decks + user's own decks (if authenticated).

**cURL:**
```bash
curl http://localhost:8080/api/decks \
  -H "Authorization: Bearer <token>"
```

---

### Search Decks
```bash
GET /api/decks/search?keyword=java
```

---

### Get Deck by ID
```bash
GET /api/decks/{deckId}
```

---

### Create Deck
```bash
POST /api/decks
```
**Auth Required:** ✅

> **Note:** Minimum 2 flashcards are required to create a deck.

**Request:**
```json
{
  "title": "Java Basics",
  "description": "Fundamental Java concepts",
  "isPublic": true,
  "flashcards": [
    {"questionText": "What is JVM?", "answerText": "Java Virtual Machine", "hint": "Runs bytecode"},
    {"questionText": "What is OOP?", "answerText": "Object Oriented Programming"}
  ]
}
```

**cURL:**
```bash
curl -X POST http://localhost:8080/api/decks \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Java Basics","description":"Fundamental concepts","isPublic":true,"flashcards":[{"questionText":"What is JVM?","answerText":"Java Virtual Machine"},{"questionText":"What is OOP?","answerText":"OOP"}]}'
```

**Error Response (less than 2 flashcards):**
```json
{
  "status": 400,
  "error": "Validation Failed",
  "errors": {"flashcards": "At least 2 flashcards are required to create a deck"}
}
```

---

### Update Deck
```bash
PUT /api/decks/{deckId}
```
**Auth Required:** ✅ (Owner only)

---

### Delete Deck
```bash
DELETE /api/decks/{deckId}
```
**Auth Required:** ✅ (Owner only)

---

## 📝 Flashcard Endpoints

### Get All Flashcards in Deck
```bash
GET /api/decks/{deckId}/flashcards
```

**cURL:**
```bash
curl http://localhost:8080/api/decks/1/flashcards \
  -H "Authorization: Bearer <token>"
```

---

### Get Single Flashcard
```bash
GET /api/decks/{deckId}/flashcards/{flashcardId}
```

---

### Create Flashcard
```bash
POST /api/decks/{deckId}/flashcards
```
**Auth Required:** ✅ (Deck owner only)

**Request:**
```json
{
  "questionText": "What is JVM?",
  "answerText": "Java Virtual Machine",
  "hint": "It runs bytecode"
}
```

**cURL:**
```bash
curl -X POST http://localhost:8080/api/decks/1/flashcards \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"questionText":"What is JVM?","answerText":"Java Virtual Machine","hint":"It runs bytecode"}'
```

---

### Update Flashcard
```bash
PUT /api/decks/{deckId}/flashcards/{flashcardId}
```
**Auth Required:** ✅ (Deck owner only)

---

### Delete Flashcard
```bash
DELETE /api/decks/{deckId}/flashcards/{flashcardId}
```
**Auth Required:** ✅ (Deck owner only)

---

## 🎯 Study Session Endpoints

### Start New Session
```bash
POST /api/sessions/start
```
**Auth Required:** ✅

**Request:**
```json
{
  "deckId": 1,
  "sessionMode": "REGULAR",
  "isPracticeMode": false,
  "timeLimitSeconds": 300
}
```

**Session Modes:**
| Mode | Description |
|------|-------------|
| `REGULAR` | Fill-in-the-blank (type answer) |
| `MCQ` | Multiple choice (AI generates options) |
| `REVIEW` | View cards only (no scoring) |

**Response:**
```json
{
  "sessionId": 1,
  "deckId": 1,
  "timeLimitSeconds": 300,
  "sessionMode": "REGULAR",
  "questions": [...]
}
```

**cURL - Practice MCQ (no timer):**
```bash
curl -X POST http://localhost:8080/api/sessions/start \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"deckId":1,"sessionMode":"MCQ","isPracticeMode":true}'
```

**cURL - Timed Regular Test (5 min):**
```bash
curl -X POST http://localhost:8080/api/sessions/start \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"deckId":1,"sessionMode":"REGULAR","isPracticeMode":false,"timeLimitSeconds":300}'
```

---

### Resume Session
```bash
POST /api/sessions/{sessionId}/resume
```
**Auth Required:** ✅

---

### Get Active Session
```bash
GET /api/sessions/active
```
**Auth Required:** ✅

Returns the user's current in-progress session (if any).

---

### Save Progress
```bash
POST /api/sessions/{sessionId}/save-progress
```
**Auth Required:** ✅

**Request:**
```json
{
  "remainingSeconds": 180
}
```

---

### Finish Session
```bash
POST /api/sessions/{sessionId}/finish
```
**Auth Required:** ✅

**Request:**
```json
{
  "answers": [
    { "flashcardId": 1, "userAnswer": "Java Virtual Machine" },
    { "flashcardId": 2, "userAnswer": "Object-Oriented" }
  ]
}
```

**Response:**
```json
{
  "sessionId": 1,
  "correctCount": 8,
  "totalCards": 10,
  "finishedAt": "2024-12-22T16:00:00"
}
```

**cURL:**
```bash
curl -X POST http://localhost:8080/api/sessions/1/finish \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"answers":[{"flashcardId":1,"userAnswer":"JVM"},{"flashcardId":2,"userAnswer":"OOP"}]}'
```

---

### Abandon Session
```bash
DELETE /api/sessions/{sessionId}/abandon
```
**Auth Required:** ✅

---

### Get Session Questions
```bash
GET /api/sessions/{sessionId}/questions
```
**Auth Required:** ✅

Returns the formatted questions for a session based on its mode (REGULAR, MCQ, REVIEW).

**cURL:**
```bash
curl http://localhost:8080/api/sessions/1/questions \
  -H "Authorization: Bearer <token>"
```

---

### Get Session Summary
```bash
GET /api/sessions/{sessionId}/summary
```
**Auth Required:** ✅

Returns detailed results with all questions and answers.

---

## 👑 Admin Endpoints

> All admin endpoints require `ROLE_ADMIN`

### Get Dashboard
```bash
GET /api/admin/dashboard
```

**Response:**
```json
{
  "totalUsers": 150,
  "totalDecks": 500,
  "totalFlashcards": 5000,
  "totalSessions": 1000,
  "activeSessionsCount": 5,
  "recentActivity": [...]
}
```

---

### Get All Users
```bash
GET /api/admin/users
```

---

### Get User's Decks
```bash
GET /api/admin/users/{userId}/decks
```

---

### Get User's Deck Flashcards
```bash
GET /api/admin/users/{userId}/decks/{deckId}/flashcards
```

---

## Frontend Integration Guide

### 1. Store Token After Login
```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
const { token, username } = await response.json();
localStorage.setItem('token', token);
```

### 2. Make Authenticated Requests
```javascript
const token = localStorage.getItem('token');

const response = await fetch('/api/decks', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### 3. Study Session Flow
```javascript
// 1. Start session
const session = await fetch('/api/sessions/start', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ deckId: 1, sessionMode: 'REGULAR', isPracticeMode: true })
});

// 2. User answers questions (frontend tracks answers)

// 3. Finish session
const result = await fetch(`/api/sessions/${sessionId}/finish`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ answers })
});
```

### 4. Handle 401 Unauthorized
```javascript
if (response.status === 401) {
  localStorage.removeItem('token');
  window.location.href = '/login';
}
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "status": 401,
  "error": "Unauthorized",
  "message": "Please login or register to continue",
  "requiresAuth": true
}
```

### 403 Forbidden
```json
{
  "status": 403,
  "error": "Forbidden",
  "message": "You don't have access to this resource"
}
```

### 404 Not Found
```json
{
  "status": 404,
  "error": "Not Found",
  "message": "Resource not found"
}
```

---

## Quick Test Script

Save this as `test-api.sh`:

```bash
#!/bin/bash
BASE_URL="http://localhost:8080/api"

# 1. Register
echo "=== Register ==="
curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"test123","firstName":"Test","lastName":"User"}'

echo -e "\n"

# 2. Login & save token
echo "=== Login ==="
TOKEN=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}' | jq -r '.token')
echo "Token: ${TOKEN:0:50}..."

echo -e "\n"

# 3. Create deck with flashcards (minimum 2 required)
echo "=== Create Deck ==="
DECK=$(curl -s -X POST $BASE_URL/decks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Deck","description":"Testing","isPublic":true,"flashcards":[{"questionText":"What is 2+2?","answerText":"4","hint":"Simple math"},{"questionText":"What is 3+3?","answerText":"6","hint":"Addition"}]}')
DECK_ID=$(echo $DECK | jq -r '.id')
echo "Created Deck ID: $DECK_ID"

echo -e "\n"

# 5. Start session
echo "=== Start Session ==="
curl -s -X POST $BASE_URL/sessions/start \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"deckId\":$DECK_ID,\"sessionMode\":\"REGULAR\",\"isPracticeMode\":true}"

echo -e "\n=== Done! ==="
```
