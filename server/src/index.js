// src/index.js
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// Evitar respuestas 304 en API (caché) para que fetch trate la respuesta como válida
app.set('etag', false)
app.use((req, res, next) => {
  // No almacenar en caché respuestas de la API
  res.set('Cache-Control', 'no-store')
  next()
})

app.get('/api/health', (req, res) => {
  res.json({ message: 'Backend funcionando correctamente ✅' })
})

import listingsRouter from './api/listings/listings.routes.js'
import authRouter from './api/auth/auth.routes.js'
import bookingsRouter from './api/bookings/bookings.routes.js'
import paymentsRouter from './api/payments/payments.routes.js'

// ...

// Aquí importaremos y usaremos las rutas modulares
app.use('/api/listings', listingsRouter)
app.use('/api/auth', authRouter)
app.use('/api/bookings', bookingsRouter)
app.use('/api/payments', paymentsRouter)


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
