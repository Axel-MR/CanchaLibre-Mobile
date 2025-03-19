// centroDeportivoRoutes.js (versión simplificada)
const express = require('express');
const router = express.Router();
const { crearCentroDeportivo } = require('../controllers/centroDeportivoController');

// Ruta para crear un centro deportivo (sin verificación de admin)
router.post('/', crearCentroDeportivo); // <- Middleware verificarAdmin eliminado

module.exports = router;