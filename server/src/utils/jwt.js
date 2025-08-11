import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

export function signToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}
