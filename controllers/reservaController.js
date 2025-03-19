const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const crearReserva = async (req, res) => {
    const { fecha, horaInicio, horaFin, canchaId, centroDeportivoId, reservadorId } = req.body;

    // Validación de campos obligatorios
    if (!fecha || !horaInicio || !horaFin || !canchaId || !centroDeportivoId || !reservadorId) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    try {
        // Verificar existencia de entidades relacionadas
        const [cancha, centroDeportivo, usuario] = await Promise.all([
            prisma.canchas.findUnique({ where: { id: canchaId } }),
            prisma.centroDeportivo.findUnique({ where: { id: centroDeportivoId } }),
            prisma.usuarios.findUnique({ where: { id: reservadorId } })
        ]);

        if (!cancha) return res.status(404).json({ error: 'Cancha no encontrada' });
        if (!centroDeportivo) return res.status(404).json({ error: 'Centro deportivo no encontrado' });
        if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

        // Crear reserva usando relaciones
        const nuevaReserva = await prisma.reserva.create({
            data: {
                fecha: new Date(fecha),
                horaInicio: new Date(horaInicio),
                horaFin: new Date(horaFin),
                centroDeportivo: { connect: { id: centroDeportivoId } }, // Relación
                cancha: { connect: { id: canchaId } }, // Relación
                reservador: { connect: { id: reservadorId } }, // Relación
            },
            include: {
                cancha: true,
                centroDeportivo: true,
                reservador: true,
            },
        });

        res.json(nuevaReserva);
    } catch (error) {
        console.error('Error al crear reserva:', error);
        res.status(500).json({ error: 'Error al crear reserva', details: error.message });
    }
};

module.exports = { crearReserva };