const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/school', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB Connection Error:', err));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/events', require('./routes/events'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/carousel', require('./routes/carousel'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/students', require('./routes/students'));
app.use('/api/fees', require('./routes/fees'));
app.use('/api/classes', require('./routes/classes'));
app.use('/api/classTeachers', require('./routes/classTeachers'));
app.use('/api/enrollmentNumbers', require('./routes/enrollmentNumbers'));
app.use('/api/teachers', require('./routes/teachers'));
app.use('/api/fines', require('./routes/fines'));
app.use('/api/examResults', require('./routes/examResults'));

// Serve React client in production
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '..', 'client', 'build');

  app.use(express.static(clientBuildPath));

  // For any non-API route, serve the React index.html
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ message: 'API route not found' });
    }
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

