const express = require('express');
const router = express.Router();

router.post('/agregar', (req, res) => {
    const { id, descripcion, precio } = req.body;
    const nuevoItem = {
        id,
        descripcion,
        precio,
        cantidad: 1
    };

    if (!req.session.carrito) {
        req.session.carrito = [];
    }

    const existente = req.session.carrito.find(p => p.id == id);
    if (existente) {
        existente.cantidad++;
    } else {
        req.session.carrito.push(nuevoItem);
    }

    res.redirect('/');
});

router.get('/', (req, res) => {
  if (!req.session.usuario || req.session.rol !== 'cliente') {
    return res.redirect('/usuarios/login');
  }

  const carrito = req.session.carrito || [];
const total = carrito.reduce((sum, prod) => sum + prod.precio * prod.cantidad, 0);
res.render('carrito', { title: 'Tu Carrito', carrito, total });

});

router.post('/checkout', (req, res) => {
  req.session.carrito = [];  // Vaciar carrito
  res.send('<h2>¡Compra realizada con éxito!</h2><a href="/productos">Seguir comprando</a>');
});

module.exports = router;
