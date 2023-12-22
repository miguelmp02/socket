var createError = require('http-errors');
const express = require('express');
//const socketIO = require('socket.io');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session'); // Agregamos express-session

var loginRouter = require('./routes/login');
var homeRouter = require('./routes/home')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


var app = express();
const io = socketIO(server);

// Configuración de express-session
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para verificar la sesión
app.use(function(req, res, next) {
  if (!req.session.user && req.path !== '/login') {
    res.redirect('/login');
  } else {
    next();
  }
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/home', homeRouter);
app.use('/login', loginRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'home.html')); // Asegúrate de que esta ruta sea correcta
});

io.on('connection', (socket) => {
  console.log('Usuario conectado');

  // Manejar el evento de nuevo mensaje
  socket.on('nuevo-mensaje', (mensaje) => {
    // Transmitir el mensaje a todos los clientes conectados
    io.emit('mensaje', { usuario: socket.usuario, mensaje });
  });

  // Manejar el evento de desconexión
  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

// error handler
app.use(function(err, req, res, next) {

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
