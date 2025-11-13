const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Importamos el Modelo User
const jwt = require('jsonwebtoken'); // Para generar tokens

// Función para generar un Token de Autenticación
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // El token expira en 30 días
    });
};

// ===============================================
// RUTA 1: REGISTRO de Nuevo Usuario (POST /api/users/register)
// ===============================================
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // 1. Verificar si el usuario ya existe
        let userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'El usuario con este correo ya existe.' });
        }

        // 2. Crear y guardar el usuario (el hook 'pre save' hashea la contraseña)
        const user = await User.create({ username, email, password });

        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id), // Generamos y enviamos el token
            });
        }

    } catch (error) {
        // Mongoose validation error
        res.status(400).json({ message: error.message });
    }
});

// ===============================================
// RUTA 2: LOGIN de Usuario Existente (POST /api/users/login)
// ===============================================
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Encontrar el usuario por email
        const user = await User.findOne({ email });

        // 2. Verificar la existencia del usuario y la contraseña (usando el método comparePassword)
        if (user && (await user.comparePassword(password))) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id), // Generamos y enviamos el token
            });
        } else {
            res.status(401).json({ message: 'Credenciales inválidas (correo o contraseña incorrectos).' });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;