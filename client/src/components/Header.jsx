import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserCircleIcon } from '@heroicons/react/outline'; // Using heroicons for icons

const Header = ({ searchTerm, setSearchTerm }) => {
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/home.svg" alt="Kassa Logo" className="h-8 w-auto text-red-500" />
            <span className="text-2xl font-bold text-red-500 hidden md:block">Kassa</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex-1 mx-8 hidden sm:flex justify-center">
          <div className="w-full max-w-md relative">
            <input
              type="text"
              placeholder="Buscar por ubicación..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded-full shadow-sm focus:ring-red-500 focus:border-red-500 transition"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full p-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* User Menu */}
        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-gray-900 font-medium">Inicio</Link>
            {isAuthenticated && user?.role === 'host' && (
              <Link to="/my-listings" className="text-gray-600 hover:text-gray-900 font-medium">Mis Propiedades</Link>
            )}
          </nav>

          <div className="relative">
            <button className="flex items-center space-x-2 border rounded-full p-2 hover:shadow-md transition">
              <UserCircleIcon className="h-6 w-6 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">{isAuthenticated ? user.name || user.email.split('@')[0] : 'Menu'}</span>
            </button>
            {/* Dropdown placeholder */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
