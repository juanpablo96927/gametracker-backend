const mongoose = require('mongoose');
const Game = require('./Game');

const reviewSchema = new mongoose.Schema({
    puntuacion: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    game: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Game'
    },
    // ✅ CORRECCIÓN 1: Cambiado a 'texto' para coincidir con el frontend
    texto: {
        type: String, 
        required: true, 
        trim: true, 
        maxlength: 500 
    },
    // ✅ CORRECCIÓN 2: El autor debe ser el ObjectId del usuario logueado
    autor: { 
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    fechaCreacion: { 
        type: Date, 
        default: Date.now 
    }
});

// CALCULO DE LA PUNTUACION PROMEDIO (Se mantiene la lógica original)
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