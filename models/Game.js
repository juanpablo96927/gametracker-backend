const mongoose = require('mongoose');

// Define el esquema con la estructura de tu proyecto
const gameSchema = new mongoose.Schema({
    titulo: { type: String, required: true, trim: true },
    genero: String,
    plataforma: String,
    anioLanzamiento: Number,
    desarrollador: String,
    iPortada: String,
    descripcion: String,
    completado: { type: Boolean, default: false },
    puntuacion: { type: Number, min: 0, max: 5, default: 0 },
    horasJugadas: { type: Number, default: 0 },
    fechaCreacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Game', gameSchema);