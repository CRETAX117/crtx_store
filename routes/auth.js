const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { loginRules, validate } = require('../middlewares/validators');

// Mostrar login
router.get('/login', (req, res) => {
  if (req.session && req.session.userId) {
    return res.redirect('/products');
  }
  res.render('auth/login', {
    title: 'Iniciar Sesión',
    layout: 'main'
  });
});

// Procesar login
router.post('/login', loginRules, validate, async (req, res) => {
  if (req.validationErrors) {
    return res.render('auth/login', {
      title: 'Iniciar Sesión',
      errors: req.validationErrors,
      username: req.body.username
    });
  }

  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.render('auth/login', {
        title: 'Iniciar Sesión',
        errors: ['Usuario o contraseña incorrectos'],
        username: req.body.username
      });
    }

    const match = await user.comparePassword(req.body.password);
    if (!match) {
      return res.render('auth/login', {
        title: 'Iniciar Sesión',
        errors: ['Usuario o contraseña incorrectos'],
        username: req.body.username
      });
    }

    // Crear sesion
    req.session.userId = user._id;
    req.session.username = user.username;
    res.redirect('/products');
  } catch (err) {
    res.render('auth/login', {
      title: 'Iniciar Sesión',
      errors: ['Error al iniciar sesión']
    });
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
});

module.exports = router;
