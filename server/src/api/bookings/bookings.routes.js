import { Router } from 'express'
import * as controller from './bookings.controller.js'
import { authenticate } from '../../middleware/auth.js'

const router = Router()

// Crear una reserva (estado inicial: pending_payment)
router.post('/', authenticate, controller.createBooking)

// Cancelar una reserva (si la política lo permite)
router.patch('/:id/cancel', authenticate, controller.cancelBooking)

// Obtener reservas del usuario autenticado
router.get('/me', authenticate, controller.getMyBookings)

export default router


