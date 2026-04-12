# RepIt - Workout Tracker

A workout planning and tracking web application built with React + Vite + Firebase Auth.

## Tech Stack

- **Frontend:** React 18 + Vite 6
- **Auth:** Firebase (Google, Facebook, Email/Password)
- **AI:** Replit AI Integrations (OpenAI) — env vars: `AI_INTEGRATIONS_OPENAI_BASE_URL`, `AI_INTEGRATIONS_OPENAI_API_KEY`
- **Package Manager:** npm
- **Port:** 5000
- **Language:** JavaScript (JSX)

## Firebase Secrets

Stored in Replit Secrets:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`

## Project Structure

```
src/
├── App.jsx / App.css              # Root app, tab routing (dashboard / workouts / exercises / profile)
├── context/AuthContext.jsx        # Firebase auth context
├── pages/
│   ├── WorkoutCreationPage.jsx    # Workout Creator + Generator tiles + saved workout shelf
│   ├── UserProfilePage.jsx        # Profile tiles (demographic, preferences, personal records)
│   ├── RegisterPage.jsx           # Auth page (Google, Facebook, email)
│   └── VerifyEmailPage.jsx        # Email verification gate
├── components/
│   ├── workouts/
│   │   ├── WorkoutCreatorModal.jsx      # Manual workout builder (3 sections, exercise picker)
│   │   ├── WorkoutCreatorModal.css
│   │   ├── WorkoutGeneratorModal.jsx    # AI-powered workout generator (4-step guided form)
│   │   ├── WorkoutGeneratorModal.css
│   │   └── ExerciseCreatorForm.jsx      # Create/edit exercise form (type, sets, reps, weight, superset)
│   └── profile/
│       ├── DemographicSection.jsx
│       ├── WorkoutPreferencesSection.jsx
│       └── PersonalRecordsSection.jsx
└── hooks/
    ├── useWorkouts.js             # localStorage: repit_workouts_${email}
    ├── useExerciseLibrary.js      # localStorage: repit_exercises (seeded with 15 exercises)
    └── useProfileData.js          # localStorage: repit_profile_${email}
```

## Key Data Models

**Exercise:** `{ id, name, type, category, sets, reps, weight, superSet, muscles }`

**Workout:** `{ id, name, date, sections: { warmUp: [...], workout: [...], coolDown: [...] } }`

**Section entry:** `{ name, sets, reps, weight }`

**Profile:** `{ demographic: { name, age, weight, weightUnit, profilePicture }, preferences: { goal, focus }, personalRecords: [] }`

## Features

- Firebase auth (Google, Facebook, email/password + email verification)
- Dashboard with workout stats
- Workout Creator — manual 3-section workout builder with exercise library
- Workout Generator — AI-powered 4-step guided form (preferences → experience → equipment → muscles → generate → review → save)
- Exercise Library — create, edit, delete exercises with type/sets/reps/weight/superset
- User profile (demographic info, workout preferences, personal records)
- Mobile-responsive dark UI (Poppins font, orange #ff5722 accent)

## AI Workout Generator (RFA-25)

- Uses Replit AI Integrations (OpenAI `gpt-5.1`) called directly from the frontend
- 4 guided steps: Workout Preferences, Experience Level (1-5), Equipment (multi-select), Muscle Groups (multi-select)
- Uses user's exercise library as context if available; generates freely if empty
- Editable review screen (sets/reps/weight per exercise)
- Regenerate option and offer to add AI exercises to library if library was empty

## Running the App

```bash
npm run dev
```

Runs on `http://0.0.0.0:5000` in development.

## Git Branch

Working branch: `RFA-2-workout-creation` (checked out from develop)
