'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';

export default function Home() {
  const [photos, setPhotos] = useState([]);
  const [isGridView, setIsGridView] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        // const response = await fetch('https://jsonplaceholder.typicode.com/photos');
        // Above API was not working, Using Picsum Photos API - a more reliable free image API
        const response = await fetch('https://picsum.photos/v2/list?limit=100');
        const data = await response.json();
        setPhotos(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching photos:', error);
        setIsLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  // Calculate pagination
  const indexOfLastItem = useMemo(() => currentPage * itemsPerPage, [currentPage, itemsPerPage]);
  const indexOfFirstItem = useMemo(() => indexOfLastItem - itemsPerPage, [indexOfLastItem, itemsPerPage]);
  const currentItems = useMemo(() => photos.slice(indexOfFirstItem, indexOfLastItem), [photos, indexOfFirstItem, indexOfLastItem]);
  const totalPages = useMemo(() => Math.ceil(photos.length / itemsPerPage), [photos.length, itemsPerPage]);

  const paginate = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const LoadingSkeleton = () => {
    const skeletonItems = Array(itemsPerPage).fill(null);

    return (
      <div className={`mb-8 ${isGridView
        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
        : 'flex flex-col gap-4'
        }`}>
        {skeletonItems.map((_, index) => (
          <div
            key={index}
            className={`bg-white rounded-lg shadow-md overflow-hidden ${isGridView
              ? 'flex flex-col'
              : 'flex flex-col md:flex-row'
              }`}
          >
            <div className={`animate-pulse bg-gray-200 ${isGridView
              ? 'w-full h-48'
              : 'w-full md:w-40 h-48 md:h-40'
              }`} />
            <div className="p-4 flex-1">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="relative min-h-screen">
      {/* Navigation Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity z-40 lg:hidden ${isNavOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setIsNavOpen(false)}
      />

      {/* Side Navigation */}
      <nav className={`fixed top-0 right-0 h-full w-64 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isNavOpen ? 'translate-x-0' : 'translate-x-full'
        } lg:translate-x-0`}>
        <div className="p-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold">Menu</h2>
            <button
              onClick={() => setIsNavOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-full"
            >
              <HiX className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-500 uppercase">View Options</h3>
              <button
                onClick={() => setIsGridView(true)}
                className={`w-full text-left px-4 py-2 rounded-lg ${isGridView ? 'bg-black text-white' : 'hover:bg-gray-100'
                  }`}
              >
                Grid View
              </button>
              <button
                onClick={() => setIsGridView(false)}
                className={`w-full text-left px-4 py-2 rounded-lg ${!isGridView ? 'bg-black text-white' : 'hover:bg-gray-100'
                  }`}
              >
                List View
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-500 uppercase">Navigation</h3>
              <div className="space-y-1">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => {
                      paginate(i + 1);
                      setIsNavOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 rounded-lg ${currentPage === i + 1 ? 'bg-black text-white' : 'hover:bg-gray-100'
                      }`}
                  >
                    Page {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="lg:pr-64 relative">
        <main className="p-4 md:p-8 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8 gap-4 bg-white rounded p-2 fixed left-0 w-full top-0 z-30">

            <h1 className="text-2xl ml-4 font-bold">Bamboo Photo Gallery</h1>
            <button
              onClick={() => setIsNavOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-full lg:hidden"
            >
              <HiMenu className="w-6 h-6" />
            </button>
          </div>

          {isLoading ? <LoadingSkeleton /> : (
            <div className={`my-10 ${isGridView
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
              : 'flex flex-col gap-4'
              }`}>
              {currentItems.map((photo) => (
                <div
                  key={photo.id}
                  className={`bg-white rounded-lg shadow-md hover:shadow-xl overflow-hidden hover:scale-105 transition-transform ${isGridView
                    ? 'flex flex-col'
                    : 'flex flex-col md:flex-row'
                    }`}
                >
                  <img
                    src={photo.download_url}
                    alt={`Photo by ${photo.author}`}
                    className={`object-cover ${isGridView
                      ? 'w-full h-48'
                      : 'w-full md:w-40 h-48 md:h-40'
                      }`}
                  />
                  <div className="p-4 flex-1">
                    <h3 className="text-lg font-semibold ">By {photo.author}</h3>
                    <a
                      href={photo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black/40 hover:text-blue-800 text-sm"
                    >
                      View on Unsplash
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-center items-center gap-4">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-6 py-2 bg-black text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-6 py-2 bg-black text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
