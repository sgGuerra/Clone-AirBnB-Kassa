// server/server.js
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from './prisma/client.js'
import { authenticate } from './middleware/auth.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const JWT_SECRET = process.env.JWT_SECRET

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ message: 'Backend funcionando correctamente ✅' })
})

// Ruta: GET /api/properties
app.get('/api/properties', async (req, res) => {
  try {
    const properties = await prisma.property.findMany({
      include: {
        user: true,
      },
    })
    res.json(properties)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al cargar las propiedades' })
  }
})

// Ruta protegida: POST /api/properties
app.post('/api/properties', authenticate, async (req, res) => {
  console.log('Usuario autenticado:', req.user)
  const { title, description, location, pricePerNight, images } = req.body

  if (!title || !description || !location || !pricePerNight) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' })
  }

  try {
    const property = await prisma.property.create({
      data: {
        title,
        description,
        location,
        pricePerNight: parseFloat(pricePerNight),
        images: images || [],
        userId: req.user.userId,
      },
    })
    res.status(201).json(property)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al crear la propiedad' })
  }
})

// RUTA: POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  const { email, name, password, role = 'guest' } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios' })
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role,
      },
    })

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    const { password: _, ...userWithoutPassword } = user
    res.status(201).json({ user: userWithoutPassword, token })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error en el registro' })
  }
})

// RUTA: POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios' })
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    const { password: _, ...userWithoutPassword } = user
    res.json({ user: userWithoutPassword, token })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error en el inicio de sesión' })
  }
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})

// RUTA: GET /api/auth/profile
app.get('/api/auth/profile', authenticate, async (req, res) => {
  try {
    // Obtener usuario con sus propiedades y reservas
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
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

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    res.json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al cargar el perfil' })
  }
})