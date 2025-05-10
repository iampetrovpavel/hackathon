import React from 'react';
import { Link } from 'react-router-dom';
import { Hammer } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-gray-900 shadow-lg p-4">
      <div className="max-w-3xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold text-white">Hackathon Demo</h1>
        </div>
      </div>
    </header>
  );
}