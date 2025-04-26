require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const { PrismaClient } = require('@prisma/client');

// Inicialización
const app = express();
const prisma = new PrismaClient();

// Middlewares (en orden correcto)
app.use(helmet()); // Seguridad básica

// Configura CORS correctamente - SOLO UNA VEZ y antes de las rutas
app.use(cors({
  origin: '*', // En producción, limitar a tu dominio
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(morgan('dev')); // Logging de requests
app.use(express.json({ limit: '50mb' })); // Parseo de JSON con límite mayor para imágenes

// Conexión a Prisma (verificación)
prisma.$connect()
  .then(() => console.log('✅ Conectado a PostgreSQL'))
  .catch(err => console.error('❌ Error de conexión a DB:', err));

// Importar y usar rutas
const authRoutes = require('./routes/authRoutes');
const centroDeportivoRoutes = require('./routes/centroDeportivoRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/centros-deportivos', centroDeportivoRoutes);

// Ruta de verificación sencilla
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', message: 'API funcionando correctamente' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('🔥 Error global:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: err.message
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo:
  - Local: http://localhost:${PORT}
  - Red: http://192.168.100.13:${PORT}`);
});

// Manejo de cierre limpio
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit();
});

// Crear Centros Deportivos
const crearCentroDeportivo = async (req, res) => {
  try {
    const { nombre, ubicacion, imagenUrl, imagenNombre, imagenTamaño, imagenTipo } = req.body;

    const nuevoCentro = await prisma.centroDeportivo.create({
      data: {
        nombre,
        ubicacion,
        imagenUrl,
        imagenNombre,
        imagenTamaño,
        imagenTipo
      }
    });

    res.status(201).json(nuevoCentro);
  } catch (error) {
    console.error('Error al crear centro deportivo:', error);
    res.status(500).json({ error: 'Error al crear centro deportivo' });
  }

  const centroDeportivoRoutes = require('./routes/centroDeportivoRoutes');
const reservaRoutes = require('./routes/reservaRoutes'); // Asegúrate de que este archivo exista

};
