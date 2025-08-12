import { Router } from 'express'
import * as controller from './payments.controller.js'
import { authenticate } from '../../middleware/auth.js'

const router = Router()

// Iniciar pago ficticio
router.post('/init', authenticate, controller.initPayment)
// Confirmar pago ficticio
router.post('/confirm', authenticate, controller.confirmPayment)

export default router


