import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import ListingCard from '../components/ListingCard';
import CreateListingForm from '../features/listings/CreateListingForm';

const HomePage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // Use the hook

  useEffect(() => {
    // Fetch listings
    const fetchListings = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/listings'); // Corrected endpoint
        const data = await response.json();
        setListings(data);
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  return (
    <div>
      {/* Formulario de publicación (solo si el usuario es 'host') */}
      {user && user.role === 'host' && (
        <div className="max-w-2xl mx-auto mb-8">
          <CreateListingForm />
        </div>
      )}

      {/* Listado de propiedades */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Alojamientos disponibles
      </h2>
      {loading ? (
        <p className="text-center text-gray-600 col-span-full py-8">
          🕵️‍♂️ Cargando alojamientos...
        </p>
      ) : listings.length === 0 ? (
        <p className="text-center text-gray-500 col-span-full py-8">
          Aún no hay propiedades publicadas.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
