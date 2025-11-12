const Game = require('../models/Game');

const getGame = async (req, res, next) => {
  let game;
  // 1. Determinar el ID: busca en :id o en :gameId (para rutas anidadas)
  const gameId = req.params.id || req.params.gameId;

  if (!gameId) {
    // Uso incorrecto del Router
    return res.status(400).json({ message: 'Se requiere un ID de juego' });
  }

  try {
    // 2. Buscar el juego y cargar las reseñas
    game = await Game.findById(gameId).populate('reviews');

    if (game == null) {
      return res.status(404).json({ message: 'Juego no encontrado' });
    }
  } catch (error) {
    // Mongoose devuelve este error si el formato del ID es inválido
    if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'ID de juego inválido' });
    }
    return res.status(500).json({ message: error.message });
  }

  res.game = game;
  next();
};

module.exports = { getGame };