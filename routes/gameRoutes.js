const express = require('express');
const router = express.Router();
const Game = require('../models/Game');

// Middleware corregido
const getGame = async (req, res, next) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ message: 'Juego no encontrado' });
    }
    res.game = game;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET todos
router.get('/', async (req, res) => {
  try {
    const games = await Game.find();
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET por ID
router.get('/:id', getGame, (req, res) => {
  res.json(res.game);
});

// POST
router.post('/', async (req, res) => {
  try {
    const newGame = await Game.create(req.body);
    res.status(201).json(newGame);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT
router.put('/:id', getGame, async (req, res) => {
  const allowedUpdates = [
    'titulo', 'genero', 'plataforma', 'aniolanzamiento',
    'desarrollador', 'Portada', 'descripcion', 
    'completado', 'puntuacion', 'horasJugadas'
  ];

  const updates = Object.keys(req.body);
  const isValid = updates.every(update => allowedUpdates.includes(update));

  if (!isValid) {
    return res.status(400).json({ message: 'Campo no permitido' });
  }

  updates.forEach(update => res.game[update] = req.body[update]);

  try {
    const updated = await res.game.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE
router.delete('/:id', getGame, async (req, res) => {
  try {
    await res.game.deleteOne();
    res.json({ message: 'Juego eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;