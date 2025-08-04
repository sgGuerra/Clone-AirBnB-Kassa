import { useEffect, useState } from 'react'

function App() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:5000/api/properties')
      .then(res => res.json())
      .then(data => {
        setProperties(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  if (loading) return <p className="text-white">Cargando alojamientos...</p>

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Airbnb Clone
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map(prop => (
          <div key={prop.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src={prop.images[0]} alt={prop.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800">{prop.title}</h2>
              <p className="text-gray-600">{prop.location}</p>
              <p className="text-lg font-bold text-indigo-600">${prop.pricePerNight} / noche</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App