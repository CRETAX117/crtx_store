const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB conectado');

    // Borrar admin anterior
    await User.deleteMany({});

    const user = new User({
      username: 'cretax',
      password: 'cretaxpswd'
    });
    await user.save();

    console.log('Usuario creado (cretax / cretaxpswd)');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

createAdmin();
