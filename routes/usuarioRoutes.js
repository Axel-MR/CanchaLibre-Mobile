const express = require('express');
const router = express.Router();
const {
  crearUsuario,
  obtenerUsuarios,
  obtenerUsuarioPorId,
  eliminarUsuario,
  iniciarSesion,
} = require('../controllers/usuarioController');

// Rutas para usuarios
router.post('/', crearUsuario);
router.get('/', obtenerUsuarios);
router.get('/:id', obtenerUsuarioPorId);
router.delete('/:id', eliminarUsuario);

// Ruta para iniciar sesión
router.post('/login', iniciarSesion);

module.exports = router;