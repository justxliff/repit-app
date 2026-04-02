## Description:
This feature enables the RepIt User to create and manage a personal user profile that stores demographic information, workout preference data, and personal records. The User Profile supports personalization across the application by storing default workout preferences used by the Workout Generator, demographic details that can be entered manually or pulled from a connected authentication provider, and Personal Records (PRs) used to track fitness achievements and progress over time.

## User:
RepIt User

## Benefit Hypothesis:
As a RepIt User, I would like to manage my demographic information, workout preferences, and personal records so that I can personalize my experience, generate workouts aligned to my goals, and track my progress over time.

## Acceptance Criteria:

I will be satisfied when:
- The User Profile Page houses all profile features as viewable and editable regions  
- - Demographic Info  
  - Workout Preferences  
  - Personal Records  

- The RepIt User can manage Demographic Data with the following fields  
- - Name is a required field  
  - Name can be entered manually by the user  
  - Name can be automatically populated from a linked third-party account  
- - Age is an optional field  
  - Age can be entered as an integer value by the user  
- - Weight is an optional field  
  - Weight can be entered as an integer value by the user  
  - User can select unit of measurement  
- - Profile Picture is an optional field  
  - User can add a picture using the following methods:  
  - - Capture a photo  
    - Select or upload a photo from the device  
  - The selected image is stored under the user profile  

- Once Demographic Data is entered, the RepIt User can manage Workout Preference Data with the following fields  
- - Workout Goal is a required field  
  - Workout Goal has the following values for the RepIt User to choose:  
  - - Weight Loss  
    - Body Toning  
    - Muscle Gain  
    - Flexibility  
- - Workout Focus is a required field  
  - Workout Focus has the following values for the RepIt User to choose:  
  - - Strength  
    - Endurance  
    - Explosion  

- Default Workout Preferences from the User Profile can be used by the Workout Generator (RFA-2)  

- The RepIt User can create and manage multiple Personal Records (PRs) with the following fields and logic  
- - Exercise  
  - Name is the exercise name in text format  
  - Name is a required field  
- - Sets  
  - Number of sets completed  
- - Reps  
  - Number of reps completed  
  - OR Time (minutes and seconds)  
  - Reps is a required field  
- - Weight  
  - User can enter weight as an integer value  
  - User can enter unit of measurement  
  - Weight is an optional field  
- - Date  
  - User can enter the date of the completed Personal Record  
  - Date is a required field  

- Personal Records can be updated with a new value and date  
- Personal Records can be edited  

- PR Progress is calculated as the percentage increase over time compared to previous Personal Records for the same Exercise  
- PR Progress is only calculated when more than one Personal Record exists for the same Exercise  

- The RepIt User can review profile information before saving  
- The RepIt User can edit profile information  
- The RepIt User can save profile updates to their account  

- Saved User Profile data is stored under the user’s account  
- Saved User Profile data is accessible for future viewing and editing  

## Dependencies:
https://cliffjoseph.atlassian.net/browse/RFA-1 User Authentication  

## Supporting Documents:
N/A  
