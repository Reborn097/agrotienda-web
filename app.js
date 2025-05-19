const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const hbs = require('hbs');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const productosRouter = require('./routes/productos');
const carritoRouter = require('./routes/carrito');
const usuariosRouter = require('./routes/usuarios');

const app = express();

// ⬅️ REGISTRA EL HELPER PARA USAR eq EN HANDLBARS
hbs.registerHelper('eq', (a, b) => a === b);

// 🟢 CONFIGURACIÓN DEL MOTOR DE VISTAS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.set('view options', { layout: 'layout' }); // Usa layout.hbs por defecto

// 🛠️ MIDDLEWARES
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));  // 🟢 debe estar antes de las rutas POST
app.use(express.json());                           // 🟢 igual este
app.use(cookieParser());

app.use(session({
  secret: 'claveSecreta123',
  resave: false,
  saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'public')));

// 🚏 RUTAS
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/productos', productosRouter);
app.use('/carrito', carritoRouter);
app.use('/usuarios', usuariosRouter);

// 🛑 PÁGINA NO ENCONTRADA
app.use(function (req, res, next) {
  res.status(404).render('error', { message: 'Página no encontrada' });
});

// ⚠️ MANEJO DE ERRORES
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
