import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllEvents } from '../store/eventSlice';
import EventCard from '../components/ui/EventCard';
import MainLayout from '../components/layout/MainLayout';
import EventFilters from '../components/ui/EventFilters';
import Pagination from '../components/ui/Pagination';

const Home = () => {
  const dispatch = useDispatch();
  const { events, loading } = useSelector((state) => state.event);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  const [upcomingPage, setUpcomingPage] = useState(1);
  const [pastPage, setPastPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const [userLocation, setUserLocation] = useState({ lat: null, lng: null });

  // Handle Sort Change with Geolocation Prompt
  const handleSortChange = (newSort) => {
    if (newSort === 'nearest') {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
            setSortOrder(newSort);
          },
          (error) => {
            console.error("Error getting location", error);
            alert("Could not get your location. Please allow location access.");
            setSortOrder('newest'); // fallback
          }
        );
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    } else {
      setSortOrder(newSort);
    }
  };

  // Debounce search term
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timerId);
  }, [searchTerm]);

  // Fetch events on filter change
  useEffect(() => {
    dispatch(getAllEvents({ 
      search: debouncedSearch, 
      category: categoryFilter, 
      sort: sortOrder,
      userLat: userLocation.lat,
      userLng: userLocation.lng
    }));
    setUpcomingPage(1);
    setPastPage(1);
  }, [dispatch, debouncedSearch, categoryFilter, sortOrder, userLocation]);

  const now = new Date();
  const upcomingEvents = events.filter(e => new Date(e.startTime) >= now);
  const pastEvents = events.filter(e => new Date(e.startTime) < now);

  return (
    <MainLayout>
      <div className="flex justify-between items-end mb-8 border-b-2 border-retro-light pb-4">
        <div>
          <h2 className="text-2xl md:text-4xl font-retro text-retro-light tracking-wider drop-shadow-[2px_2px_0_rgba(79,70,229,0.2)]">EVENT MANIA</h2>
          <p className="text-sm font-bold text-gray-500 mt-2 tracking-wide uppercase">Where Epic Events Happen.</p>
        </div>
      </div>

      <EventFilters 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        categoryFilter={categoryFilter} 
        setCategoryFilter={setCategoryFilter} 
        sortOrder={sortOrder} 
        setSortOrder={handleSortChange} 
      />

      {loading ? (
        <div className="text-center py-20 font-retro text-xl animate-pulse">LOADING EVENTS...</div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 bg-white border-2 border-dashed border-gray-300">
          <p className="text-xl font-bold text-gray-500">NO EVENTS FOUND MATCHING YOUR CRITERIA.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {upcomingEvents.length > 0 && (
            <div>
              <h3 className="text-xl font-retro text-retro-accent mb-6 flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></span>
                UPCOMING EVENTS
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {upcomingEvents.slice((upcomingPage - 1) * ITEMS_PER_PAGE, upcomingPage * ITEMS_PER_PAGE).map(event => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
              <Pagination 
                currentPage={upcomingPage} 
                totalItems={upcomingEvents.length} 
                itemsPerPage={ITEMS_PER_PAGE} 
                onPageChange={setUpcomingPage} 
              />
            </div>
          )}

          {pastEvents.length > 0 && (
            <div>
              <h3 className="text-xl font-retro text-gray-400 mb-6 border-t-2 border-dashed border-gray-300 pt-8 flex items-center gap-2">
                <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
                PAST EVENTS
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 opacity-75 grayscale hover:grayscale-0 transition-all duration-300">
                {pastEvents.slice((pastPage - 1) * ITEMS_PER_PAGE, pastPage * ITEMS_PER_PAGE).map(event => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
              <Pagination 
                currentPage={pastPage} 
                totalItems={pastEvents.length} 
                itemsPerPage={ITEMS_PER_PAGE} 
                onPageChange={setPastPage} 
              />
            </div>
          )}
        </div>
      )}
    </MainLayout>
  );
};

export default Home;
