import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventById, clearCurrentEvent } from '../store/eventSlice';
import MainLayout from '../components/layout/MainLayout';
import toast from 'react-hot-toast';

const EventDetails = () => {
  const { eid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentEvent: event, loading, error } = useSelector(state => state.event);

  useEffect(() => {
    if (eid) {
      dispatch(getEventById(eid)).unwrap().catch(() => {
        toast.error('Failed to load event details');
        navigate('/');
      });
    }
    return () => {
      dispatch(clearCurrentEvent());
    };
  }, [dispatch, eid, navigate]);

  if (loading || !event) {
    return (
      <MainLayout>
        <div className="text-center py-20 font-retro text-xl animate-pulse">LOADING EVENT...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <button onClick={() => navigate(-1)} className="mb-6 font-bold hover:text-retro-accent underline decoration-dashed underline-offset-4">
        &larr; BACK
      </button>

      <div className="bg-white border-2 border-retro-light shadow-[8px_8px_0px_rgba(33,37,41,1)] p-6 md:p-10 max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-6 flex-wrap gap-4">
          <h1 className="text-3xl md:text-5xl font-retro text-retro-accent leading-tight w-full md:w-auto flex-1">
            {event.title}
          </h1>
          <div className="text-right whitespace-nowrap bg-retro-brown px-4 py-2 border-2 border-retro-light">
            <p className="font-retro text-xl">{event.isFree ? 'FREE' : `$${event.price}`}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <span className="bg-retro-accent text-white px-3 py-1 font-bold uppercase text-xs tracking-wider">
            {event.category || 'General'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 border-y-2 border-retro-light py-6">
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-bold text-lg border-b-2 border-retro-brown pb-2">ABOUT THE EVENT</h3>
            <p className="font-bold text-gray-700">{event.description}</p>
            <p className="whitespace-pre-wrap text-gray-600">{event.content}</p>
          </div>
          
          <div className="space-y-6 bg-retro-brown p-6 border-2 border-retro-light h-fit">
            <div>
              <h4 className="font-bold text-sm text-gray-500 mb-1">DATE & TIME</h4>
              <p className="font-bold">
                {new Date(event.startTime).toLocaleString()}
                <br/>
                <span className="text-gray-500 text-sm">to</span>
                <br/>
                {new Date(event.endTime).toLocaleString()}
              </p>
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-500 mb-1">LOCATION</h4>
              <p className="font-bold">{event.venue}</p>
            </div>
          </div>
        </div>

      </div>
    </MainLayout>
  );
};

export default EventDetails;
