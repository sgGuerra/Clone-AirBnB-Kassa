import * as service from './payments.service.js'

export const initPayment = async (req, res) => {
  const { bookingId, method, card } = req.body
  const userId = req.user.userId
  if (!bookingId) return res.status(400).json({ error: 'bookingId es requerido' })
  try {
    const session = await service.createPaymentSession({ bookingId, userId, method, card })
    res.status(201).json(session)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
}

export const confirmPayment = async (req, res) => {
  const { sessionId, success } = req.body
  const userId = req.user.userId
  if (!sessionId) return res.status(400).json({ error: 'sessionId es requerido' })
  try {
    const result = await service.finalizePayment({ sessionId, userId, success })
    res.json(result)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
}


