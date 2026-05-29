import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getEventsByUser, deleteEvent, updateEvent } from '../store/eventSlice';
import MainLayout from '../components/layout/MainLayout';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import EventFilters from '../components/ui/EventFilters';
import Pagination from '../components/ui/Pagination';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { userEvents, loading } = useSelector(state => state.event);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Debounce search term
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timerId);
  }, [searchTerm]);

  useEffect(() => {
    dispatch(getEventsByUser({ search: debouncedSearch, category: categoryFilter, sort: sortOrder }));
    setCurrentPage(1);
  }, [dispatch, debouncedSearch, categoryFilter, sortOrder]);

  const handleDelete = async (eid) => {
    if (window.confirm("Are you sure you want to completely delete this event? This cannot be undone.")) {
      try {
        const res = await dispatch(deleteEvent(eid));
        if (deleteEvent.fulfilled.match(res)) {
          toast.success("Event deleted successfully");
        } else {
          toast.error(res.payload || "Failed to delete event");
        }
      } catch (err) {
        toast.error("Unexpected error occurred");
      }
    }
  };

  const handleCancel = async (eid) => {
    if (window.confirm("Are you sure you want to cancel this event? It will be removed from the public feed.")) {
      try {
        const res = await dispatch(updateEvent({ eid, data: { isCancelled: true } }));
        if (updateEvent.fulfilled.match(res)) {
          toast.success("Event cancelled successfully");
        } else {
          toast.error(res.payload || "Failed to cancel event");
        }
      } catch (err) {
        toast.error("Unexpected error occurred");
      }
    }
  };

  return (
    <MainLayout>
      <div className="bg-white border-2 border-retro-light p-6 shadow-[4px_4px_0px_rgba(33,37,41,1)] mb-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-retro text-retro-accent mb-4">MY PROFILE</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-bold">
          <div>
            <p className="text-sm text-gray-500">USERNAME</p>
            <p className="text-lg">{user?.userName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">EMAIL</p>
            <p className="text-lg">{user?.emailId}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">ROLE</p>
            <p className="text-lg uppercase text-retro-accent">{user?.role}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6 border-b-2 border-retro-light pb-2">
          <h3 className="text-xl font-retro text-retro-light">EVENTS I ORGANIZED</h3>
          <Link to="/event/create" className="retro-btn py-2 px-4 text-[10px]">
            + CREATE NEW
          </Link>
        </div>

        <EventFilters 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          categoryFilter={categoryFilter} 
          setCategoryFilter={setCategoryFilter} 
          sortOrder={sortOrder} 
          setSortOrder={setSortOrder} 
        />

        {loading ? (
          <div className="text-center py-10 animate-pulse font-retro">LOADING EVENTS...</div>
        ) : userEvents.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-gray-300 bg-white">
            <p className="font-bold text-gray-500 mb-4">NO EVENTS FOUND MATCHING YOUR CRITERIA.</p>
          </div>
        ) : (
          <div className="space-y-4 pb-12">
            {userEvents.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map(event => (
              <div key={event._id} className="bg-white border-2 border-retro-light p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-[4px_4px_0px_rgba(33,37,41,1)] transition-all">
                <div className="flex-1">
                  <Link to={`/event/${event._id}`} className="hover:underline decoration-dashed decoration-2 underline-offset-4">
                    <h4 className="font-retro text-retro-accent text-lg mb-1 line-clamp-1">{event.title}</h4>
                  </Link>
                  <p className="text-sm font-bold text-gray-500">
                    {new Date(event.startTime).toLocaleDateString()} &bull; {event.venue}
                    {event.isCancelled && <span className="ml-2 text-retro-error"> [CANCELLED]</span>}
                    {event.isCompleted && !event.isCancelled && <span className="ml-2 text-green-500"> [COMPLETED]</span>}
                  </p>
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button 
                    onClick={() => navigate(`/event/edit/${event._id}`)}
                    className="flex-1 sm:flex-none border-2 border-retro-light px-4 py-2 text-xs font-retro bg-retro-brown hover:bg-gray-200 shadow-[2px_2px_0_#212529] active:translate-y-[1px] active:translate-x-[1px] active:shadow-none transition-all"
                  >
                    UPDATE
                  </button>
                  <button 
                    onClick={() => handleCancel(event._id)}
                    disabled={event.isCancelled || event.isCompleted}
                    className={`flex-1 sm:flex-none border-2 px-4 py-2 text-xs font-retro transition-all ${
                      event.isCancelled || event.isCompleted 
                      ? 'border-gray-400 text-gray-400 bg-gray-100 cursor-not-allowed' 
                      : 'border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white shadow-[2px_2px_0_#f97316] active:translate-y-[1px] active:translate-x-[1px] active:shadow-none'
                    }`}
                  >
                    CANCEL
                  </button>
                  <button 
                    onClick={() => handleDelete(event._id)}
                    className="flex-1 sm:flex-none border-2 border-retro-error px-4 py-2 text-xs font-retro text-retro-error hover:bg-retro-error hover:text-white shadow-[2px_2px_0_#ef4444] active:translate-y-[1px] active:translate-x-[1px] active:shadow-none transition-all"
                  >
                    DELETE
                  </button>
                </div>
              </div>
            ))}
            <Pagination 
                currentPage={currentPage} 
                totalItems={userEvents.length} 
                itemsPerPage={ITEMS_PER_PAGE} 
                onPageChange={setCurrentPage} 
              />
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Profile;
