import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ExternalLink, 
  Copy, 
  BarChart2, 
  Calendar, 
  Eye, 
  Search, 
  Check,
  Link as LinkIcon,
  Clock,
  TrendingUp,
  ChevronRight
} from 'lucide-react';
import axios from 'axios';

const UrlList = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // const BASE_URL = "https://url-website-server.vercel.app";
  const BASE_URL = "http://localhost:3000";

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/list`);
      setUrls(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error fetching URLs');
    } finally {
      setLoading(false);
    }
  };

  const filteredUrls = urls.filter(url => 
    url.originalUrl?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    url.shortUrl?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    url.urlPath?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your URLs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Shortened URLs</h1>
        <p className="text-gray-600">Track and manage your links</p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-lg">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search your URLs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* URL Cards */}
      <div className="grid grid-cols-1 gap-4">
        {filteredUrls.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <LinkIcon className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600">No URLs found</p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-2 text-blue-600 hover:text-blue-700"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          filteredUrls.map((url) => (
            <div key={url._id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  {/* URL Path */}
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <LinkIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <a
                          href={`${BASE_URL}/api/${url.urlPath}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 font-medium font-mono"
                        >
                          /{url.urlPath}
                        </a>
                        <span className="text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                          {url.clicks || 0} clicks
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">Short URL</div>
                    </div>
                  </div>

                  {/* Original URL */}
                  <div className="mb-4">
                    <div className="text-sm text-gray-500 mb-1">Original URL</div>
                    <div className="text-gray-700 truncate">
                      {url.originalUrl}
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(url.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(url.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <a
                    href={`${BASE_URL}/api/${url.urlPath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    title="Test Link"
                  >
                    <ExternalLink className="w-5 h-5 text-gray-600" />
                  </a>
                  <Link
                    to={`/stats/${url.urlPath}`}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <BarChart2 className="w-5 h-5" />
                    <span>Analytics</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UrlList;