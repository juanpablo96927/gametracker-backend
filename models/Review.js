const mongoose = require('mongoose');

// Define el esquema con la estructura de tu proyecto
const reviewSchema = new mongoose.Schema({
    // Usamos el tipo ObjectId y la referencia al modelo 'Game'
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
        default: 'Usuario Anónimo' },
    fechaCreacion: { type: Date, 
        default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);
