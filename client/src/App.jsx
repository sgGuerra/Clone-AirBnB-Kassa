// client/src/App.jsx
import { useEffect, useState } from 'react'
import CreatePropertyForm from './CreatePropertyForm'
import LoginForm from './LoginForm'
import UserProfile from './UserProfile'

function App() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

  // Detectar cambios en la URL (avanzar/retroceder)
  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname)
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Obtener token y usuario
  const token = localStorage.getItem('authToken')
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  // Cambiar de ruta
  const goTo = (path) => {
    window.history.pushState({}, '', path)
    setCurrentPath(path)
  }

  // Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    goTo('/')
    window.location.reload() // Recargar para actualizar estado
  }

  // Cargar propiedades
  useEffect(() => {
    if (currentPath === '/') {
      fetch('http://localhost:5000/api/properties')
        .then(res => res.json())
        .then(data => {
          setProperties(data)
          setLoading(false)
        })
        .catch(err => {
          console.error(err)
          setLoading(false)
        })
    }
  }, [currentPath])

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Barra de navegación */}
      <nav className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow">
        <h1 className="text-3xl font-bold text-gray-800">Kassa</h1>

        <div className="space-x-4 flex items-center">
          <button
            onClick={() => goTo('/')}
            className="text-indigo-600 hover:underline font-medium"
          >
            Inicio
          </button>

          {token ? (
            <>
              <span className="text-gray-700 font-medium">
                Bienvenido, <strong>{user?.name || user?.email?.split('@')[0]}</strong>
              </span>
              <button
                onClick={() => goTo('/profile')}
                className="text-indigo-600 hover:underline font-medium"
              >
                Mi Perfil
              </button>
              <button
                onClick={handleLogout}
                className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"  
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <span className="text-gray-500 text-sm">Inicia sesión</span>
          )}
        </div>
      </nav>

      {/* Contenido según la ruta */}
      {currentPath === '/profile' ? (
        // Página de perfil
        token ? (
          <UserProfile goTo={goTo} />
        ) : (
          <div className="text-center max-w-md mx-auto">
            <p className="text-red-500 text-lg mb-4">
              🔒 Debes iniciar sesión para ver tu perfil
            </p>
            <button
              onClick={() => goTo('/')}
              className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
            >
              Volver al inicio
            </button>
          </div>
        )
      ) : (
        // Página de inicio
        <div>
          {/* Formulario de login/registro */}
          <div className="max-w-md mx-auto mb-8">
            <LoginForm />
          </div>

          {/* Formulario de publicación (solo si está logueado) */}
          {token && (
            <div className="max-w-2xl mx-auto mb-8">
              <CreatePropertyForm />
            </div>
          )}

          {/* Listado de propiedades */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Alojamientos disponibles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <p className="text-center text-gray-600 col-span-full py-8">
                🕵️‍♂️ Cargando alojamientos...
              </p>
            ) : properties.length === 0 ? (
              <p className="text-center text-gray-500 col-span-full py-8">
                Aún no hay propiedades publicadas.
              </p>
            ) : (
              properties.map((prop) => (
                <div
                  key={prop.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden transition transform hover:scale-105"
                >
                  <img
                    src={prop.images[0] || 'https://via.placeholder.com/300x200'}
                    alt={prop.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-800 truncate">
                      {prop.title}
                    </h3>
                    <p className="text-gray-600">{prop.location}</p>
                    <p className="text-lg font-bold text-indigo-600 mt-2">
                      ${prop.pricePerNight} / noche
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default App