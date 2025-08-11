// client/src/features/listings/CreateListingForm.jsx
import { useState } from 'react'

export default function CreateListingForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    pricePerNight: '',
    images: '',
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    // Convertir imágenes (ingresadas como texto separado por comas) a array
    const imagesArray = formData.images
      ? formData.images.split(',').map(url => url.trim()).filter(url => url)
      : []

    const bodyData = {
      ...formData,
      pricePerNight: parseFloat(formData.pricePerNight),
      images: imagesArray,
    }

    try {
      const response = await fetch('http://localhost:5000/api/listings', { // <-- Endpoint corregido
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(bodyData),
      })

      const result = await response.json()

      if (response.ok) {
        setMessage('✅ Propiedad publicada con éxito')
        setFormData({
          title: '',
          description: '',
          location: '',
          pricePerNight: '',
          images: '',
        })
      } else {
        setMessage(`Error: ${result.error}`)
      }
    } catch (err) {
      setMessage('Error de conexión con el servidor')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Publicar una propiedad</h2>

      {message && (
        <div className={`p-3 mb-6 rounded text-white ${message.includes('Error') ? 'bg-red-500' : 'bg-green-500'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label className="block text-gray-700 mb-2">Título *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Ej. Departamento moderno en el centro"
            required
          />
        </div>

        <div className="mb-5">
          <label className="block text-gray-700 mb-2">Descripción *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows="4"
            placeholder="Describe tu alojamiento..."
            required
          />
        </div>

        <div className="mb-5">
          <label className="block text-gray-700 mb-2">Ubicación *</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Ej. Ciudad de México, Buenos Aires, Madrid"
            required
          />
        </div>

        <div className="mb-5">
          <label className="block text-gray-700 mb-2">Precio por noche (USD) *</label>
          <input
            type="number"
            name="pricePerNight"
            value={formData.pricePerNight}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="80"
            step="0.01"
            required
          />
        </div>

        <div className="mb-5">
          <label className="block text-gray-700 mb-2">
            Imágenes (URLs separadas por comas)
          </label>
          <input
            type="text"
            name="images"
            value={formData.images}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700 disabled:bg-indigo-400 transition"
        >
          {loading ? 'Publicando...' : 'Publicar Propiedad'}
        </button>
      </form>
    </div>
  )
}
