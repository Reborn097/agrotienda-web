const express = require('express');
const router = express.Router();

// Simulación de productos
const productos = [
  { id: 1, descripcion: 'Herbicida X', precio: 150, imagen: '/images/herbicida.jpg' },
  { id: 2, descripcion: 'Fungicida Y', precio: 200, imagen: '/images/fungicida.jpg' },
  { id: 3, descripcion: 'Insecticida Z', precio: 120, imagen: '/images/insecticida.jpg' }
];

router.get('/', (req, res) => {
  res.render('productos', { title: 'Productos', productos });
});

module.exports = router;
