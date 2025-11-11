//Variable
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Connect to MongoDB Atlas
const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Base de datos conectada');
  } catch (error) {
    console.error('Error de conexión:', error);
    process.exit(1);
  }
};

conectarDB();


app.get('/', (req, res) => {
  res.send('Servidor GameTracker Backend Funcionando en localhost!');
});
// SERVIDOR LOCAL
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});


//Ruta de prueba, game router
const gameRouter = require('./routes/gameRoutes');
app.use('/api/juegos', gameRouter);