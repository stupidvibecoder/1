import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Sun, Moon, TrendingUp, TrendingDown, AlertCircle, Calendar, Bell, Star, StarOff } from 'lucide-react';

// Mock API function to simulate real data fetching
const fetchEconomicData = async (indicator) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const mockData = {
    cpi: {
      data: [
        { date: 'Jan 2024', value: 3.1, consensus: 3.0 },
        { date: 'Feb 2024', value: 3.2, consensus: 3.1 },
        { date: 'Mar 2024', value: 3.5, consensus: 3.3 },
        { date: 'Apr 2024', value: 3.4, consensus: 3.4 },
        { date: 'May 2024', value: 3.3, consensus: 3.2 },
        { date: 'Jun 2024', value: 3.0, consensus: 3.1 }
      ],
      latest: 3.0,
      previous: 3.3,
      consensus: 3.1,
      signal: 'positive',
      commentary: 'CPI came in below expectations at 3.0%, showing continued disinflation. This is positive for risk assets as it reduces pressure on Fed policy.',
      lastUpdated: '2024-06-15T08:30:00Z'
    },
    unemployment: {
      data: [
        { date: 'Jan 2024', value: 3.7, consensus: 3.8 },
        { date: 'Feb 2024', value: 3.9, consensus: 3.7 },
        { date: 'Mar 2024', value: 3.8, consensus: 3.9 },
        { date: 'Apr 2024', value: 3.9, consensus: 3.8 },
        { date: 'May 2024', value: 4.0, consensus: 3.9 },
        { date: 'Jun 2024', value: 4.0, consensus: 4.0 }
      ],
      latest: 4.0,
      previous: 4.0,
      consensus: 4.0,
      signal: 'neutral',
      commentary: 'Unemployment held steady at 4.0%, matching expectations. Labor market remains resilient but showing signs of gradual cooling.',
      lastUpdated: '2024-06-07T08:30:00Z'
    },
    fedRate: {
      data: [
        { date: 'Jan 2024', value: 5.25, consensus: 5.25 },
        { date: 'Mar 2024', value: 5.25, consensus: 5.25 },
        { date: 'May 2024', value: 5.25, consensus: 5.25 },
        { date: 'Jun 2024', value: 5.25, consensus: 5.00 }
      ],
      latest: 5.25,
      previous: 5.25,
      consensus: 5.00,
      signal: 'negative',
      commentary: 'Fed held rates at 5.25%, above market expectations for a cut. Hawkish stance may pressure growth stocks in the near term.',
      lastUpdated: '2024-06-12T14:00:00Z'
    },
    gdp: {
      data: [
        { date: 'Q1 2023', value: 2.6, consensus: 2.4 },
        { date: 'Q2 2023', value: 2.1, consensus: 2.3 },
        { date: 'Q3 2023', value: 4.9, consensus: 4.5 },
        { date: 'Q4 2023', value: 3.4, consensus: 3.2 },
        { date: 'Q1 2024', value: 1.6, consensus: 2.0 }
      ],
      latest: 1.6,
      previous: 3.4,
      consensus: 2.0,
      signal: 'negative',
      commentary: 'Q1 GDP growth disappointed at 1.6% vs 2.0% expected. Slower growth may support case for rate cuts but weighs on cyclical stocks.',
      lastUpdated: '2024-04-25T08:30:00Z'
    }
  };
  
  return mockData[indicator];
};

// Signal indicator component
function SignalIndicator({ signal }) {
  const getSignalColor = () => {
    switch(signal) {
      case 'positive': return 'text-green-500';
      case 'negative': return 'text-red-500';
      default: return 'text-yellow-500';
    }
  };

  const getSignalIcon = () => {
    switch(signal) {
      case 'positive': return <TrendingUp className="w-4 h-4" />;
      case 'negative': return <TrendingDown className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className={`flex items-center gap-1 ${getSignalColor()}`}>
      {getSignalIcon()}
      <span className="text-sm font-medium capitalize">{signal}</span>
    </div>
  );
}

// Enhanced chart card with real data structure
function EnhancedChartCard({ title, indicatorKey, isWatched, onToggleWatch }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const result = await fetchEconomicData(indicatorKey);
        setData(result);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [indicatorKey]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
          <div className="h-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const isPositiveChange = data.latest > data.previous;
  const changeColor = isPositiveChange ? 'text-green-500' : 'text-red-500';
  const changeIcon = isPositiveChange ? '↗' : '↘';

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
        <div className="flex items-center gap-2">
          <SignalIndicator signal={data.signal} />
          <button 
            onClick={() => onToggleWatch(indicatorKey)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
          >
            {isWatched ? 
              <Star className="w-4 h-4 text-yellow-500 fill-current" /> : 
              <StarOff className="w-4 h-4 text-gray-400" />
            }
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {data.latest}%
          </span>
          <span className={`text-sm font-medium ${changeColor}`}>
            {changeIcon} {Math.abs(data.latest - data.previous).toFixed(1)}
          </span>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          vs {data.consensus}% consensus • Updated {new Date(data.lastUpdated).toLocaleDateString()}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data.data}>
          <XAxis 
            dataKey="date" 
            stroke="currentColor" 
            fontSize={12}
            className="text-gray-600 dark:text-gray-400"
          />
          <YAxis 
            stroke="currentColor" 
            fontSize={12}
            className="text-gray-600 dark:text-gray-400"
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--tooltip-bg)', 
              border: '1px solid var(--tooltip-border)',
              borderRadius: '8px',
              color: 'var(--tooltip-text)'
            }}
            formatter={(value, name) => [`${value}%`, name === 'value' ? 'Actual' : name]}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="consensus"
            stroke="#9ca3af"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300">{data.commentary}</p>
      </div>
    </div>
  );
}

// Market snapshot component
function MarketSnapshot() {
  const snapshots = [
    { label: 'S&P 500', value: '5,431.60', change: '+0.8%', positive: true },
    { label: '10Y Treasury', value: '4.42%', change: '-0.05%', positive: false },
    { label: 'VIX', value: '12.8', change: '-1.2', positive: false },
  ];

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 mb-6 border border-blue-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Market Snapshot</h2>
      <div className="grid grid-cols-3 gap-4">
        {snapshots.map((item, index) => (
          <div key={index} className="text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400">{item.label}</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">{item.value}</div>
            <div className={`text-sm font-medium ${item.positive ? 'text-green-500' : 'text-red-500'}`}>
              {item.change}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Upcoming events component
function UpcomingEvents() {
  const events = [
    { date: 'Jun 20', time: '8:30 AM', event: 'Jobless Claims', consensus: '220K', importance: 'medium' },
    { date: 'Jun 21', time: '10:00 AM', event: 'Existing Home Sales', consensus: '4.1M', importance: 'low' },
    { date: 'Jun 26', time: '8:30 AM', event: 'GDP (Final)', consensus: '1.3%', importance: 'high' },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-blue-500" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Events</h2>
      </div>
      <div className="space-y-3">
        {events.map((event, index) => (
          <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white">{event.event}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  event.importance === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                  event.importance === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}>
                  {event.importance}
                </span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {event.date} at {event.time} • Consensus: {event.consensus}
              </div>
            </div>
            <Bell className="w-4 h-4 text-gray-400 hover:text-blue-500 cursor-pointer" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Main App component
export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [watchlist, setWatchlist] = useState(new Set(['cpi', 'unemployment']));

  const indicators = [
    { id: 'cpi', title: 'Consumer Price Index (CPI)', key: 'cpi' },
    { id: 'unemployment', title: 'Unemployment Rate', key: 'unemployment' },
    { id: 'fedRate', title: 'Federal Funds Rate', key: 'fedRate' },
    { id: 'gdp', title: 'GDP Growth (QoQ)', key: 'gdp' },
  ];

  const toggleWatch = (indicatorKey) => {
    const newWatchlist = new Set(watchlist);
    if (newWatchlist.has(indicatorKey)) {
      newWatchlist.delete(indicatorKey);
    } else {
      newWatchlist.add(indicatorKey);
    }
    setWatchlist(newWatchlist);
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    // Set CSS custom properties for tooltip styling
    document.documentElement.style.setProperty('--tooltip-bg', darkMode ? '#374151' : '#ffffff');
    document.documentElement.style.setProperty('--tooltip-border', darkMode ? '#4b5563' : '#e5e7eb');
    document.documentElement.style.setProperty('--tooltip-text', darkMode ? '#f9fafb' : '#111827');
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-blue-500" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">EconDashboard</h1>
            </div>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {darkMode ? 
                <Sun className="w-5 h-5 text-yellow-500" /> : 
                <Moon className="w-5 h-5 text-gray-600" />
              }
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Market Snapshot */}
        <MarketSnapshot />
        
        {/* Economic Indicators Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {indicators.map((indicator) => (
            <EnhancedChartCard
              key={indicator.id}
              title={indicator.title}
              indicatorKey={indicator.key}
              isWatched={watchlist.has(indicator.key)}
              onToggleWatch={toggleWatch}
            />
          ))}
        </div>

        {/* Upcoming Events */}
        <div className="max-w-md">
          <UpcomingEvents />
        </div>
      </main>
    </div>
  );
}
