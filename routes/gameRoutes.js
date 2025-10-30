// routes/gameRoutes.js
const express = require('express');
const router = express.Router();
const Game = require('../models/Game');

// GET /api/juegos - Obtener todos los juegos de tu biblioteca
router.get('/', async (req, res) => {
    try {
        const games = await Game.find();
        res.json(games);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/juegos/:id - Obtener un juego específico
router.get('/:id', async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        if (game == null) {
            return res.status(404).json({ message: 'Juego no encontrado' });
        }
        res.json(game);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;