// centroDeportivoController.js (corregido)
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Crear un nuevo centro deportivo
const crearCentroDeportivo = async (req, res) => {
  const { nombre, ubicacion } = req.body; // Solo se requieren estos campos

  // Validación básica
  if (!nombre || !ubicacion) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    const nuevoCentro = await prisma.centroDeportivo.create({
      data: {
        nombre,
        ubicacion,
      },
    });
    res.json(nuevoCentro);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear centro deportivo', details: error.message });
  }
};

module.exports = { crearCentroDeportivo };