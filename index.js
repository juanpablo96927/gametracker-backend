//Variable
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT;

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

// 1. IMPORTAR TODAS LAS RUTAS
const reviewRoutes = require('./routes/reviewRoutes');
const gameRoutes = require('./routes/gameRoutes');


// Rutas de prueba
app.get('/', (req, res) => {
res.send('Servidor GameTracker Backend Funcionando en localhost!');
});


// 2. CONECCION DE RUTAS
app.use('/api/juegos/:gameId/reviews', reviewRoutes);
app.use('/api/juegos', gameRoutes);


// SERVIDOR LOCAL
app.listen(port, () => {
console.log(`Servidor corriendo en http://localhost:${port}`);
});