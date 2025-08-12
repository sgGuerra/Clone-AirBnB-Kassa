import * as service from './listings.service.js'

export const getAllListings = async (req, res) => {
  try {
    const listings = await service.findAll()
    res.json(listings)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al cargar las propiedades' })
  }
}

export const getListingById = async (req, res) => {
  const { id } = req.params
  try {
    const listing = await service.findById(Number(id))
    if (!listing) {
      return res.status(404).json({ error: 'Propiedad no encontrada' })
    }
    res.json(listing)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al cargar la propiedad' })
  }
}

export const createListing = async (req, res) => {
  const { title, description, location, pricePerNight, images } = req.body
  const { userId } = req.user

  if (!title || !description || !location || !pricePerNight) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' })
  }

  try {
    const listingData = {
      title,
      description,
      location,
      pricePerNight: parseFloat(pricePerNight),
      images: images || [],
      userId,
    }
    const newListing = await service.create(listingData)
    res.status(201).json(newListing)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al crear la propiedad' })
  }
}
