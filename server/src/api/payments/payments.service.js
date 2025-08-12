import prisma from '../../../prisma/client.js'
import crypto from 'crypto'

// Eliminado Luhn: solo se valida longitud

const validateExpiry = (mmYY) => {
  const match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(mmYY)
  if (!match) return false
  const month = parseInt(match[1], 10)
  const yearTwo = parseInt(match[2], 10)
  const now = new Date()
  const currentYearTwo = now.getFullYear() % 100
  const currentMonth = now.getMonth() + 1
  if (yearTwo < currentYearTwo) return false
  if (yearTwo === currentYearTwo && month < currentMonth) return false
  return true
}

const validateCvc = (cvc) => /^[0-9]{3,4}$/.test(String(cvc))

export const createPaymentSession = async ({ bookingId, userId, method, card }) => {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } })
  if (!booking) throw new Error('Reserva no encontrada')
  if (booking.guestId !== userId) throw new Error('No autorizado')
  if (booking.status !== 'pending_payment') throw new Error('La reserva no está pendiente de pago')

  const sessionId = crypto.randomBytes(12).toString('hex')
  // Validación simple de tarjeta si method es card
  if (method === 'card') {
    const { number, exp, cvc } = card || {}
    if (!number || !exp || !cvc) throw new Error('Datos de tarjeta incompletos')
    const sanitized = String(number).replace(/\D/g, '')
    if (sanitized.length < 12 || sanitized.length > 19) throw new Error('Número de tarjeta inválido')
    if (!validateExpiry(exp)) throw new Error('Fecha de expiración inválida')
    if (!validateCvc(cvc)) throw new Error('CVC inválido')
  }
  // Simula crear una sesión de pago con un estado temporal
  return {
    sessionId,
    amount: booking.totalPrice,
    currency: 'COP',
    method: method || 'card',
    bookingId: booking.id,
    // En real, aquí iría la URL del checkout; simulamos pantalla propia
  }
}

export const finalizePayment = async ({ sessionId, userId, success }) => {
  // En la pasarela ficticia solo validamos el flag de éxito
  if (!sessionId) throw new Error('Sesión inválida')

  const booking = await prisma.booking.findFirst({
    where: { guestId: userId, status: 'pending_payment' },
    orderBy: { createdAt: 'desc' },
  })
  if (!booking) throw new Error('No hay reserva pendiente de pago')

  if (success) {
    await prisma.booking.update({ where: { id: booking.id }, data: { status: 'confirmed' } })
    return { ok: true, message: 'Pago exitoso. Reserva confirmada', bookingId: booking.id }
  }
  // Pago fallido → mantenemos reserva en pending_payment para reintento
  return { ok: false, message: 'Pago rechazado. Intenta nuevamente', bookingId: booking.id }
}


