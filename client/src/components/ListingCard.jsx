import React from 'react';
import { Link } from 'react-router-dom';

const ListingCard = ({ listing }) => {
  // Placeholder for the like functionality
  const handleLike = (e) => {
    e.preventDefault(); // Prevent navigation when clicking the like button
    alert('Funcionalidad de "Me gusta" no implementada todavía.');
  };

  return (
    <Link to={`/listings/${listing.id}`} className="block group">
      <div className="relative rounded-xl overflow-hidden bg-gray-100 shadow-soft">
        <img
          src={listing.images?.[0] || 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop'}
          alt={listing.title}
          className="h-60 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />

        <button
          onClick={handleLike}
          className="absolute top-3 right-3 p-1.5 bg-white/80 backdrop-blur-md rounded-full shadow hover:bg-white"
          aria-label="Me gusta"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 016.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
          </svg>
        </button>
      </div>

      <div className="mt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-md font-semibold text-gray-900 truncate max-w-[75%]">
            {listing.location}
          </h3>
          <div className="text-sm text-gray-600">⭐ 4.8</div>
        </div>
        <p className="text-sm text-gray-500 truncate">{listing.title}</p>
        <p className="mt-1">
          <span className="font-bold text-gray-900">${listing.pricePerNight}</span>
          <span className="text-gray-600"> noche</span>
        </p>
      </div>
    </Link>
  );
};

export default ListingCard;
