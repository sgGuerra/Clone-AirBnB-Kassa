import prisma from '../../../prisma/client.js'

export const findAll = () => {
  return prisma.property.findMany({
    include: {
      user: true,
    },
  })
}

export const create = (listingData) => {
  return prisma.property.create({
    data: listingData,
  })
}
