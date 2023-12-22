// routes/login.js

var express = require('express');
var router = express.Router();

// Página de inicio de sesión
router.get('/login', function(req, res, next) {
  res.render('login');
});

// Procesar el formulario de inicio de sesión
router.post('/login', function(req, res, next) {
    const { username, password } = req.body;
  
    // Verifica las credenciales (puedes implementar tu propia lógica aquí)
    if (username === 'tu_usuario' && password === 'tu_contraseña') {
      // Almacena el usuario en la sesión
      req.session.user = username;
      res.redirect('/home'); // Redirige al usuario a la página home después del inicio de sesión exitoso
    } else {
      res.render('login', { error: 'Credenciales incorrectas' });
    }
  });

module.exports = router;
