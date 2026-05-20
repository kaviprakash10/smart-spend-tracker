# Expense Tracker

Full-stack Expense Tracker with receipt OCR, email/SMS utilities, and JWT authentication.

## Table of contents

- [Project overview](#project-overview)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Repository structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Setup — Backend](#setup---backend)
- [Setup — Frontend](#setup---frontend)
- [Environment variables](#environment-variables)
- [Usage](#usage)
- [API routes](#api-routes)
- [Contributing](#contributing)
- [License](#license)

## Project overview

This project implements an expense tracker with the following capabilities:

- User authentication (signup/signin) with JWT
- Expense CRUD operations
- Receipt OCR processing (Tesseract-trained data included)
- Email and SMS utilities for notifications

## Features

- Authentication with JWT
- Upload receipts and extract text via OCR
- Create and manage expenses (amount, date, category, notes)
- Email and SMS integrations for alerts

## Tech stack

- Backend: Node.js, Express
- Frontend: Vite + React
- Database: MongoDB
- OCR: Tesseract trained data (included under `Back_End/eng.traineddata`)

## Repository structure

- Backend: [Back_End](Back_End)
  - Main server: [Back_End/server.js](Back_End/server.js)
  - Controllers, models, routes and utilities in `Back_End/app/`
- Frontend: [Front_end](Front_end)
  - React app under `Front_end/src/`

## Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- MongoDB (local or hosted)

## Setup — Backend

1. Open a terminal and install dependencies:

```bash
cd Back_End
npm install
```

2. Create a `.env` file in `Back_End/` with the required environment variables (see below).

3. Start the backend server:

```bash
# simple start (production)
node server.js

# or using npm script (if available)
npm start
```

## Setup — Frontend

1. Open a terminal and install dependencies:

```bash
cd Front_end
npm install
```

2. Start the development server (Vite):

```bash
npm run dev
```

Open the app in your browser (usually at `http://localhost:5173` or as shown by Vite).

## Environment variables

Create `Back_End/.env` and include at minimum:

- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — secret for JWT tokens
- `PORT` — backend port (e.g. 5000)
- `EMAIL_USER` / `EMAIL_PASS` — SMTP credentials (if email used)
- `TWILIO_SID` / `TWILIO_AUTH_TOKEN` / `TWILIO_FROM` — for SMS (if used)

The backend reads OCR data from `Back_End/eng.traineddata` (already included).

## Usage

- Register a user via the frontend signup page or the `/auth/signup` API.
- Sign in to get a token, then create expenses and optionally upload receipts.
- Uploaded receipts are processed by the OCR service and can be used to pre-fill expense data.

## API routes (high level)

- Auth routes: [Back_End/app/routes/authRoutes.js](Back_End/app/routes/authRoutes.js)
- Expense routes: [Back_End/app/routes/expenseRoutes.js](Back_End/app/routes/expenseRoutes.js)

Refer to those files for exact endpoints and payload formats.

## Contributing

- Fork the repo, create a feature branch, make changes, and open a pull request.
- Run linters/tests (if present) before submitting.

## License

This project is provided as-is. Add a license file if you want to make licensing explicit.
