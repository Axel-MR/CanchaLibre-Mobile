const express = require('express');
const usuarioRoutes = require('./routes/usuarioRoutes');
const centroDeportivoRoutes = require('./routes/centroDeportivoRoutes');
const canchasRoutes = require('./routes/canchasRoutes');
const reservaRoutes = require('./routes/reservaRoutes'); 

const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Ruta raíz
app.get('/', (req, res) => {
  res.send('¡Bienvenido a la API de CanchaLibre!');
});

// Conectar rutas
app.use('/usuarios', usuarioRoutes);
app.use('/centros-deportivos', centroDeportivoRoutes);
app.use('/canchas', canchasRoutes); 
app.use('/reservas', reservaRoutes);

// Iniciar el servidor
app.listen(port, 'localhost', () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});