# Secure To-Do App (MERN Stack)

## Overview
The **Secure To-Do App** is a feature-rich task management application built using the MERN stack. It offers enhanced security with email-based 2-Step verification and Google Authenticator 2FA. Additionally, it integrates with Google Calendar to sync tasks seamlessly (though this feature was attempted but not fully implemented). This project was developed as part of a learning experience to improve security and integration skills.

## Features
### 1. **User Authentication**
- Register and log in using email and password.
- Mail Code 2-Step verification (Attempted but not fully implemented).
- Google Authenticator 2FA with QR code generation (QR generated but full flow not completed).

### 2. **To-Do Management (CRUD Operations)**
- Create, read, update, and delete tasks.
- Tasks include:
  - **Title**
  - **Description**
  - **Due Date**
  - **Status** (Pending, Completed)
  - **Priority** (High, Medium, Low)
- Task filtering by date, status, and priority.

### 3. **Google Calendar Sync (Attempted)**
- Users can connect their Google account.
- Access token retrieval was successful, but refresh token handling was not completed.
- Attempted to sync tasks with Google Calendar, but encountered token refresh issues.

### 4. **Unified Dashboard**
- A single view to manage all tasks.
- Tasks displayed with due dates, statuses, and priority labels.
- Filtering options for better organization.

## Tech Stack
- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js, Mongoose
- **Database**: MongoDB Atlas
- **Authentication**: Passport.js (Email & Google Auth)

## Live Demo
- https://todoapp-frontend-chi.vercel.app/

## Known Issues
- **Mail Code 2-Step & Google Authenticator 2FA**: QR code is generated, but the complete authentication flow was not completed.
- **Google Calendar Sync**: Access token retrieval works, but refresh token handling was not fully implemented, preventing task synchronization.

## Future Improvements
- Complete Mail Code 2-Step & Google Authenticator 2FA.
- Fix refresh token issue and fully integrate Google Calendar sync.
- Improve UI/UX for better task management experience.

## Contact
For any queries or suggestions, feel free to connect via [LinkedIn](your-linkedin-profile) or open an issue in the repository.

---
This project was a great learning experience, and I appreciate the opportunity to work on it! 🚀

