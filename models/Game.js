const mongoose = require('mongoose');

// Define el esquema con la estructura de tu proyecto
const gameSchema = new mongoose.Schema({
    titulo: { type: String, required: true, trim: true },
    genero: String,
    plataforma: String,
    anioLanzamiento: Number,
    desarrollador: String,
    portada: String,
    descripcion: String,
    completado: { type: Boolean, default: false },
    puntuacion: { type: Number, min: 0, max: 5, default: 0 },
    horasJugadas: { type: Number, default: 0 },
    reviews: [
        {
            // Especifica que el tipo es un ID de MongoDB
            type: mongoose.Schema.Types.ObjectId,
            // Especifica el nombre del modelo al que hace referencia
            ref: 'Review' 
        }
    ],
    fechaCreacion: { 
        type: Date,
        default: Date.now 
    }
},
// Inclusion de la puntiacion media en el JSON
{
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true }
});

// Nombramiento de la puntuacion media a traves del campo puntuacion
gameSchema.virtual('puntuacionMedia').get(function() {
    return this.puntuacion;
});

module.exports = mongoose.model('Game', gameSchema);