// routes/reservaRoutes.js
const express = require('express');
const router = express.Router();
const { 
    crearReserva, 
    obtenerReservas, 
    obtenerReservasDisponibles 
} = require('../controllers/reservaController');

router.get('/', obtenerReservas); // Obtener todas las reservas
router.get('/disponibles', obtenerReservasDisponibles); // Obtener reservas disponibles
router.post('/', crearReserva); // Crear una nueva reserva

module.exports = router;