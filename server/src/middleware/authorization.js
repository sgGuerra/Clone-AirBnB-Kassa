import prisma from '../../prisma/client.js'

export const authorize = (requiredRole) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({ error: 'Acceso prohibido. No tienes el rol requerido.' })
    }
    if (req.user.role === requiredRole) {
      return next()
    }
    // Fallback: verificar rol actual en BD por si el token está desactualizado
    try {
      const dbUser = await prisma.user.findUnique({ where: { id: req.user.userId }, select: { role: true } })
      if (dbUser && dbUser.role === requiredRole) {
        return next()
      }
    } catch (e) {
      return res.status(500).json({ error: 'No se pudo validar el rol de usuario' })
    }
    return res.status(403).json({ error: 'Acceso prohibido. No tienes el rol requerido.' })
  }
}
