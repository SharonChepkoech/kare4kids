#Babysitting App – Frontend (React + Vite)


This is the frontend client for the Babysitting App; a modern web platform that connects parents with trusted babysitters. It’s built using React, powered by Vite for blazing-fast builds and development experience, and integrates smoothly with the Django based backend.

The UI is intuitive, responsive, and optimized for both parents and sitters to manage jobs, bookings, and payments, with M-Pesa payment flow integrated for mobile transactions in Kenya.

Key Features

Role-Based Dashboards

Sitters can view, accept, decline, or complete jobs.

Parents can view bookings, cancel pending requests, and make payments for completed jobs.

Secure JWT Authentication

Token-based login system with session handling and protected routes.

Real-Time Payment Flow

Parents can initiate M-Pesa STK Push payments and see instant updates after confirmation.

Clean UX/UI

Dark-themed UI preference.

Mobile-responsive components.

Toast notifications and spinners for feedback.

Reusable Components

Modular layout (e.g., Layout.tsx, SitterDashboard, ParentDashboard, etc.)

API request handling via Axios with token management.

Tech Stack


Framework: React (with Vite)

Styling: Tailwind CSS

Routing: React Router

State: React Context (for auth, bookings)

API Communication: Axios

Auth: JWT (via backend)

Payment: M-Pesa STK Push (Safaricom)


On login, the app receives an access + refresh token.

Access token is stored in localStorage and used in headers.

Expired sessions are handled gracefully (refresh logic planned for future).

