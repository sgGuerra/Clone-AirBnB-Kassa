const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t mt-auto">
      <div className="container mx-auto py-6 px-4 sm:px-6 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} Kassa. Todos los derechos reservados.</p>
        <p className="text-sm mt-1">Inspirado en el diseño de Airbnb.</p>
      </div>
    </footer>
  );
};

export default Footer;
