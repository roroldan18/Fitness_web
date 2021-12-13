import rateLimit from 'express-rate-limit';

//Limitaciones al servidor
export const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 Hora
    max: 100, // Limite de peticiones
    message: "Demasiadas peticiones desde el IP, probá mas tarde"
  });

export const limiterLogin = rateLimit({
    windowMs: 60 * 60 * 1000 * 24, // 1 Hora
    max: 5, // Limite de peticiones
    message: "Demasiados intentos fallidos"
  });