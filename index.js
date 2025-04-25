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
app.use(cors({
  origin: '*',
  methods: ['POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(morgan('dev')); // Logging de requests
app.use(express.json()); // Parseo de JSON

// Conexión a Prisma (verificación)
prisma.$connect()
  .then(() => console.log('✅ Conectado a PostgreSQL'))
  .catch(err => console.error('❌ Error de conexión a DB:', err));

// Importar y usar rutas
const authRoutes = require('./routes/authRoutes');
const centroDeportivoRoutes = require('./routes/centroDeportivoRoutes'); // Añade esta línea

app.use('/api/auth', authRoutes);
app.use('/api/centros-deportivos', centroDeportivoRoutes); // Añade esta línea

// Actualiza CORS para permitir todos los métodos necesarios
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Actualizado
  allowedHeaders: ['Content-Type', 'Authorization'] // Añade Authorization
}));
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
  console.log(`
  🚀 Servidor corriendo:
  - Local: http://localhost:${PORT}
  - Red: http://192.168.0.178:${PORT}
  `);
});

// Manejo de cierre limpio
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit();
});

//Crear Centros Deportivos
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
};