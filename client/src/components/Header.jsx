import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserCircleIcon, SearchIcon } from '@heroicons/react/outline';

const Header = ({ searchTerm, setSearchTerm }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const onClickAway = (e) => {
      if (!menuRef.current) return
      if (!menuRef.current.contains(e.target)) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener('click', onClickAway)
    return () => document.removeEventListener('click', onClickAway)
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md supports-[backdrop-filter]:bg-white/50 border-b border-white/40">
      <div className="container mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link to="/" className="flex items-center gap-2">
            <img src="/home.svg" alt="Kassa Logo" className="h-8 w-auto" />
            <span className="text-2xl font-bold text-gray-900 hidden md:block">Kassa</span>
          </Link>
        </div>

        {/* Search pill */}
        <div className="flex-1 flex justify-center">
          <div className="hidden sm:flex items-center divide-x divide-white/40 bg-white/70 backdrop-blur-md shadow-lg border border-white/50 rounded-full pl-5 transition hover:bg-white/80">
            <input
              type="text"
              placeholder="¿A dónde?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-2 py-2 outline-none text-sm placeholder:text-gray-500 bg-transparent"
            />
            <button className="flex items-center gap-2 pl-4 pr-2 py-2">
              <span className="text-sm text-gray-600">Cualquier semana · Cualquier huésped</span>
              <span className="ml-2 inline-flex items-center justify-center rounded-full bg-rose-500 hover:bg-rose-600 text-white p-2 transition">
                <SearchIcon className="h-4 w-4" />
              </span>
            </button>
          </div>
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-4">
            <Link to="/" className="text-gray-700 hover:text-gray-900 font-medium">Inicio</Link>
            {isAuthenticated && user?.role === 'host' && (
              <Link to="/profile" className="text-gray-700 hover:text-gray-900 font-medium">Mis Propiedades</Link>
            )}
          </nav>

          <div className="relative" ref={menuRef}>
            <button
              aria-haspopup="menu"
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((v) => !v)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setIsMenuOpen(false)
              }}
              className="flex items-center gap-2 border border-white/50 bg-white/60 backdrop-blur-md rounded-full py-2 pl-3 pr-4 hover:shadow-lg transition"
            >
              <UserCircleIcon className="h-6 w-6 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">{isAuthenticated ? (user.name || user.email.split('@')[0]) : 'Menú'}</span>
            </button>
            {isMenuOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-56 rounded-xl border border-white/60 bg-white/80 backdrop-blur-md shadow-lg overflow-hidden z-50"
              >
                {isAuthenticated ? (
                  <div className="py-1">
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => {
                        setIsMenuOpen(false)
                        navigate('/profile')
                      }}
                    >
                      Perfil
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                      onClick={() => {
                        setIsMenuOpen(false)
                        logout()
                      }}
                    >
                      Cerrar sesión
                    </button>
                  </div>
                ) : (
                  <div className="py-1">
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => {
                        setIsMenuOpen(false)
                        navigate('/login')
                      }}
                    >
                      Iniciar sesión
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
