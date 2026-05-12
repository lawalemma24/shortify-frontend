import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Link2, BarChart2, Shield, Zap, Copy, Check, ExternalLink, Clock, TrendingUp, Users, Unlink, Search, Eye } from 'lucide-react';
import axios from 'axios';

const Home = () => {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [urlPath, setUrlPath] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  
  // Decode states
  const [decodeInput, setDecodeInput] = useState('');
  const [decodeResult, setDecodeResult] = useState(null);
  const [decodeLoading, setDecodeLoading] = useState(false);
  const [decodeError, setDecodeError] = useState('');
  
  const [recentUrls, setRecentUrls] = useState([]);
  const [stats, setStats] = useState({
    totalUrls: 0,
    totalClicks: 0,
    todayClicks: 0
  });
  // const BASE_URL = "https://url-website-server.vercel.app";
  // const BASE_URL = "http://localhost:3000";
    const BASE_URL = "https://shortify-backend-psi.vercel.app"
  // Fetch recent URLs and stats on component mount
  useEffect(() => {
    fetchRecentUrls();
    fetchStats();
  }, []);

  const fetchRecentUrls = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/list`);
      // Take only the 5 most recent URLs
      const recent = response.data.slice(0, 5).map(url => ({
        ...url,
       shortUrl: `${BASE_URL}${url.urlPath ? `/api/${url.urlPath}` : ''}`
      }));
      setRecentUrls(recent);
    } catch (err) {
      console.error('Failed to fetch recent URLs:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/list`);
      const totalUrls = response.data.length;
      const totalClicks = response.data.reduce((sum, url) => sum + (url.clicks || 0), 0);
      
      // Mock today's clicks
      const todayClicks = response.data.reduce((sum, url) => {
        const today = new Date();
        const urlDate = new Date(url.createdAt);
        if (urlDate.toDateString() === today.toDateString()) {
          return sum + (url.clicks || 0);
        }
        return sum;
      }, 0);

      setStats({ totalUrls, totalClicks, todayClicks });
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShortUrl('');
    setUrlPath('');

    try {
      const response = await axios.post(`${BASE_URL}/api/encode`, { 
        originalUrl: url 
      });

      const { shortUrl, urlPath, message } = response.data;
      
      if (message === 'URL already shortened') {
        setError('This URL has already been shortened. Using existing short URL.');
      }

      setShortUrl(shortUrl);
      setUrlPath(urlPath);
      
      // Refresh recent URLs
      fetchRecentUrls();
      fetchStats();
      
    } catch (err) {
      console.error('Error shortening URL:', err);
      setError(err.response?.data?.error || 'Failed to shorten URL. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle decode functionality
  const handleDecodeSubmit = async (e) => {
    e.preventDefault();
    setDecodeLoading(true);
    setDecodeError('');
    setDecodeResult(null);

    try {
      // Extract the path from the short URL
      let shortUrlToDecode = decodeInput.trim();
      
      //  http://localhost:5000/api/abc123
      // Extract just the path component
      if (shortUrlToDecode.includes('/api/')) {
        const urlParts = shortUrlToDecode.split('/api/');
        shortUrlToDecode = urlParts[1] || urlParts[0];
      }
      
      // Make sure we have a short URL to decode
      if (!shortUrlToDecode) {
        throw new Error('Please enter a valid short URL');
      }

      const response = await axios.get(`${BASE_URL}/api/decode`, {
        params: {
          shortUrl: shortUrlToDecode
        }
      });

      setDecodeResult(response.data);
    } catch (err) {
      console.error('Error decoding URL:', err);
      setDecodeError(err.response?.data?.error || 'Failed to decode URL. Please check the short URL and try again.');
    } finally {
      setDecodeLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Instant URL shortening with sub-second response times"
    },
    {
      icon: <BarChart2 className="w-6 h-6" />,
      title: "Advanced Analytics",
      description: "Track clicks, locations, and referral sources"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Reliable",
      description: "HTTPS encryption and 99.9% uptime guarantee"
    },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Shorten & Decode
          </span>
          <br />
          <span className="text-gray-800 dark:text-white">All-in-One URL Solution</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
          Transform long URLs into concise links or decode shortened URLs to reveal their destination.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <Link2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total URLs</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalUrls}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Clicks</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalClicks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Today's Clicks</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.todayClicks}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout for Encode and Decode */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto px-4">
        
        {/* Encode Card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
              <Link2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Shorten URL
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Convert long URLs to short, shareable links
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className={`p-4 rounded-xl ${error.includes('already shortened') ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200' : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'}`}>
                {error}
              </div>
            )}

            <div className="space-y-4">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste your long URL here..."
                className="w-full px-6 py-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
              />
              <button
                type="submit"
                disabled={loading || !url}
                className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Shortening...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center space-x-2">
                    <Zap className="w-5 h-5" />
                    <span>Shorten URL</span>
                  </span>
                )}
              </button>
            </div>

            {shortUrl && (
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Your shortened URL:</p>
                    <p className="text-lg font-mono text-blue-600 dark:text-blue-400 break-all">
                      {shortUrl}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(shortUrl)}
                      className={`flex-1 px-4 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all ${
                        copied 
                          ? 'bg-green-500 text-white' 
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      {copied ? (
                        <>
                          <Check className="w-5 h-5" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-5 h-5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                    {urlPath && (
                      <Link
                        to={`/stats/${urlPath}`}
                        className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
                      >
                        <BarChart2 className="w-5 h-5" />
                        <span>Stats</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Decode Card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl">
              <Unlink className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Decode URL
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Discover the original URL behind a short link
              </p>
            </div>
          </div>

          <form onSubmit={handleDecodeSubmit} className="space-y-6">
            {decodeError && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-xl">
                {decodeError}
              </div>
            )}

            <div className="space-y-4">
              <input
                type="text"
                value={decodeInput}
                onChange={(e) => setDecodeInput(e.target.value)}
                placeholder="Enter short URL (e.g., abc123 or http://localhost:5000/api/abc123)"
                className="w-full px-6 py-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                required
              />
              <button
                type="submit"
                disabled={decodeLoading || !decodeInput}
                className="w-full px-8 py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {decodeLoading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Decoding...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center space-x-2">
                    <Search className="w-5 h-5" />
                    <span>Decode URL</span>
                  </span>
                )}
              </button>
            </div>

            {decodeResult && (
              <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Short URL:</p>
                    <p className="text-lg font-mono text-emerald-600 dark:text-emerald-400 break-all">
                      {decodeResult.shortUrl || decodeInput}
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-emerald-100 dark:border-emerald-800">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Original Destination:</p>
                    <p className="text-lg font-medium text-gray-800 dark:text-white break-all">
                      {decodeResult.originalUrl}
                    </p>
                  </div>

                  {decodeResult.urlPath && (
                    <div className="pt-4 border-t border-emerald-100 dark:border-emerald-800">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">URL Details:</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Path:</p>
                          <p className="text-sm font-mono text-gray-700 dark:text-gray-300">
                            {decodeResult.urlPath}
                          </p>
                        </div>
                        <div className="text-right">
                          <Link
                            to={`/stats/${decodeResult.urlPath}`}
                            className="inline-flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 text-sm"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View Stats</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <button
                      onClick={() => copyToClipboard(decodeResult.originalUrl)}
                      className="flex-1 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
                    >
                      <Copy className="w-5 h-5" />
                      <span>Copy Original</span>
                    </button>
                    <a
                      href={decodeResult.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
                    >
                      <ExternalLink className="w-5 h-5" />
                      <span>Visit</span>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Recent URLs Section */}
      {recentUrls.length > 0 && (
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Recently Shortened URLs
            </h2>
            <Link 
              to="/list" 
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center space-x-2"
            >
              <span>View All</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Original URL
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Short URL
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Clicks
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {recentUrls.map((urlItem) => (
                    <tr key={urlItem._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                      <td className="px-6 py-4">
                        <div className="max-w-xs truncate text-sm text-gray-800 dark:text-gray-300">
                          {urlItem.originalUrl}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <a 
                            href={urlItem.shortUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-mono"
                          >
                            {urlItem.shortUrl.replace('http://localhost:5000/', '')}
                          </a>
                          <Copy 
                            className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                            onClick={() => copyToClipboard(urlItem.shortUrl)}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-800 dark:text-white">
                            {urlItem.clicks || 0}
                          </span>
                          <Link 
                            to={`/stats/${urlItem.urlPath}`}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                          >
                            <BarChart2 className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(urlItem.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">
          Why Choose Our Service?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
            >
              <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl w-fit mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;



// // src/components/Home.jsx - Modernized
// import React, { useState } from 'react';
// import { Link2, BarChart2, Shield, Zap, Copy, Check } from 'lucide-react';
// import axios from 'axios';

// const Home = () => {
//   const [url, setUrl] = useState('');
//   const [shortUrl, setShortUrl] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [copied, setCopied] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
    
//     try {
//       const res = await axios.post('http://localhost:5000/api/encode', { originalUrl: url });
//       setShortUrl(`${res.data.shortUrl}`);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const copyToClipboard = () => {
//     navigator.clipboard.writeText(shortUrl);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   const features = [
//     {
//       icon: <Zap className="w-6 h-6" />,
//       title: "Lightning Fast",
//       description: "Instant URL shortening with sub-second response times"
//     },
//     {
//       icon: <BarChart2 className="w-6 h-6" />,
//       title: "Advanced Analytics",
//       description: "Track clicks, locations, and referral sources"
//     },
//     {
//       icon: <Shield className="w-6 h-6" />,
//       title: "Secure & Reliable",
//       description: "HTTPS encryption and 99.9% uptime guarantee"
//     },
//   ];

//   return (
//     <div className="space-y-12">
//       {/* Hero Section */}
//       <div className="text-center space-y-8">
//         <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
//           <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
//             Shorten Links,
//           </span>
//           <br />
//           <span className="text-gray-800 dark:text-white">Amplify Results</span>
//         </h1>
//         <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
//           Transform long URLs into concise, memorable links. Get detailed analytics and boost your online presence.
//         </p>
//       </div>

//       {/* URL Shortener Card */}
//       <div className="glass-card rounded-3xl p-8 shadow-2xl max-w-4xl mx-auto">
//         <div className="flex items-center space-x-3 mb-6">
//           <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
//             <Link2 className="w-6 h-6 text-white" />
//           </div>
//           <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
//             Shorten Your URL
//           </h2>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="flex flex-col md:flex-row gap-4">
//             <input
//               type="url"
//               value={url}
//               onChange={(e) => setUrl(e.target.value)}
//               placeholder="Paste your long URL here..."
//               className="flex-1 px-6 py-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
//               required
//             />
//             <button
//               type="submit"
//               disabled={loading}
//               className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? (
//                 <span className="flex items-center space-x-2">
//                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                   <span>Shortening...</span>
//                 </span>
//               ) : (
//                 <span className="flex items-center space-x-2">
//                   <Zap className="w-5 h-5" />
//                   <span>Shorten URL</span>
//                 </span>
//               )}
//             </button>
//           </div>

//           {shortUrl && (
//             <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
//               <div className="flex flex-col md:flex-row items-center justify-between gap-4">
//                 <div className="flex-1">
//                   <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Your shortened URL:</p>
//                   <p className="text-lg font-mono text-blue-600 dark:text-blue-400 break-all">
//                     {shortUrl}
//                   </p>
//                 </div>
//                 <button
//                   onClick={copyToClipboard}
//                   className={`px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-all ${
//                     copied 
//                       ? 'bg-green-500 text-white' 
//                       : 'bg-blue-500 hover:bg-blue-600 text-white'
//                   }`}
//                 >
//                   {copied ? (
//                     <>
//                       <Check className="w-5 h-5" />
//                       <span>Copied!</span>
//                     </>
//                   ) : (
//                     <>
//                       <Copy className="w-5 h-5" />
//                       <span>Copy</span>
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           )}
//         </form>

//         <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
//           <p className="text-gray-600 dark:text-gray-400 text-sm">
//             By using our service, you agree to our{' '}
//             <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Terms</a>
//             {' '}and{' '}
//             <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</a>.
//           </p>
//         </div>
//       </div>

//       {/* Features Section */}
//       <div className="max-w-6xl mx-auto">
//         <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">
//           Why Choose Our Service?
//         </h2>
//         <div className="grid md:grid-cols-3 gap-8">
//           {features.map((feature, index) => (
//             <div 
//               key={index}
//               className="glass-card p-6 rounded-2xl hover:scale-105 transition-transform duration-300"
//             >
//               <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl w-fit mb-4">
//                 {feature.icon}
//               </div>
//               <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
//                 {feature.title}
//               </h3>
//               <p className="text-gray-600 dark:text-gray-400">
//                 {feature.description}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;