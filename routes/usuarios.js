const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const db = require('../db');

// Mostrar formularios
router.get('/registro', (req, res) => res.render('registro', { title: 'Registro' }));
router.get('/login', (req, res) => res.render('login', { title: 'Login' }));

// Registro de usuario
router.post('/registrar', async (req, res) => {
  try {
    console.log('Solicitud de registro recibida:', req.body); 

    const { nombre, correo, contrasena, rol } = req.body;

    if (!nombre || !correo || !contrasena || !rol) {
      return res.status(400).send('Todos los campos son obligatorios.');
    }

    const hash = await bcrypt.hash(contrasena, 10);
    await db.query(
      'INSERT INTO usuarios (nombre, correo, contrasena, rol) VALUES (?, ?, ?, ?)',
      [nombre, correo, hash, rol]
    );

    res.redirect('/usuarios/login');
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).send('Error al registrar el usuario.');
  }
});




// Login
router.post('/login', async (req, res) => {
  const { correo, contrasena } = req.body;
  const [rows] = await db.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);

  if (rows.length === 0 || !(await bcrypt.compare(contrasena, rows[0].contrasena))) {
    return res.send('Credenciales incorrectas');
  }

  req.session.usuario = rows[0].nombre;
  req.session.rol = rows[0].rol;
  res.redirect('/');
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
