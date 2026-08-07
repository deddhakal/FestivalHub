# FestivalHub

FestivalHub is a comprehensive web application for managing and navigating festival events. It provides a rich, interactive experience for festival attendees (visitors) and a powerful dashboard for event organizers (admins).

## Features

### For Visitors
*   **Events & Schedule:** Browse the full list of festival events, view details, and stay up-to-date with the schedule.
*   **Ticket Booking:** Easily book tickets for events directly through the platform.
*   **Manage Tickets:** View and manage purchased tickets (Digital Ticket representation).
*   **Interactive Festival Map:** Navigate the festival grounds using an interactive map (powered by Leaflet).
*   **Food & Attractions:** Discover food vendors and other attractions at the festival.
*   **Announcements:** Read important updates and announcements from organizers.
*   **Contact:** Send messages or inquiries to the festival team.

### For Administrators
*   **Secure Admin Dashboard:** Centralized hub for festival management.
*   **Manage Events:** Add, edit, or remove events from the schedule.
*   **Manage Vendors:** Oversee food stalls and attraction vendors.
*   **Manage Tickets:** Track ticket sales and validate bookings.
*   **Manage Announcements:** Publish updates that are instantly visible to visitors.
*   **Manage Messages:** Read and respond to contact inquiries from visitors.

## Tech Stack

**Frontend**
*   **Framework:** React 19 with Vite
*   **Styling:** Tailwind CSS
*   **Routing:** React Router v7
*   **Animations:** Framer Motion
*   **Maps:** Leaflet & React-Leaflet
*   **Icons:** Lucide React

**Backend**
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** MySQL (using `mysql2`)
*   **Authentication:** Express-Session with bcryptjs
*   **File Uploads:** Multer

## Getting Started

Follow these steps to set up the project locally.

### 1. Database Setup
1.  Ensure you have MySQL installed and running on your system.
2.  Create a new database named `festivalhub`.
3.  Import the provided SQL schema from `database/festivalhub.sql` into your new database.

### 2. Backend Setup
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend` directory with the following variables (adjust according to your MySQL setup):
    ```env
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_password
    DB_NAME=festivalhub
    DB_PORT=3306
    SESSION_SECRET=your_secret_key_here
    PORT=5000
    ```
4.  Start the backend development server:
    ```bash
    npm run dev
    ```

### 3. Frontend Setup
1.  Open a new terminal window and navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the frontend development server:
    ```bash
    npm run dev
    ```
4.  The application should now be accessible in your browser (typically at `http://localhost:5173`).

## Project Structure
*   `/frontend` - Contains the React Vite application (UI, components, pages).
*   `/backend` - Contains the Node.js/Express API server, routes, and database configuration.
*   `/database` - Contains the SQL schema, API Postman collection, and testing documentation.

## Documentation
*   **API Documentation:** Available in `database/API_Documentation.md`.
*   **Postman Collection:** Available in `database/FestivalHub_API.postman_collection.json`.
*   **Manual Test Cases:** Available in `database/Manual_Test_Cases.md`.
