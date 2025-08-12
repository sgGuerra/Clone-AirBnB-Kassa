import LoginForm from '../features/auth/LoginForm'

const LoginPage = () => {
  return (
    <section className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="hidden md:block rounded-2xl overflow-hidden shadow-soft bg-gradient-to-br from-amber-100/70 to-rose-100/70 border border-white/50 backdrop-blur-md p-6">
          <h2 className="text-3xl font-bold text-gray-900">Bienvenido a Kassa</h2>
          <p className="mt-3 text-gray-600">Inicia sesión o crea tu cuenta para reservar y administrar tus alojamientos.</p>
          <img
            className="mt-6 rounded-xl object-cover w-full h-48"
            src="https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1200&auto=format&fit=crop"
            alt="Estancias Kassa"
          />
        </div>

        <LoginForm />
      </div>
    </section>
  )
}

export default LoginPage
