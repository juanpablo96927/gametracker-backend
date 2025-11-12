const express = require('express');
const router = express.Router({ mergeParams: true }); // CLAVE: para usar :id del juego
const Review = require('../models/Review');
const { getGame } = require('../middlewares/gameMiddleware'); // Middleware para obtener el juego

// POST - Crear reseña
router.post('/', getGame, async (req, res) => {
  try {
    const review = new Review({
      contenido: req.body.contenido,
      autor: req.body.autor || 'Anónimo',
      game: res.game._id // Vinculamos al juego
    });

    const newReview = await review.save();

    // Añadimos la reseña al array del juego
    res.game.reviews.push(newReview._id);
    await res.game.save();

    res.status(201).json(newReview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET - Todas las reseñas de un juego
router.get('/', getGame, async (req, res) => {
  try {
    const reviews = await Review.find({ game: res.game._id });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE - Eliminar reseña
router.delete('/:reviewId', getGame, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    // Validación: ¿la reseña pertenece al juego?
    if (!review || review.game.toString() !== res.game._id.toString()) {
      return res.status(404).json({ message: 'Reseña no encontrada en este juego.' });
    }

    // Borrar reseña
    await review.deleteOne();

    // Quitar del array del juego
    res.game.reviews = res.game.reviews.filter(
      r => r.toString() !== req.params.reviewId
    );
    await res.game.save();

    res.json({ message: 'Reseña eliminada correctamente.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;