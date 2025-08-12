import * as service from './bookings.service.js'

export const createBooking = async (req, res) => {
  const { propertyId, startDate, endDate, guests } = req.body
  const userId = req.user.userId
  if (!propertyId || !startDate || !endDate) {
    return res.status(400).json({ error: 'propertyId, startDate y endDate son obligatorios' })
  }
  try {
    const booking = await service.createPending({ propertyId, userId, startDate, endDate, guests })
    res.status(201).json(booking)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
}

export const cancelBooking = async (req, res) => {
  const { id } = req.params
  const userId = req.user.userId
  try {
    const updated = await service.cancel({ bookingId: Number(id), userId })
    res.json(updated)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
}

export const getMyBookings = async (req, res) => {
  try {
    const list = await service.findByUser(req.user.userId)
    res.json(list)
  } catch (e) {
    res.status(500).json({ error: 'No se pudieron cargar las reservas' })
  }
}


