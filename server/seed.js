// server/seed.js
import prisma from './prisma/client.js'

async function main() {
  // Elimina datos anteriores (opcional)
  await prisma.property.deleteMany()
  await prisma.user.deleteMany()

  // Crea un usuario de prueba
  const user = await prisma.user.create({
    data: {
      email: 'host@example.com',
      name: 'Ana García',
      password: '123456', // en producción: hashear
      role: 'host',
    },
  })

  // Crea una propiedad de ejemplo
  await prisma.property.create({
    data: {
      title: 'Departamento acogedor en el centro',
      description: 'Hermoso departamento a 5 minutos de la plaza principal.',
      location: 'Ciudad de México',
      pricePerNight: 80,
      images: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
        'https://images.unsplash.com/photo-1493859209628-456871df284d'
      ],
      userId: user.id,
    },
  })

  console.log('✅ Datos de prueba creados')
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())