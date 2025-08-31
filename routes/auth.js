const express = require('express');
const AuthController = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../middleware/validation');

const router = express.Router();

// Registrar conta
router.post('/register', registerValidation, AuthController.register);

// Login
router.post('/login', loginValidation, AuthController.login);

module.exports = router;
