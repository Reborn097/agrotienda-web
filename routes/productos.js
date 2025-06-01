const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../db');

// Configuración de Multer para subir imágenes
const storage = multer.diskStorage({
  destination: path.join(__dirname, '../public/images'),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

/* -------------------- RUTAS -------------------- */

// Mostrar formulario para agregar producto
router.get('/nuevo', (req, res) => {
  if (!req.session.usuario || req.session.rol !== 'admin') {
    return res.status(403).send('Acceso denegado');
  }
  res.render('nuevo_producto', { title: 'Agregar Producto' });
});

// Guardar nuevo producto con imagen
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

// Mostrar todos los productos
router.get('/', async (req, res) => {
  try {
    const [productos] = await db.query('SELECT * FROM productos');
    res.render('productos', { title: 'Productos', productos });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).send('Error al obtener productos');
  }
});

// Mostrar formulario para editar producto
router.get('/editar/:id', async (req, res) => {
  if (req.session.rol !== 'admin') {
    return res.status(403).send('Acceso denegado');
  }

  try {
    const [result] = await db.query('SELECT * FROM productos WHERE id = ?', [req.params.id]);
    const producto = result[0];
    res.render('editar_producto', { title: 'Editar Producto', producto });
  } catch (error) {
    console.error('Error al cargar producto:', error);
    res.status(500).send('Error al cargar producto');
  }
});

// Guardar cambios del producto (con o sin imagen nueva)
router.post('/editar/:id', upload.single('imagen'), async (req, res) => {
  if (req.session.rol !== 'admin') {
    return res.status(403).send('Acceso denegado');
  }

  const { descripcion, precio } = req.body;
  let query, params;

  if (req.file) {
    const imagen = '/images/' + req.file.filename;
    query = 'UPDATE productos SET descripcion = ?, precio = ?, imagen = ? WHERE id = ?';
    params = [descripcion, precio, imagen, req.params.id];
  } else {
    query = 'UPDATE productos SET descripcion = ?, precio = ? WHERE id = ?';
    params = [descripcion, precio, req.params.id];
  }

  try {
    await db.query(query, params);
    res.redirect('/productos');
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).send('Error al actualizar producto');
  }
});

// Eliminar un producto
router.post('/eliminar/:id', async (req, res) => {
  if (req.session.rol !== 'admin') {
    return res.status(403).send('Acceso denegado');
  }

  try {
    await db.query('DELETE FROM productos WHERE id = ?', [req.params.id]);
    res.redirect('/productos');
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).send('Error al eliminar el producto');
  }
});

module.exports = router;
