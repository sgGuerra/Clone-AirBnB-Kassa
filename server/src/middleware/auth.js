// server/middleware/auth.js
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

export const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1] // "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. No hay token.' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded // Guarda el usuario en la solicitud
    next()
  } catch (error) {
    res.status(403).json({ error: 'Token inválido o expirado' })
  }
}