import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const currency = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' })

const CheckoutPage = () => {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/payments/init', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ bookingId: Number(bookingId) }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'No se pudo iniciar el pago')
        setSession(data)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [bookingId, token])

  const confirm = async (success) => {
    setMessage('')
    try {
      const res = await fetch('/api/payments/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sessionId: session.sessionId, success }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al confirmar pago')
      setMessage(data.message)
      if (data.ok) {
        setTimeout(() => navigate('/profile'), 1200)
      }
    } catch (e) {
      setError(e.message)
    }
  }

  if (loading) return <div className="text-center py-12">Preparando pago...</div>
  if (error) return <div className="text-center py-12 text-red-600">{error}</div>

  return (
    <div className="max-w-xl mx-auto">
      <div className="rounded-2xl border border-white/50 bg-white/70 backdrop-blur-md p-6 shadow-soft">
        <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
        <p className="mt-2 text-gray-600">Monto: {currency.format(session.amount)}</p>
        <div className="mt-6 flex gap-3">
          <button onClick={() => confirm(true)} className="flex-1 bg-kassa-primary hover:bg-kassa-primaryDark text-white px-4 py-2 rounded-lg">Pagar ahora</button>
          <button onClick={() => confirm(false)} className="flex-1 border rounded-lg px-4 py-2 hover:bg-gray-50">Simular fallo</button>
        </div>
        {message && <p className="mt-4 text-center text-gray-800">{message}</p>}
      </div>
    </div>
  )
}

export default CheckoutPage


