import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const currency = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' })

const CheckoutPage = () => {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [card, setCard] = useState({ number: '', exp: '', cvc: '' })
  const [cardErrors, setCardErrors] = useState({})

  const validExpiry = (exp) => /^(0[1-9]|1[0-2])\/(\d{2})$/.test(exp)
  const validCvc = (cvc) => /^[0-9]{3,4}$/.test(cvc)

  const validateCard = () => {
    const errs = {}
    const sanitized = String(card.number).replace(/\D/g, '')
    if (sanitized.length < 12 || sanitized.length > 19) errs.number = 'Debe tener entre 12 y 19 dígitos'
    if (!validExpiry(card.exp)) errs.exp = 'Formato MM/YY'
    if (!validCvc(card.cvc)) errs.cvc = 'CVC inválido'
    setCardErrors(errs)
    return Object.keys(errs).length === 0
  }

  const formatCardNumber = (value) => {
    const digits = String(value).replace(/\D/g, '').slice(0, 19)
    const groups = digits.match(/.{1,4}/g) || []
    return groups.join(' ')
  }

  const confirm = async (success, overrideSessionId) => {
    setMessage('')
    try {
      const res = await fetch('/api/payments/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sessionId: overrideSessionId || session?.sessionId, success }),
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

  if (loading) return <div className="text-center py-12">Procesando...</div>
  if (error) return <div className="text-center py-12 text-red-600">{error}</div>

  return (
    <div className="max-w-xl mx-auto">
      <div className="rounded-2xl border border-white/50 bg-white/70 backdrop-blur-md p-6 shadow-soft">
        <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
        {session && <p className="mt-2 text-gray-600">Monto: {currency.format(session.amount)}</p>}
        <div className="mt-6 grid gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Número de tarjeta</label>
            <input
              value={card.number}
              onChange={(e) => setCard((c) => ({ ...c, number: formatCardNumber(e.target.value) }))}
              inputMode="numeric"
              placeholder="4242 4242 4242 4242"
              maxLength={23}
              className={`w-full border rounded px-3 py-2 ${cardErrors.number ? 'border-red-400' : 'border-gray-300'}`}
            />
            <div className="flex justify-between">
              {cardErrors.number && <p className="text-xs text-red-600 mt-1">{cardErrors.number}</p>}
              <p className="text-xs text-gray-500 mt-1 ml-auto">Hasta 19 dígitos</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Expiración (MM/YY)</label>
              <input
                value={card.exp}
                onChange={(e) => setCard((c) => ({ ...c, exp: e.target.value }))}
                placeholder="12/28"
                className={`w-full border rounded px-3 py-2 ${cardErrors.exp ? 'border-red-400' : 'border-gray-300'}`}
              />
              {cardErrors.exp && <p className="text-xs text-red-600 mt-1">{cardErrors.exp}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">CVC</label>
              <input
                value={card.cvc}
                onChange={(e) => setCard((c) => ({ ...c, cvc: e.target.value }))}
                placeholder="123"
                inputMode="numeric"
                className={`w-full border rounded px-3 py-2 ${cardErrors.cvc ? 'border-red-400' : 'border-gray-300'}`}
              />
              {cardErrors.cvc && <p className="text-xs text-red-600 mt-1">{cardErrors.cvc}</p>}
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={async () => {
                setError('')
                if (!validateCard()) return
                try {
                  setLoading(true)
                  // 1) Iniciar sesión de pago con tarjeta
                  const resInit = await fetch('/api/payments/init', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ bookingId: Number(bookingId), method: 'card', card }),
                  })
                  const sessionData = await resInit.json()
                  if (!resInit.ok) throw new Error(sessionData.error || 'No se pudo iniciar el pago')
                  setSession(sessionData)
                  // 2) Confirmar pago exitoso
                  await confirm(true, sessionData.sessionId)
                } catch (e) {
                  setError(e.message)
                } finally {
                  setLoading(false)
                }
              }}
              className="flex-1 bg-kassa-primary hover:bg-kassa-primaryDark text-white px-4 py-2 rounded-lg"
            >
              Pagar ahora
            </button>
            <button onClick={() => confirm(false)} className="flex-1 border rounded-lg px-4 py-2 hover:bg-gray-50">Simular fallo</button>
          </div>
        </div>
        {message && <p className="mt-4 text-center text-gray-800">{message}</p>}
      </div>
    </div>
  )
}

export default CheckoutPage


