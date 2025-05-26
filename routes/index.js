const express = require('express');
const router = express.Router();

// Redirigir la raíz hacia /productos
router.get('/', (req, res) => {
  res.redirect('/productos');
});

module.exports = router;
