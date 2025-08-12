import prisma from '../../../prisma/client.js'

export const findAll = () => {
  return prisma.property.findMany({
    include: {
      user: true,
    },
  })
}

export const findById = (id) => {
  return prisma.property.findUnique({
    where: { id },
  })
}

export const create = (listingData) => {
  return prisma.property.create({
    data: listingData,
  })
}

export const remove = (id) => {
  return prisma.property.delete({
    where: { id },
  })
}