// Función para crear una reserva
const crearReserva = async (req, res) => {
    try {
      const { fecha, horaInicio, horaFin, canchaId, centroDeportivoId, reservadorId, estado } = req.body;
      
      // Validar que los datos necesarios estén presentes
      if (!fecha || !horaInicio || !horaFin || !canchaId || !centroDeportivoId) {
        return res.status(400).json({
          success: false,
          error: 'Faltan datos requeridos para crear la reserva'
        });
      }
      
      // Crear la reserva en la base de datos
      const nuevaReserva = await prisma.Reserva.create({
        data: {
          fecha: new Date(fecha),
          horaInicio: new Date(horaInicio),
          horaFin: new Date(horaFin),
          canchaId,
          centroDeportivoId,
          reservadorId: reservadorId || null,
          estado: estado || 'DISPONIBLE'
        }
      });
      
      return res.status(201).json({
        success: true,
        data: nuevaReserva
      });
    } catch (error) {
      console.error('Error al crear reserva:', error);
      return res.status(500).json({
        success: false,
        error: 'Error al crear la reserva',
        details: error.message
      });
    }
  };