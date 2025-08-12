import { useState, useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import ListingCard from '../components/ListingCard';

const HomePage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { searchTerm, selectedCategory } = useOutletContext();
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [city, setCity] = useState('')

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch('/api/listings', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setListings(data);
      } catch (error) {
        console.error("Error fetching listings:", error);
        setError("No se pudieron cargar los alojamientos. Por favor, intente de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const filteredListings = useMemo(() => {
    let result = listings;
    if (searchTerm) {
      result = result.filter((listing) =>
        [listing.location, listing.title]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    if (selectedCategory) {
      // Heurística: derivar categoría desde el título o ubicación
      const mapCategory = (l) => {
        const title = `${l.title} ${l.location}`.toLowerCase();
        if (title.includes('playa')) return 'playa';
        if (title.includes('centro')) return 'centro';
        if (title.includes('departamento') || title.includes('apto') || title.includes('apartamento')) return 'departamento';
        if (title.includes('casa') || title.includes('chalet')) return 'casa';
        return 'populares';
      };
      result = result.filter((l) => mapCategory(l) === selectedCategory);
    }
    if (city) {
      result = result.filter((l) => l.location?.toLowerCase().includes(city.toLowerCase()))
    }
    if (minPrice) {
      result = result.filter((l) => l.pricePerNight >= Number(minPrice))
    }
    if (maxPrice) {
      result = result.filter((l) => l.pricePerNight <= Number(maxPrice))
    }
    return result;
  }, [listings, searchTerm, selectedCategory, city, minPrice, maxPrice]);

  // Debe estar antes de cualquier return condicional para no romper las reglas de hooks
  const cities = useMemo(
    () => Array.from(new Set(listings.map(l => l.location?.split(',')[0]?.trim()).filter(Boolean))),
    [listings]
  )

  if (loading) {
    return <div className="text-center py-10">🕵️‍♂️ Cargando alojamientos...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div>
      <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <select className="border rounded px-3 py-2" value={city} onChange={(e) => setCity(e.target.value)}>
          <option value="">Todas las ciudades</option>
          {cities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input className="border rounded px-3 py-2" type="number" placeholder="Precio mínimo (COP)" value={minPrice} onChange={(e)=>setMinPrice(e.target.value)} />
        <input className="border rounded px-3 py-2" type="number" placeholder="Precio máximo (COP)" value={maxPrice} onChange={(e)=>setMaxPrice(e.target.value)} />
      </div>
      {filteredListings.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold text-gray-900">No se encontraron alojamientos</h2>
          <p className="text-gray-500 mt-2">Intenta con otra ubicación o borra la búsqueda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-8">
          {filteredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
