import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ListingDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    const fetchListingDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/listings/${id}`, { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('Property not found');
        }
        const data = await response.json();
        setListing(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListingDetails();
  }, [id]);

  if (loading) {
    return <div className="text-center py-10">Cargando detalles del alojamiento...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  if (!listing) {
    return <div className="text-center py-10">No se encontró el alojamiento.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold">{listing.title}</h1>
        <p className="text-md text-gray-600 underline mt-1">{listing.location}</p>
      </div>

      {/* Image Gallery */}
      <div className="grid grid-cols-2 gap-2 mb-8">
        <div className="col-span-2">
            <img src={listing.images[0] || 'https://via.placeholder.com/800x600'} alt={listing.title} className="w-full h-auto object-cover rounded-lg"/>
        </div>
        {/* Placeholder for more images */}
      </div>

      {/* Listing Info & Booking */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold border-b pb-2">Descripción</h2>
          <p className="mt-4 text-gray-700 whitespace-pre-wrap">{listing.description}</p>
        </div>

        {/* Booking Widget */}
        <div className="md:col-span-1">
          <div className="sticky top-24 p-6 border rounded-xl shadow-lg">
            <p className="text-2xl font-bold">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(listing.pricePerNight)} <span className="font-normal text-lg">/ noche</span></p>
            <div className="mt-4 border rounded-lg p-2 space-y-2">
              <div>
                <label className="text-sm text-gray-600">Entrada</label>
                <input type="date" className="w-full border rounded px-2 py-1" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-gray-600">Salida</label>
                <input type="date" className="w-full border rounded px-2 py-1" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-gray-600">Huéspedes</label>
                <input type="number" min={1} className="w-full border rounded px-2 py-1" value={guests} onChange={(e) => setGuests(Number(e.target.value))} />
              </div>
            </div>
            <button
              className="mt-4 w-full bg-kassa-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-kassa-primaryDark transition"
              onClick={async () => {
                try {
                  if (!token) {
                    navigate('/login')
                    return
                  }
                  const res = await fetch('/api/bookings', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ propertyId: Number(id), startDate, endDate, guests }),
                  })
                  const data = await res.json()
                  if (!res.ok) throw new Error(data.error || 'No se pudo crear la reserva')
                  navigate(`/checkout/${data.id}`)
                } catch (e) {
                  alert(e.message)
                }
              }}
            >
              Reservar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailsPage;
