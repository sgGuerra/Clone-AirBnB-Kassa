import prisma from '../../../prisma/client.js'

// Reglas de negocio simplificadas:
// - No se permiten solapes de fechas para la misma propiedad
// - Cancelación gratuita hasta 48h antes de la fecha de inicio

export const findByUser = (guestId) => {
  return prisma.booking.findMany({
    where: { guestId },
    include: { property: true },
    orderBy: { createdAt: 'desc' },
  })
}

export const createPending = async ({ propertyId, userId, startDate, endDate, guests }) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  if (end <= start) throw new Error('La fecha de fin debe ser posterior al inicio')

  // Verificar solape
  const overlap = await prisma.booking.findFirst({
    where: {
      propertyId,
      status: { in: ['pending_payment', 'confirmed'] },
      OR: [
        { startDate: { lte: end }, endDate: { gte: start } },
      ],
    },
  })
  if (overlap) throw new Error('Ya existe una reserva para esas fechas')

  // Calcular precio (dif días * pricePerNight)
  const property = await prisma.property.findUnique({ where: { id: propertyId } })
  if (!property) throw new Error('Propiedad no encontrada')
  const MS_PER_DAY = 1000 * 60 * 60 * 24
  const nights = Math.ceil((end - start) / MS_PER_DAY)
  const totalPrice = property.pricePerNight * nights

  return prisma.booking.create({
    data: {
      propertyId,
      guestId: userId,
      startDate: start,
      endDate: end,
      totalPrice,
      status: 'pending_payment',
    },
  })
}

export const cancel = async ({ bookingId, userId }) => {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } })
  if (!booking) throw new Error('Reserva no encontrada')
  if (booking.guestId !== userId) throw new Error('No autorizado')

  const now = new Date()
  const diffHours = (booking.startDate - now) / (1000 * 60 * 60)
  // Política: si faltan menos de 48h, no se puede cancelar
  if (diffHours < 48) throw new Error('No se puede cancelar con menos de 48h de anticipación')

  return prisma.booking.update({
    where: { id: bookingId },
    data: { status: 'cancelled' },
  })
}


