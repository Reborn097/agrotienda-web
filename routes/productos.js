const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../db');

// Configuración de Multer
const storage = multer.diskStorage({
  destination: path.join(__dirname, '../public/images'),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Mostrar formulario para nuevo producto
router.get('/nuevo', (req, res) => {
  if (!req.session.usuario || req.session.rol !== 'admin') {
    return res.status(403).send('Acceso denegado');
  }
  res.render('nuevo_producto', { title: 'Agregar Producto' });
});


// Guardar producto con imagen
router.post('/nuevo', upload.single('imagen'), async (req, res) => {
  const { descripcion, precio } = req.body;
  const imagen = '/images/' + req.file.filename;

  await db.query('INSERT INTO productos (descripcion, precio, imagen) VALUES (?, ?, ?)', [
    descripcion, precio, imagen
  ]);

  res.redirect('/productos');
});

module.exports = router;
