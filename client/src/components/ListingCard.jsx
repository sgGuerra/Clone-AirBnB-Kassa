import React from 'react';

const ListingCard = ({ listing }) => {
  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden transition transform hover:scale-105"
    >
      <img
        src={listing.images[0] || 'https://via.placeholder.com/300x200'}
        alt={listing.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 truncate">
          {listing.title}
        </h3>
        <p className="text-gray-600">{listing.location}</p>
        <p className="text-lg font-bold text-indigo-600 mt-2">
          ${listing.pricePerNight} / noche
        </p>
      </div>
    </div>
  );
};

export default ListingCard;
