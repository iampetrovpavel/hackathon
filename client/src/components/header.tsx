import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Hammer, Video } from 'lucide-react';

export function Header() {
  const location = useLocation();
  
  return (
    <header className="bg-gray-900 shadow-lg p-4">
      <div className="max-w-3xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold text-white">Hackathon Demo</h1>
        </div>
        <nav className="flex space-x-4">
          <Link 
            to="/" 
            className={`text-sm font-medium ${location.pathname === '/' ? 'text-white' : 'text-gray-300 hover:text-white'}`}
          >
            Chat
          </Link>
          <Link 
            to="/avatar" 
            className={`text-sm font-medium flex items-center ${location.pathname === '/avatar' ? 'text-white' : 'text-gray-300 hover:text-white'}`}
          >
            <Video className="w-4 h-4 mr-1" />
            Avatar
          </Link>
        </nav>
      </div>
    </header>
  );
}