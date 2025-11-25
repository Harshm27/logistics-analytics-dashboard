import { useState, useEffect, useMemo } from 'react';
import { ShipmentData } from '../utils/excelParser';

interface FiltersProps {
  shipments: ShipmentData[];
  onFilterChange: (filtered: ShipmentData[]) => void;
}

function Filters({ shipments, onFilterChange }: FiltersProps) {
  const [search, setSearch] = useState('');
  const [originCountry, setOriginCountry] = useState('');
  const [destCountry, setDestCountry] = useState('');
  const [transportMode, setTransportMode] = useState('');
  const [carrier, setCarrier] = useState('');

  const filteredShipments = useMemo(() => {
    let filtered = [...shipments];

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.id.toLowerCase().includes(searchLower) ||
          s.collectionLocation.toLowerCase().includes(searchLower) ||
          s.deliveryLocation.toLowerCase().includes(searchLower) ||
          s.carrier.toLowerCase().includes(searchLower)
      );
    }

    // Country filters
    if (originCountry) {
      filtered = filtered.filter((s) => s.originCountry === originCountry);
    }
    if (destCountry) {
      filtered = filtered.filter((s) => s.destinationCountry === destCountry);
    }

    // Transport mode filter
    if (transportMode) {
      filtered = filtered.filter((s) => s.transportMode === transportMode);
    }

    // Carrier filter
    if (carrier) {
      filtered = filtered.filter((s) => s.carrier === carrier);
    }

    return filtered;
  }, [search, originCountry, destCountry, transportMode, carrier, shipments]);

  useEffect(() => {
    onFilterChange(filteredShipments);
  }, [filteredShipments, onFilterChange]);

  const uniqueCountries = Array.from(
    new Set([
      ...shipments.map((s) => s.originCountry),
      ...shipments.map((s) => s.destinationCountry),
    ])
  ).sort();

  const uniqueModes = Array.from(new Set(shipments.map((s) => s.transportMode))).sort();
  const uniqueCarriers = Array.from(new Set(shipments.map((s) => s.carrier))).sort();

  const resetFilters = () => {
    setSearch('');
    setOriginCountry('');
    setDestCountry('');
    setTransportMode('');
    setCarrier('');
  };

  const activeFiltersCount =
    (search ? 1 : 0) +
    (originCountry ? 1 : 0) +
    (destCountry ? 1 : 0) +
    (transportMode ? 1 : 0) +
    (carrier ? 1 : 0);

  const hasActiveFilters = activeFiltersCount > 0;

  return (
    <div className="card shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-800">
          Filters
        </h2>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            Clear ({activeFiltersCount})
          </button>
        )}
      </div>

      {/* Results count */}
      {hasActiveFilters && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-medium text-blue-900">
            Showing <span className="font-bold">{filteredShipments.length}</span> of{' '}
            <span className="font-bold">{shipments.length}</span> shipments
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Search
          </label>
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, location, or carrier..."
              className="input-field pl-4"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Origin Country
            </label>
            <select
              value={originCountry}
              onChange={(e) => setOriginCountry(e.target.value)}
              className={`input-field ${originCountry ? 'bg-blue-50 border-blue-300' : ''}`}
            >
              <option value="">All Countries</option>
              {uniqueCountries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Destination Country
            </label>
            <select
              value={destCountry}
              onChange={(e) => setDestCountry(e.target.value)}
              className={`input-field ${destCountry ? 'bg-blue-50 border-blue-300' : ''}`}
            >
              <option value="">All Countries</option>
              {uniqueCountries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Transport Mode
            </label>
            <select
              value={transportMode}
              onChange={(e) => setTransportMode(e.target.value)}
              className={`input-field ${transportMode ? 'bg-blue-50 border-blue-300' : ''}`}
            >
              <option value="">All Modes</option>
              {uniqueModes.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Carrier
            </label>
            <select
              value={carrier}
              onChange={(e) => setCarrier(e.target.value)}
              className={`input-field ${carrier ? 'bg-blue-50 border-blue-300' : ''}`}
            >
              <option value="">All Carriers</option>
              {uniqueCarriers.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Filters;
