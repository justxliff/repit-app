# RepIt

Agile-built workout planning and tracking web app with end-to-end delivery traceability across Jira, Replit AI, and GitHub.

## Tech Stack

- **Frontend:** React + Vite
- **Auth:** Firebase Authentication (Google, Facebook, Email/Password)
- **Storage:** localStorage (Firestore cloud sync planned — RFA-18)
- **Font:** Poppins (Google Fonts)
- **Dev Environment:** Replit
- **Project Management:** Jira
- **Version Control:** GitHub

## Features

### Implemented
- **User Registration & Login** — Google, Facebook, and email/password via Firebase Auth
- **Email Verification** — blocks unverified users, resend with 30-second cooldown
- **Session Persistence** — stays logged in across page refreshes
- **User Profile Page**
  - Editable avatar with click-to-upload (auto-resized and saved locally)
  - Demographic Info section (name, age, weight)
  - Workout Preferences section (goal, experience level, preferred days, session duration)
  - Personal Records section (add, edit, delete)
  - Profile data persisted in localStorage keyed by user email
- **Navigation** — sticky header with tab nav and sign-out icon

### Planned
- Firestore cloud sync (RFA-18)
- Workout plan creation
- Exercise library
- Workout logging
- Progress tracking
- Expo / React Native mobile app
- Apple Sign-In (pending Apple Developer account)

## Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production |
| `develop` | Integration |
| `RFA-XX-*` | Feature branches per Jira story |

## Agile Delivery

Each feature is traced end-to-end from a Jira story (`RFA-XX`) through a dedicated GitHub branch, Replit AI implementation, and pull request back into `develop`.
