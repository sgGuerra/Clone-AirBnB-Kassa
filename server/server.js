// server/server.js
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import prisma from './prisma/client.js' // Importing the Prisma client

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ message: 'Backend funcionando correctamente ✅' })
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})

// Ruta: GET /api/properties
app.get('/api/properties', async (req, res) => {
  try {
    const properties = await prisma.property.findMany({
      include: {
        user: true, // incluye datos del dueño (opcional)
      },
    })
    res.json(properties)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al cargar las propiedades' })
  }
})

// server/server.js

app.post('/api/properties', async (req, res) => {
  const { title, description, location, pricePerNight, images } = req.body

  // Validación básica
  if (!title || !description || !location || !pricePerNight) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' })
  }

  try {
    // Asumimos un usuario temporal con id = 1 (luego haremos autenticación)
    const property = await prisma.property.create({
      data: {
        title,
        description,
        location,
        pricePerNight: parseFloat(pricePerNight),
        images: images || [], // puede ser un array vacío
        userId: 1, // temporal: luego lo tomaremos del token JWT
      },
    })

    res.status(201).json(property)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al crear la propiedad' })
  }
})