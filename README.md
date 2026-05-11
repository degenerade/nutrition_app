# 🥬 nourish

## A healthy stomach is a healthy mind

nourish is a web app where users can search for ingredients, build meals, and track the nutritional value of what they eat.

**Why?** I've always wondered exactly how much is in what I eat, not just calories, but protein, fats, carbs, sugars etc, and this is the solution.

## Stack

- **Frontend:** React (Vite)
- **Backend:** Express.js
- **Database:** MongoDB Atlas (Mongoose)
- **Auth:** JWT + bcrypt
- **Nutritional data:** USDA FoodData Central API
- **Input validation:** zod

## Getting Started

### Prerequities

- Node.js v18+
- A `.env` file in the `server/` file (API key, JWT secret, db connection)

### Installation

```bash
# clone the repo
git clone https://github.com/degenerade/nutrition_app.git
cd nutrition_app

# Install dependencies
npm install
cd client && npm install && cd ..
cd server && npm install && cd ..
```

### Running the app

```bash
# From root file
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3012

### Environment Variables

Place a `.env` file inside the `server/` directory with the following keys:

```
PORT=3012
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
USDA_API_KEY=your_usda_api_key
```

## Features

- User registration and login with JWT authentication
- Search ingredients via the USDA FoodData Central API
- Build meals by adding ingredients with custom gram amounts
- Live nutrition preview while building a meal (calories, protein, carbs, fat)
- Browse all meals in the database with tag filtering (healthy, vegan, high protein, etc.)
- Meals are linked to the user who created them

## Project Structure

```
nutrition_app/
  client/         # React (Vite) frontend
    src/
      pages/      # LoginPage, SignupPage, BrowsePage, CreateMealPage
      components/ # Navbar, MealCard, ProtectedRoute
      context/    # AuthContext, AuthProvider
      hooks/      # useAuth
      lib/        # api.js
  server/
    src/
      controllers/  # authController, mealController, nutritionController, userController
      middleware/   # auth.js (JWT verification)
      models/       # userModel.js, Meal.js
      routes/       # authRoute, mealRoute, nutritionRoute, userRoute, routerIndex
      config/       # db.js
      server.js
    app.js
```

## API Overview

| Method | Endpoint                     | Auth | Description                           |
| ------ | ---------------------------- | ---- | ------------------------------------- |
| POST   | `/api/auth/signup`           | —    | Register a new user                   |
| POST   | `/api/auth/login`            | —    | Login and receive JWT                 |
| GET    | `/api/meals`                 | —    | Get all meals, search by with `?tag=` |
| POST   | `/api/meals`                 | ✓    | Create a new meal                     |
| DELETE | `/api/meals/:id`             | ✓    | Delete a meal                         |
| GET    | `/api/nutrition/:ingredient` | —    | Search USDA food database             |
| GET    | `/api/users`                 | —    | Get all users                         |
