// src/index.js
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ message: 'Backend funcionando correctamente ✅' })
})

import listingsRouter from './api/listings/listings.routes.js'
import authRouter from './api/auth/auth.routes.js'

// ...

// Aquí importaremos y usaremos las rutas modulares
app.use('/api/listings', listingsRouter)
app.use('/api/auth', authRouter)


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
