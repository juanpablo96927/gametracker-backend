const mongoose = require('mongoose');
const Game = require('./Game');
// Define el esquema con la estructura de tu proyecto
const reviewSchema = new mongoose.Schema({
    // Puntaciones por reseña (1-5 estrellas)
    puntuacion: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    // Uso del tipo ObjectId para referenciar el juego
    game: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Game'
    },
    contenido: {
        type: String, 
        required: true, 
        trim: true, 
        maxlength: 500 
    },
    autor: { 
        type: String, 
        default: 'Usuario Anónimo' 
    },
    fechaCreacion: { 
        type: Date, 
        default: Date.now 
    }
});

// CALCULO DE LA PUNTUACION PROMEDIO - A traves de Moongose Aggregation
// reviewSchema.js
reviewSchema.statics.calcularPuntuacionPromedio = async function(gameId) {
    const [stat] = await this.aggregate([
        { $match: { game: gameId } },
        { $group: { _id: '$game', avg: { $avg: '$puntuacion' } } }
    ]);
    return stat ? Number(stat.avg.toFixed(1)) : 0;
};

reviewSchema.statics.actualizarPuntuacionMedia = async function(gameId) {
    const promedio = await this.calcularPuntuacionPromedio(gameId);
    await Game.findByIdAndUpdate(gameId, { puntuacion: promedio });
};

// Hooks
reviewSchema.post('save', async function() {
    await this.constructor.actualizarPuntuacionMedia(this.game);
});

reviewSchema.post('deleteOne', { document: true, query: false }, async function() {
    await this.constructor.actualizarPuntuacionMedia(this.game);
});


module.exports = mongoose.model('Review', reviewSchema);
