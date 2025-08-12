import prisma from '../../../prisma/client.js'
import crypto from 'crypto'

export const createPaymentSession = async ({ bookingId, userId, method }) => {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } })
  if (!booking) throw new Error('Reserva no encontrada')
  if (booking.guestId !== userId) throw new Error('No autorizado')
  if (booking.status !== 'pending_payment') throw new Error('La reserva no está pendiente de pago')

  const sessionId = crypto.randomBytes(12).toString('hex')
  // Simula crear una sesión de pago con un estado temporal
  return {
    sessionId,
    amount: booking.totalPrice,
    currency: 'COP',
    method: method || 'fake-card',
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


