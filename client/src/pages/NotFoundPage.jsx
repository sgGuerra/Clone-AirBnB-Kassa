const NotFoundPage = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-bold text-gray-900">Página no encontrada</h1>
      <p className="mt-2 text-gray-600">La ruta que intentas abrir no existe. Vuelve al inicio.</p>
      <a href="/" className="mt-6 inline-block bg-kassa-primary hover:bg-kassa-primaryDark text-white px-4 py-2 rounded-full">Ir al inicio</a>
    </div>
  )
}

export default NotFoundPage


