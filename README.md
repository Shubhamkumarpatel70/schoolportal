# School Management System

A comprehensive school website built with MERN stack (MongoDB, Express, React, Node.js) and Tailwind CSS.

## Features

- **Authentication**: Login and Register functionality
- **Role-based Access**: Admin, Student, Teacher, and Accountant dashboards
- **Public Pages**: Home, About, Contact, Gallery, Events, Notifications
- **Responsive Design**: Fully responsive using Tailwind CSS
- **Modern UI**: Clean and modern interface with Tailwind CSS

## Tech Stack

- **Frontend**: React, React Router, Tailwind CSS, Axios
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: Tailwind CSS

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)

### Setup

1. **Install root dependencies:**
```bash
npm install
```

2. **Install server dependencies:**
```bash
cd server
npm install
```

3. **Install client dependencies:**
```bash
cd ../client
npm install
```

4. **Configure environment variables:**
   - Create a `.env` file in the `server` directory
   - Add the following:
   ```
   MONGODB_URI=mongodb://localhost:27017/school
   JWT_SECRET=your_jwt_secret_key_change_this_in_production
   PORT=5000
   ```

5. **Start MongoDB:**
   - Make sure MongoDB is running on your system

6. **Run the application:**
   - From the root directory:
   ```bash
   npm run dev
   ```
   - This will start both the server (port 5000) and client (port 3000)

   Or run separately:
   - Server: `npm run server`
   - Client: `npm run client`

## Usage

1. **Register a new account:**
   - Navigate to `/register`
   - Fill in the registration form
   - Select your role (Student, Teacher, or Accountant)

2. **Login:**
   - Navigate to `/login`
   - Enter your credentials

3. **Access Dashboard:**
   - After login, you'll be redirected to your role-specific dashboard
   - Admin: `/admin/dashboard`
   - Student: `/student/dashboard`
   - Teacher: `/teacher/dashboard`
   - Accountant: `/accountant/dashboard`

## Project Structure

```
school-website/
├── server/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   └── index.js         # Server entry point
├── client/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context
│   │   └── App.js       # Main app component
│   └── public/          # Public assets
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create event (Admin only)
- `PUT /api/events/:id` - Update event (Admin only)
- `DELETE /api/events/:id` - Delete event (Admin only)

### Notifications
- `GET /api/notifications` - Get notifications (filtered by role)
- `POST /api/notifications` - Create notification (Admin only)
- `DELETE /api/notifications/:id` - Delete notification (Admin only)

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID

## Notes

- Make sure MongoDB is running before starting the server
- Change the JWT_SECRET in production
- The application uses CORS for cross-origin requests
- All dashboards are protected routes requiring authentication

## License

MIT

