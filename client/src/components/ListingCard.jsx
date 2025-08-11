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
      <div className="relative">
        {/* Image */}
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
          <img
            src={listing.images[0] || 'https://via.placeholder.com/400'}
            alt={listing.title}
            className="w-full h-full object-cover object-center group-hover:opacity-90 transition"
          />
        </div>

        {/* Like Button */}
        <button
          onClick={handleLike}
          className="absolute top-3 right-3 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 016.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
          </svg>
        </button>
      </div>

      {/* Info */}
      <div className="mt-2">
        <h3 className="text-md font-semibold text-gray-800 truncate">
          {listing.location}
        </h3>
        <p className="text-sm text-gray-500 truncate">{listing.title}</p>
        <p className="mt-1">
          <span className="font-bold text-gray-800">${listing.pricePerNight}</span>
          <span className="text-gray-600"> / noche</span>
        </p>
      </div>
    </Link>
  );
};

export default ListingCard;
