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
  try {
    const { descripcion, precio } = req.body;
    const imagen = '/images/' + req.file.filename;

    await db.query(
      'INSERT INTO productos (descripcion, precio, imagen) VALUES (?, ?, ?)',
      [descripcion, precio, imagen]
    );

    res.redirect('/productos');
  } catch (error) {
    console.error('Error al guardar producto:', error);
    res.status(500).send('Error al guardar el producto');
  }
});

//Muestra todos los productos
router.get('/', async (req, res) => {
  try {
    const [productos] = await db.query('SELECT * FROM productos');
    res.render('productos', { title: 'Productos', productos });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).send('Error al obtener productos');
  }
});

module.exports = router;
