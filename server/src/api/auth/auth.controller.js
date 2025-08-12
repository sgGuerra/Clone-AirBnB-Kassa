import * as service from './auth.service.js'
import { signToken } from '../../utils/jwt.js'

export const register = async (req, res) => {
  const { email, name, password, role = 'guest' } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios' })
  }

  try {
    const user = await service.registerUser({ email, name, password, role })
    const token = signToken(user)
    const { password: _, ...userWithoutPassword } = user
    res.status(201).json({ user: userWithoutPassword, token })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios' })
  }

  try {
    const user = await service.loginUser({ email, password })
    const token = signToken(user)
    const { password: _, ...userWithoutPassword } = user
    res.json({ user: userWithoutPassword, token })
  } catch (error) {
    res.status(401).json({ error: error.message })
  }
}

export const getProfile = async (req, res) => {
  try {
    const userProfile = await service.findProfileById(req.user.userId)
    if (!userProfile) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }
    res.json(userProfile)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al cargar el perfil' })
  }
}

export const upgradeToHost = async (req, res) => {
  try {
    const updated = await service.setUserRole(req.user.userId, 'host')
    const token = signToken(updated)
    const { password: _, ...userWithoutPassword } = updated
    res.json({ user: userWithoutPassword, token })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}