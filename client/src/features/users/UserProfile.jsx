import { useState, useEffect } from 'react';
import ListingCard from '../../components/ListingCard'; // Re-use the card component

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
        <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
          {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{user.name || 'Usuario'}</h1>
          <p className="text-lg text-gray-500">{user.email}</p>
          <span className={`mt-2 inline-block px-3 py-1 rounded-full text-white text-sm font-semibold ${user.role === 'host' ? 'bg-green-600' : 'bg-blue-600'}`}>
            {user.role === 'host' ? 'Anfitrión' : 'Huésped'}
          </span>
        </div>
      </div>

      {/* Properties Section */}
      {user.role === 'host' && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-6">Mis Propiedades</h2>
          {user.properties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {user.properties.map(prop => (
                <ListingCard key={prop.id} listing={prop} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Aún no has publicado ninguna propiedad.</p>
          )}
        </div>
      )}

      {/* Bookings Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-6">Mis Reservas</h2>
        {user.bookings.length > 0 ? (
          <div className="space-y-6">
            {user.bookings.map(booking => (
              <div key={booking.id} className="flex flex-col md:flex-row gap-4 border rounded-lg p-4 shadow-sm bg-white">
                <img src={booking.property.images[0]} alt={booking.property.title} className="w-full md:w-48 h-32 object-cover rounded-md"/>
                <div className="flex-grow">
                  <p className="text-sm text-gray-500">{booking.property.location}</p>
                  <h3 className="text-lg font-semibold text-gray-800">{booking.property.title}</h3>
                  <p className="text-gray-700 mt-1">
                    <strong>Fechas:</strong> {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700"><strong>Total:</strong> ${booking.totalPrice.toFixed(2)}</p>
                </div>
                <div className="flex-shrink-0">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {booking.status === 'confirmed' ? 'Confirmada' : 'Cancelada'}
                  </span>
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
