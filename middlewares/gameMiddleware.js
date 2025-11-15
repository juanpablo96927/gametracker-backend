const Game = require('../models/Game');

const getGame = async (req, res, next) => {
  let game;
  const gameId = req.params.id || req.params.gameId;

  if (!gameId) {
    return res.status(400).json({ message: 'Se requiere un ID de juego' });
  }

  try {
    // Buscar el juego y cargar las reseñas
    // ✅ Nota: Ahora 'reviews' debe ser un array de ObjectIds
    game = await Game.findById(gameId).populate('reviews');

    if (game == null) {
      return res.status(404).json({ message: 'Juego no encontrado' });
    }
  } catch (error) {
    if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'ID de juego inválido' });
    }
    return res.status(500).json({ message: error.message });
  }

  res.game = game;
  next();
};


module.exports = getGame;