import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllEvents } from '../store/eventSlice';
import { api } from '../store/authSlice';
import MainLayout from '../components/layout/MainLayout';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Admin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { events, loading } = useSelector(state => state.event);
  const [activeTab, setActiveTab] = useState('events');

  // Admin Register Form State
  const [adminForm, setAdminForm] = useState({ userName: '', emailId: '', password: '', role: 'admin' });
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    dispatch(getAllEvents());
  }, [dispatch]);

  const handleDelete = async (eid) => {
    if (window.confirm("Admin Action: Delete this event globally?")) {
      try {
        await api.delete(`/api/event/admin/delete/${eid}`);
        toast.success("Event deleted by Admin");
        dispatch(getAllEvents()); // refresh list
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to delete event");
      }
    }
  };

  const handleAdminRegister = async (e) => {
    e.preventDefault();
    setIsRegistering(true);
    try {
      await api.post('/api/user/admin/register', adminForm);
      toast.success("Admin registered successfully");
      setAdminForm({ userName: '', emailId: '', password: '', role: 'admin' });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to register admin");
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-end mb-8 border-b-2 border-retro-light pb-4">
        <h2 className="text-2xl md:text-3xl font-retro text-retro-light tracking-wider text-retro-accent">ADMIN DASHBOARD</h2>
      </div>

      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2 font-bold border-2 border-retro-light ${activeTab === 'events' ? 'bg-retro-accent text-white shadow-[2px_2px_0px_rgba(33,37,41,1)]' : 'bg-white text-gray-500 hover:bg-gray-100'}`}
        >
          MANAGE EVENTS
        </button>
        <button 
          onClick={() => setActiveTab('register')}
          className={`px-4 py-2 font-bold border-2 border-retro-light ${activeTab === 'register' ? 'bg-retro-accent text-white shadow-[2px_2px_0px_rgba(33,37,41,1)]' : 'bg-white text-gray-500 hover:bg-gray-100'}`}
        >
          REGISTER ADMIN/USER
        </button>
      </div>

      {activeTab === 'events' && (
        <div className="bg-white border-2 border-retro-light p-6 shadow-[4px_4px_0px_rgba(33,37,41,1)]">
          {loading ? (
            <div className="text-center py-10 animate-pulse font-retro">LOADING...</div>
          ) : events.length === 0 ? (
            <p className="text-gray-500 font-bold">No events exist in the platform.</p>
          ) : (
            <div className="space-y-4">
              {events.map(event => (
                <div key={event._id} className="border border-gray-200 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-gray-50">
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-retro-light">{event.title}</h4>
                    <p className="text-sm text-gray-500">ID: {event._id}</p>
                    <p className="text-sm text-gray-500">Organizer ID: {event.organizerId}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button 
                      onClick={() => navigate(`/event/edit/${event._id}`)}
                      className="flex-1 sm:flex-none border-2 border-retro-light px-4 py-2 text-xs font-bold text-retro-light bg-retro-brown hover:bg-gray-200"
                    >
                      UPDATE EVENT
                    </button>
                    <button 
                      onClick={() => handleDelete(event._id)}
                      className="flex-1 sm:flex-none border-2 border-retro-error px-4 py-2 text-xs font-bold text-retro-error hover:bg-retro-error hover:text-white"
                    >
                      DELETE GLOBALLY
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'register' && (
        <div className="bg-white border-2 border-retro-light p-6 shadow-[4px_4px_0px_rgba(33,37,41,1)] max-w-2xl">
          <h3 className="font-bold text-xl mb-6">REGISTER PRIVILEGED USER</h3>
          <form onSubmit={handleAdminRegister} className="space-y-4">
            <div>
              <label className="block font-bold mb-1">USERNAME</label>
              <input type="text" required value={adminForm.userName} onChange={e => setAdminForm({...adminForm, userName: e.target.value})} className="retro-input" />
            </div>
            <div>
              <label className="block font-bold mb-1">EMAIL</label>
              <input type="email" required value={adminForm.emailId} onChange={e => setAdminForm({...adminForm, emailId: e.target.value})} className="retro-input" />
            </div>
            <div>
              <label className="block font-bold mb-1">PASSWORD</label>
              <input type="password" required value={adminForm.password} onChange={e => setAdminForm({...adminForm, password: e.target.value})} className="retro-input" />
            </div>
            <div>
              <label className="block font-bold mb-1">ROLE</label>
              <select value={adminForm.role} onChange={e => setAdminForm({...adminForm, role: e.target.value})} className="retro-input">
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
            <button type="submit" disabled={isRegistering} className="retro-btn w-full mt-4">
              {isRegistering ? 'REGISTERING...' : 'REGISTER USER'}
            </button>
          </form>
        </div>
      )}

    </MainLayout>
  );
};

export default Admin;
