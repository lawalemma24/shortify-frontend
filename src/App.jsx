// App.jsx - Super Simple & Guaranteed to Work
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Stats from './components/Stats';
import UrlList from './components/UrlList';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="pt-16"> {/* Fixed padding for navbar */}
        <div className="px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/stats/:urlPath" element={<Stats />} />
            <Route path="/list" element={<UrlList />} />
          </Routes>
        </div>
      </div>

      {/* Simple Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* <div className="text-center"> */}
            {/* <p className="text-gray-600 dark:text-gray-400 text-sm">
              © {new Date().getFullYear()} URLShort. All rights reserved.
            </p> */}
          {/* </div> */}
        </div>
      </footer>
    </div>
  );
}

export default App;