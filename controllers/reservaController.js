const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const crearReserva = async (req, res) => {
    const { 
        fecha, 
        horaInicio, 
        horaFin, 
        canchaId, 
        centroDeportivoId, 
        reservadorId,  // Ahora opcional
        responsableId, // Puede ser opcional o requerido según tu lógica
        objetosRentadosIds  // Opcional
    } = req.body;

    // Validación de campos obligatorios (eliminamos reservadorId)
    if (!fecha || !horaInicio || !horaFin || !canchaId || !centroDeportivoId) {
        return res.status(400).json({ 
            success: false,
            error: 'Faltan campos obligatorios: fecha, horaInicio, horaFin, canchaId, centroDeportivoId son requeridos' 
        });
    }

    try {
        // Verificar existencia de cancha y centro deportivo
        const [cancha, centroDeportivo] = await Promise.all([
            prisma.Cancha.findUnique({ where: { id: canchaId } }),
            prisma.CentroDeportivo.findUnique({ where: { id: centroDeportivoId } })
        ]);

        if (!cancha) return res.status(404).json({ success: false, error: 'Cancha no encontrada' });
        if (!centroDeportivo) return res.status(404).json({ success: false, error: 'Centro deportivo no encontrado' });

        // Verificación condicional de usuarios
        let reservador = null;
        let responsable = null;

        if (reservadorId) {
            reservador = await prisma.Usuarios.findUnique({ where: { id: reservadorId } });
            if (!reservador) return res.status(404).json({ success: false, error: 'Usuario reservador no encontrado' });
        }

        if (responsableId) {
            responsable = await prisma.Usuarios.findUnique({ where: { id: responsableId } });
            if (!responsable) return res.status(404).json({ success: false, error: 'Responsable no encontrado' });
        }

        // Crear objeto de datos para Prisma
        const reservaData = {
            fecha: new Date(fecha),
            horaInicio: new Date(horaInicio),
            horaFin: new Date(horaFin),
            centroDeportivo: { connect: { id: centroDeportivoId } },
            cancha: { connect: { id: canchaId } },
            estado: "DISPONIBLE" // Suponiendo que tienes un campo estado
        };

        // Agregar relaciones opcionales si se proporcionan IDs
        if (reservadorId) {
            reservaData.reservador = { connect: { id: reservadorId } };
        }
        
        if (responsableId) {
            reservaData.responsable = { connect: { id: responsableId } };
        }

        if (objetosRentadosIds && objetosRentadosIds.length > 0) {
            reservaData.objetosRentados = {
                connect: objetosRentadosIds.map(id => ({ id }))
            };
        }

        // Crear reserva
        const nuevaReserva = await prisma.Reserva.create({
            data: reservaData,
            include: {
                cancha: true,
                centroDeportivo: true,
                reservador: reservadorId ? true : false,
                responsable: responsableId ? true : false,
                objetosRentados: objetosRentadosIds && objetosRentadosIds.length > 0 ? true : false
            }
        });

        res.status(201).json({
            success: true,
            data: nuevaReserva
        });
    } catch (error) {
        console.error('Error al crear reserva:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error al crear reserva', 
            details: error.message 
        });
    }
};

module.exports = { crearReserva };