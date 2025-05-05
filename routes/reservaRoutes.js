// routes/reservaRoutes.js
const express = require('express');
const router = express.Router();
const { 
    crearReserva, 
    obtenerReservas, 
    obtenerReservasDisponibles,
    actualizarReserva // Añadir esta función importada
} = require('../controllers/reservaController');

router.get('/', obtenerReservas); // Obtener todas las reservas
router.get('/disponibles', obtenerReservasDisponibles); // Obtener reservas disponibles
router.post('/', crearReserva); // Crear una nueva reserva
router.put('/:id', actualizarReserva); // Nueva ruta para actualizar una reserva

module.exports = router;