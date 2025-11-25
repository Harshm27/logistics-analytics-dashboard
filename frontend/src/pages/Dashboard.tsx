import { useState, useEffect } from 'react';
import FileUpload from '../components/FileUpload';
import ShipmentTable from '../components/ShipmentTable';
import MapView from '../components/MapView';
import Analytics from '../components/Analytics';
import Filters from '../components/Filters';
import { useToast } from '../contexts/ToastContext';
import { ShipmentData } from '../utils/excelParser';
import { checkHealth } from '../utils/api';

function Dashboard() {
  const [shipments, setShipments] = useState<ShipmentData[]>([]);
  const [filteredShipments, setFilteredShipments] = useState<ShipmentData[]>([]);
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [activeTab, setActiveTab] = useState<'table' | 'map' | 'analytics'>('table');
  const { showToast } = useToast();

  useEffect(() => {
    // Check backend connection on mount
    checkHealth().then((connected) => {
      setIsBackendConnected(connected);
      if (!connected) {
        showToast('Backend API is offline. Some features may not work.', 'warning');
      }
    });
  }, []);

  const handleFileUpload = (data: ShipmentData[]) => {
    setShipments(data);
    setFilteredShipments(data);
    showToast(`Successfully loaded ${data.length} shipment${data.length !== 1 ? 's' : ''}`, 'success');
  };

  const handleFilterChange = (filtered: ShipmentData[]) => {
    setFilteredShipments(filtered);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 shadow-lg border-b border-blue-800/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Logistics Analytics Dashboard</h1>
              <p className="text-xs sm:text-sm text-blue-100">
                Analyze shipments, compare rates, and optimize logistics
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-sm ${
                isBackendConnected 
                  ? 'bg-green-500/20 text-green-100 border border-green-400/30' 
                  : 'bg-red-500/20 text-red-100 border border-red-400/30'
              }`}>
                <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                  isBackendConnected ? 'bg-green-400' : 'bg-red-400'
                }`}></div>
                <span className="text-xs sm:text-sm font-medium">
                  {isBackendConnected ? 'API Connected' : 'API Offline'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Filters at Top */}
        {shipments.length > 0 && (
          <div className="mb-6">
            <Filters shipments={shipments} onFilterChange={handleFilterChange} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4 md:space-y-6">
            <FileUpload onUpload={handleFileUpload} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-lg mb-4 md:mb-6 overflow-hidden border border-gray-100">
              <div className="bg-gray-50/50 border-b border-gray-200">
                <nav className="flex -mb-px overflow-x-auto">
                  <button
                    onClick={() => setActiveTab('table')}
                    className={`px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                      activeTab === 'table'
                        ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
                    }`}
                  >
                    <span className="hidden sm:inline">Data Table</span>
                    <span className="sm:hidden">Table</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('map')}
                    className={`px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                      activeTab === 'map'
                        ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
                    }`}
                  >
                    <span className="hidden sm:inline">Map View</span>
                    <span className="sm:hidden">Map</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className={`px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                      activeTab === 'analytics'
                        ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
                    }`}
                  >
                    Analytics
                  </button>
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'table' && (
              <ShipmentTable shipments={filteredShipments} />
            )}
            {activeTab === 'map' && (
              <MapView shipments={filteredShipments} />
            )}
            {activeTab === 'analytics' && (
              <Analytics shipments={filteredShipments} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

