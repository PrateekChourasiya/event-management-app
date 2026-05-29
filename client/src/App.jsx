import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import EventDetails from './pages/EventDetails';
import EventForm from './pages/EventForm';
import Admin from './pages/Admin';

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <Router>
      <Toaster position="top-center" toastOptions={{
        className: 'font-sans text-base bg-white text-retro-light border-2 border-retro-light',
        style: {
          borderRadius: '0',
          boxShadow: '4px 4px 0px 0px rgba(33, 37, 41, 1)',
        }
      }} />
      <div className="min-h-screen bg-retro-brown">
        <Routes>
          <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/event/create" element={user ? <EventForm /> : <Navigate to="/login" />} />
          <Route path="/event/edit/:eid" element={user ? <EventForm /> : <Navigate to="/login" />} />
          <Route path="/event/:eid" element={user ? <EventDetails /> : <Navigate to="/login" />} />
          <Route path="/admin" element={user && user.role === 'admin' ? <Admin /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
