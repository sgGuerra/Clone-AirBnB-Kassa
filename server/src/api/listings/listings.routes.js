import { Router } from 'express'
import * as controller from './listings.controller.js'
import { authenticate } from '../../middleware/auth.js'
import { authorize } from '../../middleware/authorization.js'

const router = Router()

router.get('/', controller.getAllListings)
router.get('/:id', controller.getListingById)
router.post('/', authenticate, authorize('host'), controller.createListing)
router.delete('/:id', authenticate, authorize('host'), controller.deleteListing)

export default router
