const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

async function main() {
  try {
    // Use same connection logic as server/index.js
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/school';

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const email = process.env.ADMIN_EMAIL || 'admin@school.com';
    const password = process.env.ADMIN_PASSWORD || 'Admin@123';

    console.log('Connecting to DB:', uri);
    console.log('Ensuring admin user exists for:', email);

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        name: 'Super Admin',
        email,
        password,
        role: 'admin',
      });
      await user.save();
      console.log('Admin user created:', email);
    } else {
      user.role = 'admin';
      // Only update password if ADMIN_PASSWORD is explicitly set
      if (process.env.ADMIN_PASSWORD) {
        user.password = password;
      }
      await user.save();
      console.log('Existing user promoted to admin:', email);
    }
  } catch (err) {
    console.error('Error creating admin user:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

main();


