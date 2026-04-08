# Sprint 2026.03.2
## Sprint Overview
In this Sprint, I was able to complete the development of RFA-1 and RFA-6, which is the User Authentication and Profile Page. Currently the user can login with their Google or Facebook accounts, or a regular email. Once logged in the user is able to see their profile and update their name, age, weight, and photo. In addition to this, in the users profile page will store their Workout Preferences, and Personal Records. The preferences will be used for creating workouts in future Features, and the Personal Records will be used to store accomplishments along the users journey. The upcoming Sprints will focus on Workout Creation and Logging

## Sprint Results
- Sprint Goal: The goal of this Sprint was to begin execution of the stories created in Sprint 1, as well as continue drafting user stories, specifically for RFA-2, which is for the Workout Creation feature
- Planned Capacity: 8 Story Points
- Completed Story Points: 16 story points
- Value Added:
- - For this Sprint, I was able to implement the User Registration and User Profile page. The User can login via Google, Facebook, or emai to then land on their profile page. On the Profile Page the user can update 3 sections that are saved to their profile: Demographic Info, Workout Preferences, and Personal Records.
 
## Executed User Stories

| Story | Description |
|---|---|
| **RFA-12** | Account registration — email/password sign up with validation (format, 6-char min, email verification), Google and Facebook third-party auth, profile picture and name pulled from provider, redirect to profile on success |
| **RFA-13** | Login with email — sign in / register toggle on the auth page |
| **RFA-14** | Demographic data — profile photo (camera + file upload), height, weight with unit toggle (lbs/kg) and validation |
| **RFA-15** | Workout preferences — Goal (Weight Loss, Body Toning, Muscle Gain, Flexibility) and Focus (Strength, Endurance, Explosion), both required |
| **RFA-16** | Personal records — full PR form with sets, reps, time, weight, and date; progress % calculated vs previous record for same exercise |
| **RFA-18** | Profile data retention — deep-merge fix so section data persists correctly across sessions |
| **RFA-21** | User profile page — single unified page with Demographic Info, Workout Preferences, and Personal Records as clearly labeled, viewable and editable sections; changes reflect immediately |

### Additional Enhancements

- **Mobile responsiveness** — bottom nav bar, 2-column grids, adjusted typography, iOS auto-zoom prevention on inputs
- **Icon navigation** — replaced text nav labels with SVG icons (person, grid, dumbbell, list)

 ## Sprint Takeaways
 - The workflow for development is still a work in progress, however the process flow I am currently using is having the base of the app in the develop branch. From here we brach off of develop for each Features, for example RFA-6 User profile will become the RFA-6-user-profile branch. All the user stories are developed in this branch, and when all the stories of a branch are completed, we can merge the whole feature branch to develop.
 - Implementing the user login had a little stalls with third party integration, including making the choice to defer Apple login until a future relase, as the developer account needed has a $99 cost.

## Upcoming Sprint
In the upcoming Sprint, the focus will be drafting user stories for Workout Creation and WOrkout logging, execution will occur in the subsequent sprint
