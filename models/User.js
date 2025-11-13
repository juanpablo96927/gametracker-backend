const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// 1. Definición del Esquema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, 
        trim: true,
        lowercase: true 
    },
    email: {
        type: String,
        required: true,
        unique: true, 
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, 'Por favor, introduce un correo electrónico válido']
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    fechaRegistro: {
        type: Date,
        default: Date.now
    }
});

// 2. MIDDLEWARE (Hook) para HASHING de Contraseña
userSchema.pre('save', async function (next) {
    const user = this;

    // Solo hashear la contraseña si ha sido modificada 
    if (!user.isModified('password')) {
        return next();
    }

    try {
        // Generar el salt y hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// 3. Método para Comparar Contraseñas
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};


module.exports = mongoose.model('User', userSchema);