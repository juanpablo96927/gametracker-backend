const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const Review = require('../models/Review');
const { getGame } = require('../middlewares/gameMiddleware');

// GET ALL/api/juegos
router.get('/', async (req, res) => {

  const query = {};
  if (req.query.titulo) {
    query.titulo = { $regex: req.query.titulo, $options: 'i' };
  }
  if (req.query.genero) {
    query.genero = { $regex: req.query.genero, $options: 'i' };
  }
  if (req.query.completado) {
    query.completado = req.query.completado === 'true';
  }

  // Paginación
  const limit = parseInt(req.query.limit) || 10;
  //Elementos maximos a mostrar por solicitud
  const skip = parseInt(req.query.skip) || 0;
  //Elemento desde donde se va a comenzar a mostrar los juegos

  try {  //Ejecucion de la consulta
    const games = await Game.find(query)
      .limit(limit)
      .skip(skip)
      .sort({ fechaCreacion: -1 }) // Ordena por los más recientes primero
      .exec();

    const totalGames = await Game.countDocuments(query);

    // Devolvemos la respuesta con los juegos y la información de paginación
    res.json({
      juegos: games,
      total: totalGames,
      limit: limit,
      skip: skip
    });

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
    'completado', 'horasJugadas'
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
    res.json({ message: 'Juego y datos asociados eliminados correctamente.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;