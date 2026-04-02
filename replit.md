# RepIt - Workout Tracker

A workout planning and tracking web application built with React + Vite.

## Tech Stack

- **Frontend:** React 18 + Vite 6
- **Package Manager:** npm
- **Port:** 5000
- **Language:** JavaScript (JSX)

## Project Structure

```
repit-app/
├── index.html          # App entry point
├── package.json        # Dependencies and scripts
├── vite.config.js      # Vite configuration (host 0.0.0.0, port 5000)
├── src/
│   ├── main.jsx        # React entry point
│   ├── App.jsx         # Main app component (dashboard, workouts, exercises)
│   ├── App.css         # App styles
│   └── index.css       # Global styles
└── .gitignore
```

## Features

- Dashboard with workout stats
- Workout list with ability to add new workouts
- Exercise library (8 exercises across categories)
- Dark-themed UI

## Running the App

```bash
npm run dev
```

Runs on `http://0.0.0.0:5000` in development.

## Deployment

Configured as a static site (Vite build → `dist/`).

Build command: `npm run build`
Public dir: `dist`
