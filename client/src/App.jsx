import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  // The search term state is lifted to the App component
  // so it can be shared between the Header (where it's set)
  // and the HomePage (where it's used to filter listings).
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* The Header receives the state and the function to update it. */}
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <main className="flex-grow container mx-auto p-4 sm:p-6">
        {/* The Outlet renders the current route's component (e.g., HomePage),
            and we pass the searchTerm down via its context. */}
        <Outlet context={{ searchTerm }} />
      </main>

      <Footer />
    </div>
  );
}

export default App