import { Router } from 'express'
import * as controller from './auth.controller.js'
import { authenticate } from '../../middleware/auth.js'

const router = Router()

router.post('/register', controller.register)
router.post('/login', controller.login)
router.get('/profile', authenticate, controller.getProfile)
router.post('/upgrade-to-host', authenticate, controller.upgradeToHost)

export default router
