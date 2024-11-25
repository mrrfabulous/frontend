import React from 'react';
import { Link } from 'react-router-dom';
import { Train, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Train className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">TrainEase</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link to="/search" className="text-gray-600 hover:text-blue-600">
              Search Trains
            </Link>
            {isAuthenticated && user ? (
              <>
                <Link to="/profile" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                  <User className="h-5 w-5" />
                  <span>{user.firstName}</span>
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                    <Settings className="h-5 w-5" />
                    <span>Admin</span>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}