import { useState, useEffect } from 'react';
import FileUpload from '../components/FileUpload';
import ShipmentTable from '../components/ShipmentTable';
import MapView from '../components/MapView';
import Analytics from '../components/Analytics';
import Filters from '../components/Filters';
import { ShipmentData } from '../utils/excelParser';
import { checkHealth } from '../utils/api';

function Dashboard() {
  const [shipments, setShipments] = useState<ShipmentData[]>([]);
  const [filteredShipments, setFilteredShipments] = useState<ShipmentData[]>([]);
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [activeTab, setActiveTab] = useState<'table' | 'map' | 'analytics'>('table');

  useEffect(() => {
    // Check backend connection on mount
    checkHealth().then(setIsBackendConnected);
  }, []);

  const handleFileUpload = (data: ShipmentData[]) => {
    setShipments(data);
    setFilteredShipments(data);
  };

  const handleFilterChange = (filtered: ShipmentData[]) => {
    setFilteredShipments(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">🚚 Logistics Analytics Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">
                Analyze shipments, compare rates, and optimize logistics
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 ${isBackendConnected ? 'text-green-600' : 'text-red-600'}`}>
                <div className={`w-2 h-2 rounded-full ${isBackendConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm font-medium">
                  {isBackendConnected ? 'API Connected' : 'API Offline'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <FileUpload onUpload={handleFileUpload} />
            <Filters shipments={shipments} onFilterChange={handleFilterChange} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm mb-4">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setActiveTab('table')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 ${
                      activeTab === 'table'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    📊 Data Table
                  </button>
                  <button
                    onClick={() => setActiveTab('map')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 ${
                      activeTab === 'map'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    🗺️ Map View
                  </button>
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 ${
                      activeTab === 'analytics'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    📈 Analytics
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

