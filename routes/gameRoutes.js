const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const Review = require('../models/Review');
const { getGame } = require('../middlewares/gameMiddleware');



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
    'desarrollador', 'portada', 'descripcion', 
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
    
    // 2. Borrar el juego
    await res.game.deleteOne();
    
    // El mensaje ahora confirma ambos borrados
    res.json({ message: 'Juego y datos asociados eliminados correctamente.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;