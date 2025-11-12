//Variable
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 

const app = express();
const port = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());

// IMPORTAR TODAS LAS RUTAS
const reviewRoutes = require('./routes/reviewRoutes');
const gameRoutes = require('./routes/gameRoutes');

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

// 2. CONECCION DE RUTAS
app.use('/api/juegos/:gameId/reviews', reviewRoutes);
app.use('/api/juegos', gameRoutes);

// Rutas de prueba
app.get('/', (req, res) => {
res.send('Servidor GameTracker Backend Funcionando en localhost!');
});

// SERVIDOR LOCAL
app.listen(port, () => {
console.log(`Servidor corriendo en http://localhost:${port}`);
});

conectarDB();