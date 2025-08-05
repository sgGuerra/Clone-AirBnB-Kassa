// client/src/LoginForm.jsx
import { useState } from 'react'

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [message, setMessage] = useState('')
  const [isLogin, setIsLogin] = useState(true) // true = login, false = register

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    const url = `http://localhost:5000/api/auth/${isLogin ? 'login' : 'register'}`
    const method = 'POST'

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        // Guardar token y usuario
        localStorage.setItem('authToken', result.token)
        localStorage.setItem('user', JSON.stringify(result.user))
        setMessage(`✅ ${isLogin ? 'Bienvenido' : 'Registrado'} ${result.user.name || ''}`)
        window.location.reload() // Refresca para que el estado cambie
        localStorage.setItem('authToken', result.token)
      } else {
        setMessage(`Error: ${result.error}`)
      }
    } catch (err) {
      setMessage('Error de conexión')
      console.error(err)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
      </h2>

      {message && (
        <div className={`p-3 mb-6 rounded text-white ${message.includes('Error') || message.includes('inválidas') ? 'bg-red-500' : 'bg-green-500'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label className="block text-gray-700 mb-2">Email *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="mb-5">
          <label className="block text-gray-700 mb-2">Contraseña *</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {!isLogin && (
          <div className="mb-5">
            <label className="block text-gray-700 mb-2">Nombre (opcional)</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700 transition"
        >
          {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-indigo-600 hover:underline"
        >
          {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
        </button>
      </div>
    </div>
  )
}