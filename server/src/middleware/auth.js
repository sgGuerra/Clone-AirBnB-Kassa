// server/middleware/auth.js
import jwt from 'jsonwebtoken'

export const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1] // "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. No hay token.' })
  }

  try {
    const secret = process.env.JWT_SECRET
    if (!secret) {
      return res.status(500).json({ error: 'Configuración inválida del servidor (JWT_SECRET faltante)' })
    }
    const decoded = jwt.verify(token, secret)
    req.user = decoded // Guarda el usuario en la solicitud
    next()
  } catch (error) {
    res.status(403).json({ error: 'Token inválido o expirado' })
  }
}