import prisma from '../../../prisma/client.js'
import bcrypt from 'bcryptjs'

export const registerUser = async (userData) => {
  const { email, name, password, role } = userData

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    throw new Error('El email ya está registrado')
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  return prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      role,
    },
  })
}

export const loginUser = async (credentials) => {
  const { email, password } = credentials

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    throw new Error('Credenciales inválidas')
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    throw new Error('Credenciales inválidas')
  }

  return user
}

export const findProfileById = (userId) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      properties: {
        select: {
          id: true,
          title: true,
          location: true,
          pricePerNight: true,
          images: true,
        },
      },
      bookings: {
        include: {
          property: {
            select: {
              title: true,
              location: true,
              images: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })
}

export const setUserRole = async (userId, role) => {
  if (!['guest', 'host'].includes(role)) {
    throw new Error('Rol inválido')
  }
  return prisma.user.update({
    where: { id: userId },
    data: { role },
  })
}