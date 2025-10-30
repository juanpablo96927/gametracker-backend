const mongoose = require('mongoose');

// Define el esquema con la estructura de tu proyecto
const gameSchema = new mongoose.Schema({
    titulo: { type: String, required: true, trim: true },
    genero: String,
    plataforma: String,
    añoLanzamiento: Number,
    desarrollador: String,
    imagenPortada: String,
    descripcion: String,
    completado: { type: Boolean, default: false },
    puntuacion: { type: Number, min: 1, max: 5, default: 0 },
    horasJugadas: { type: Number, default: 0 },
    fechaCreacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Game', gameSchema);