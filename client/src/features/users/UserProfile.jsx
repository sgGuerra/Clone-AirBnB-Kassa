import { useState, useEffect } from 'react';
import ListingCard from '../../components/ListingCard'; // Re-use the card component
import CreateListingForm from '../listings/CreateListingForm.jsx'

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setLoading(false);
        setError("No estás autenticado.");
        return;
      }

      try {
        const response = await fetch('/api/auth/profile', { // Use relative path
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          setError('Error al cargar el perfil. Por favor, inicia sesión de nuevo.');
        }
      } catch (err) {
        setError('Error de conexión. Inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p className="text-center py-10 text-gray-600">Cargando perfil...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;
  if (!user) return <p className="text-center py-10 text-gray-500">No se pudo cargar la información del usuario.</p>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
        <div className="w-24 h-24 bg-kassa-primary rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-soft">
          {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{user.name || 'Usuario'}</h1>
          <p className="text-lg text-gray-500">{user.email}</p>
          <span className={`mt-2 inline-block px-3 py-1 rounded-full text-white text-sm font-semibold ${user.role === 'host' ? 'bg-green-600' : 'bg-blue-600'}`}>
            {user.role === 'host' ? 'Anfitrión' : 'Huésped'}
          </span>
          {user.role !== 'host' && (
            <button
              className="ml-3 mt-2 text-sm border rounded px-3 py-1 hover:bg-gray-50"
              onClick={async () => {
                try {
                  const token = localStorage.getItem('authToken')
                  const res = await fetch('/api/auth/upgrade-to-host', {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` },
                  })
                  const data = await res.json()
                  if (!res.ok) throw new Error(data.error || 'No se pudo actualizar el rol')
                  if (data.token && data.user) {
                    localStorage.setItem('authToken', data.token)
                    localStorage.setItem('user', JSON.stringify(data.user))
                  }
                  // Refrescar perfil
                  window.location.reload()
                } catch (e) {
                  alert(e.message)
                }
              }}
            >
              Convertirme en anfitrión
            </button>
          )}
        </div>
      </div>

      {/* Properties Section */}
      {user.role === 'host' && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 border-b border-white/60 pb-3 mb-6">Mis Propiedades</h2>
          {user.properties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {user.properties.map(prop => (
                <div key={prop.id} className="relative">
                  <ListingCard listing={prop} />
                  <button
                    className="absolute top-2 left-2 bg-white/90 border rounded px-2 py-1 text-xs hover:bg-white"
                    onClick={async (e) => {
                      e.preventDefault()
                      if (!confirm('¿Eliminar esta propiedad?')) return
                      try {
                        const token = localStorage.getItem('authToken')
                        const res = await fetch(`/api/listings/${prop.id}`, {
                          method: 'DELETE',
                          headers: { Authorization: `Bearer ${token}` },
                        })
                        const data = await res.json()
                        if (!res.ok) throw new Error(data.error || 'No se pudo eliminar')
                        window.location.reload()
                      } catch (err) {
                        alert(err.message)
                      }
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Aún no has publicado ninguna propiedad.</p>
          )}
          <CreateListingForm />
        </div>
      )}

      {/* Bookings Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 border-b border-white/60 pb-3 mb-6">Mis Reservas</h2>
        {user.bookings.length > 0 ? (
          <div className="space-y-6">
            {user.bookings.map(booking => (
              <div key={booking.id} className="flex flex-col md:flex-row gap-4 border border-white/50 rounded-xl p-4 shadow-soft bg-white/70 backdrop-blur-md">
                <img src={booking.property.images[0]} alt={booking.property.title} className="w-full md:w-48 h-32 object-cover rounded-md"/>
                <div className="flex-grow">
                  <p className="text-sm text-gray-500">{booking.property.location}</p>
                  <h3 className="text-lg font-semibold text-gray-800">{booking.property.title}</h3>
                  <p className="text-gray-700 mt-1">
                    <strong>Fechas:</strong> {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700"><strong>Total:</strong> {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(booking.totalPrice)}</p>
                </div>
                <div className="flex-shrink-0 flex items-center gap-2">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : booking.status === 'pending_payment' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                    {booking.status === 'confirmed' ? 'Confirmada' : booking.status === 'pending_payment' ? 'Pendiente de pago' : 'Cancelada'}
                  </span>
                  {(booking.status === 'confirmed' || booking.status === 'pending_payment') && (
                    <button
                      className="text-sm border rounded px-3 py-1 hover:bg-gray-50"
                      onClick={async () => {
                        try {
                          const token = localStorage.getItem('authToken')
                          const res = await fetch(`/api/bookings/${booking.id}/cancel`, {
                            method: 'PATCH',
                            headers: { Authorization: `Bearer ${token}` },
                          })
                          const data = await res.json()
                          if (!res.ok) throw new Error(data.error || 'No se pudo cancelar')
                          window.location.reload()
                        } catch (e) {
                          alert(e.message)
                        }
                      }}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No tienes ninguna reserva.</p>
        )}
      </div>
    </div>
  );
}
