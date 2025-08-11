export const authorize = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== requiredRole) {
      return res.status(403).json({ error: 'Acceso prohibido. No tienes el rol requerido.' });
    }
    next();
  };
};
