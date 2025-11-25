import { useState, useEffect } from 'react';
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

  useEffect(() => {
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

    onFilterChange(filtered);
  }, [search, originCountry, destCountry, transportMode, carrier, shipments, onFilterChange]);

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

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">🔍 Filters</h2>
        {activeFiltersCount > 0 && (
          <button
            onClick={resetFilters}
            className="text-xs text-blue-600 hover:underline"
          >
            Clear ({activeFiltersCount})
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search shipments..."
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Origin Country
          </label>
          <select
            value={originCountry}
            onChange={(e) => setOriginCountry(e.target.value)}
            className="input-field"
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Destination Country
          </label>
          <select
            value={destCountry}
            onChange={(e) => setDestCountry(e.target.value)}
            className="input-field"
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Transport Mode
          </label>
          <select
            value={transportMode}
            onChange={(e) => setTransportMode(e.target.value)}
            className="input-field"
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Carrier
          </label>
          <select
            value={carrier}
            onChange={(e) => setCarrier(e.target.value)}
            className="input-field"
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
  );
}

export default Filters;

