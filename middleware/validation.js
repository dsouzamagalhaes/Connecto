const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('senha').isLength({ min: 6 }),
  body('tipo').isIn(['artista', 'organizador']),
  body('nome').notEmpty().trim(),
  handleValidationErrors
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('senha').notEmpty(),
  handleValidationErrors
];

const artistaUpdateValidation = [
  body('nome').optional().notEmpty().trim(),
  body('descricao').optional().trim(),
  body('generos').optional().isArray(),
  handleValidationErrors
];

module.exports = {
  registerValidation,
  loginValidation,
  artistaUpdateValidation,
  handleValidationErrors
};
