const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const crearCancha = async (req, res) => {
  const { nombre, deporte, alumbrado, centroDeportivoId } = req.body;

  if (!nombre || !deporte || alumbrado === undefined || !centroDeportivoId) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    // Verificar si el centro deportivo existe
    const centroExistente = await prisma.centroDeportivo.findUnique({
      where: { id: centroDeportivoId },
    });

    if (!centroExistente) {
      return res.status(404).json({ error: 'Centro deportivo no encontrado' });
    }

    // Crear la cancha
    const nuevaCancha = await prisma.canchas.create({
      data: {
        nombre,
        deporte,
        alumbrado,
        centroDeportivoId: centroDeportivoId,
      },
    });

    res.json(nuevaCancha);
  } catch (error) {
    console.error('Error al crear cancha:', error);
    res.status(500).json({ error: 'Error al crear cancha', details: error.message });
  }
};

module.exports = { crearCancha };