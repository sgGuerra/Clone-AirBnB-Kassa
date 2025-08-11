import { Outlet, Link } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'

function App() {
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow">
        <h1 className="text-3xl font-bold text-gray-800">
          <Link to="/">Kassa</Link>
        </h1>

        <nav className="space-x-4 flex items-center">
          <Link to="/" className="text-indigo-600 hover:underline font-medium">
            Inicio
          </Link>

          {isAuthenticated ? (
            <>
              <span className="text-gray-700 font-medium">
                Bienvenido, <strong>{user?.name || user?.email?.split('@')[0]}</strong>
              </span>
              <Link to="/profile" className="text-indigo-600 hover:underline font-medium">
                Mi Perfil
              </Link>
              <button
                onClick={logout}
                className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link to="/login" className="text-indigo-600 hover:underline font-medium">
              Iniciar Sesión
            </Link>
          )}
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default App