import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../store/authSlice';
import toast from 'react-hot-toast';

const MainLayout = ({ children }) => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    setDropdownOpen(false);
    try {
      const res = await dispatch(logoutUser());
      if (logoutUser.fulfilled.match(res)) {
        toast.success("Logged out successfully");
      }
    } catch (e) {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-retro-brown text-retro-light font-sans">
      {/* HEADER */}
      <header className="bg-white border-b-2 border-retro-light sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <Link to="/" className="font-retro text-xl md:text-2xl text-retro-accent drop-shadow-[2px_2px_0_rgba(33,37,41,0.1)] hover:text-retro-hover tracking-widest">
              EVENT MANIA
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <Link to="/event/create" className="retro-btn inline-block">
                CREATE EVENT
              </Link>
            )}

            {/* Top Right Icon / Dropdown */}
            {user && (
              <div className="relative">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-10 h-10 bg-retro-accent text-white flex items-center justify-center font-retro text-sm border-2 border-retro-light shadow-[2px_2px_0px_rgba(33,37,41,1)] active:translate-y-[1px] active:translate-x-[1px] active:shadow-[1px_1px_0px_rgba(33,37,41,1)]"
                >
                  {user.userName?.charAt(0).toUpperCase()}
                </button>

                {dropdownOpen && (
                  <div className="absolute top-12 right-0 w-48 bg-white border-2 border-retro-light shadow-[4px_4px_0px_rgba(33,37,41,1)] py-2 flex flex-col">
                    <Link 
                      to="/profile" 
                      onClick={() => setDropdownOpen(false)}
                      className="px-4 py-2 hover:bg-retro-brown hover:text-retro-accent font-bold text-left"
                    >
                      PROFILE
                    </Link>
                    {user.role === 'admin' && (
                      <Link 
                        to="/admin" 
                        onClick={() => setDropdownOpen(false)}
                        className="px-4 py-2 hover:bg-retro-brown hover:text-retro-accent font-bold text-left"
                      >
                        ADMIN DASHBOARD
                      </Link>
                    )}
                    <button 
                      onClick={handleLogout}
                      className="px-4 py-2 hover:bg-retro-brown hover:text-retro-error font-bold text-left text-retro-error"
                    >
                      LOGOUT
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MAIN BODY */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t-2 border-retro-light py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="font-retro text-xs text-retro-light/70 tracking-widest">
            © 2026 EVENT MANIA PLATFORM. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
