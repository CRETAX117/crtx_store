const { body, validationResult } = require('express-validator');

// Reglas para productos
const productRules = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),
  body('precio')
    .notEmpty().withMessage('El precio es obligatorio')
    .isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),
  body('descripcion')
    .trim()
    .notEmpty().withMessage('La descripción es obligatoria')
    .isLength({ min: 10 }).withMessage('La descripción debe tener al menos 10 caracteres')
];

// Reglas para login
const loginRules = [
  body('username')
    .trim()
    .notEmpty().withMessage('El usuario es obligatorio'),
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
];

// Recoge errores y los devuelve como array
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.validationErrors = errors.array().map(e => e.msg);
    return next();
  }
  req.validationErrors = null;
  next();
};

module.exports = { productRules, loginRules, validate };
