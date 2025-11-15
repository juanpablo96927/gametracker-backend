const express = require('express');
const router = express.Router({ mergeParams: true }); 
const Review = require('../models/Review');

// 🛑 CORRECCIÓN 1: Importación directa de la función
const getGame = require('../middlewares/gameMiddleware'); 
const { protect } = require('../middlewares/authMiddleware'); 

// POST - Crear reseña (Ruta: /api/juegos/:gameId/reviews)
router.post('/', protect, getGame, async (req, res) => {
  try {
    // Validación de puntuación
    if (!req.body.puntuacion || req.body.puntuacion < 1 || req.body.puntuacion > 5) {
      return res.status(400).json({ 
        message: 'La puntuación es obligatoria y debe estar entre 1 y 5' 
      });
    }

    // Comprobamos si el usuario ya ha reseñado (usando req.user.id)
    const existingReview = await Review.findOne({ 
        game: res.game._id, 
        autor: req.user.id 
    });

    if (existingReview) {
      return res.status(400).json({ message: 'Ya has escrito una reseña para este juego.' });
    }

    // 🛑 CORRECCIÓN 2: Asignamos req.body.texto y usamos req.user.id
    const review = new Review({
      texto: req.body.texto,       
      autor: req.user.id,        
      game: res.game._id,        
      puntuacion: req.body.puntuacion
    });

    const newReview = await review.save();

    // Añadimos la ID de la nueva reseña al array 'reviews' del juego
    res.game.reviews.push(newReview._id);
    await res.game.save();

    // Devolvemos la reseña creada
    res.status(201).json(newReview);
  } catch (err) {
    // Si la autenticación falla o el ID de usuario no existe, esto capturará el error
    res.status(400).json({ message: err.message });
  }
});

// GET - Todas las reseñas de un juego
router.get('/', getGame, async (req, res) => {
  try {
    // Hacemos populate para obtener el nombre de usuario del autor
    const reviews = await Review.find({ game: res.game._id }).populate('autor', 'username'); 
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE - Eliminar reseña (Se mantiene la lógica de autorización)
router.delete('/:reviewId', protect, getGame, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId).populate('autor', 'id');

    if (!review) {
      return res.status(404).json({ message: 'Reseña no encontrada.' });
    }
    
    // VALIDACIÓN DE AUTOR: Solo el autor puede borrar
    if (review.autor._id.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar esta reseña.' });
    }
    
    // Validación de pertenencia al juego
    if (review.game.toString() !== res.game._id.toString()) {
      return res.status(404).json({ message: 'Reseña no encontrada en este juego.' });
    }

    // Usamos el método de Mongoose para activar el hook deleteOne
    await Review.deleteOne({ _id: req.params.reviewId });
    // Nota: El hook post('deleteOne') se encarga de actualizar la puntuación media.

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