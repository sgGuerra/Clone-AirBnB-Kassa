import { useState, useEffect } from 'react'

export default function UserProfile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('authToken')
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch('http://localhost:5000/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        } else {
          console.error('Error al cargar perfil')
        }
      } catch (err) {
        console.error('Error de conexión:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (loading) return <p className="text-center text-gray-600">Cargando perfil...</p>
  if (!user) return <p className="text-center text-red-500">Debes iniciar sesión para ver tu perfil</p>

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md mt-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Mi Perfil</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700">Información Personal</h2>
        <p><strong>Nombre:</strong> {user.name || 'No especificado'}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Rol:</strong> <span className={`px-2 py-1 rounded text-white text-sm ${user.role === 'host' ? 'bg-green-600' : 'bg-blue-600'}`}>
          {user.role === 'host' ? 'Anfitrión' : 'Huésped'}
        </span></p>
      </div>

      {/* Propiedades publicadas */}
      {user.properties.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Mis Propiedades</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {user.properties.map(prop => (
              <div key={prop.id} className="border rounded-lg overflow-hidden shadow-sm">
                <img src={prop.images[0]} alt={prop.title} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800">{prop.title}</h3>
                  <p className="text-gray-600">{prop.location}</p>
                  <p className="text-indigo-600 font-bold">${prop.pricePerNight} / noche</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reservas */}
      {user.bookings.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Mis Reservas</h2>
          <div className="space-y-4">
            {user.bookings.map(booking => (
              <div key={booking.id} className="border rounded-lg p-4 bg-gray-50">
                <h3 className="font-semibold text-gray-800">{booking.property.title}</h3>
                <p className="text-gray-600">{booking.property.location}</p>
                <p><strong>Fechas:</strong> {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}</p>
                <p><strong>Total:</strong> ${booking.totalPrice}</p>
                <span className={`mt-2 inline-block px-2 py-1 text-xs rounded ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {booking.status === 'confirmed' ? 'Confirmada' : 'Cancelada'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {user.properties.length === 0 && user.bookings.length === 0 && (
        <p className="text-gray-500">No tienes propiedades ni reservas aún.</p>
      )}
    </div>
  )
}
