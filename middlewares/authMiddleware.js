const jwt = require('jsonwebtoken');
const User = require('../models/User')

//Middleware de proteccion de rutas
// Se verificara la existencia de JWT

const protect = async (req, res, next) => {
    let token;
        // 1. Verificar si el token está presente en los headers
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // 2. Verificar el token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Obtener el usuario del token y adjuntarcla solicitud
            req.user = await User.findById(decoded.id).select('-password');
            
            // El usuario es correcto=> Se continua con el proceso
            next();

        } catch (error) {
            console.error(error);
            // Verificacion fallida= Token expirado o inválido
            res.status(401).json({ message: 'No autorizado, token fallido o expirado.' });
        }
    }

    // 4. La solicitud no incluye un token
    if (!token) {
        res.status(401).json({ message: 'No autorizado, no hay token.' });
    }
};

module.exports = { protect };

