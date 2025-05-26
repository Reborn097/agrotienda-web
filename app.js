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

// Registro de helper para Handlebars
hbs.registerHelper('eq', (a, b) => a === b);

// Configuración del motor de vistas
app.use('/', indexRouter);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.set('view options', { layout: 'layout' });

// Middlewares
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// Sesiones (DEBE ir antes que las rutas que usen req.session)
app.use(session({
  secret: 'claveSecreta123',
  resave: false,
  saveUninitialized: true
}));

// Pasar la sesión a las vistas
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas

app.use('/users', usersRouter);
app.use('/productos', productosRouter); // ← Ya está en el lugar correcto
app.use('/carrito', carritoRouter);
app.use('/usuarios', usuariosRouter);

// Error 404
app.use(function (req, res, next) {
  res.status(404).render('error', { message: 'Página no encontrada' });
});

// Manejador de errores
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
