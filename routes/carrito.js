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
    res.render('carrito', {
        title: 'Tu Carrito',
        carrito: req.session.carrito || []
    });
});

module.exports = router;
