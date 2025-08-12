import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import CategoryBar from './components/CategoryBar';

function App() {
  // The search term state is lifted to the App component
  // so it can be shared between the Header (where it's set)
  // and the HomePage (where it's used to filter listings).
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* The Header receives the state and the function to update it. */}
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <main className="flex-grow bg-gradient-to-b from-amber-50/60 via-white to-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="sticky top-16 z-40 bg-white/70 backdrop-blur-md supports-[backdrop-filter]:bg-white/50 -mx-4 sm:mx-0 px-4 sm:px-0 py-2 border-b border-white/40">
            <CategoryBar
              selectedCategory={selectedCategory}
              onSelect={setSelectedCategory}
            />
          </div>

          {/* The Outlet renders the current route's component and we pass context */}
          <div className="py-4 sm:py-6">
            <Outlet context={{ searchTerm, selectedCategory }} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App