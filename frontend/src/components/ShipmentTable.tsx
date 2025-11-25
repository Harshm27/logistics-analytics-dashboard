import { useState, useMemo } from 'react';
import { ShipmentData } from '../utils/excelParser';
import { getShippingRates, ShippingRate } from '../utils/api';
import { useToast } from '../contexts/ToastContext';
import * as XLSX from 'xlsx';

interface ShipmentTableProps {
  shipments: ShipmentData[];
}

type SortField = 'id' | 'collectionDate' | 'cost' | 'weight' | 'carrier' | 'transportMode';
type SortDirection = 'asc' | 'desc';

function ShipmentTable({ shipments }: ShipmentTableProps) {
  const [selectedShipment, setSelectedShipment] = useState<ShipmentData | null>(null);
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [loadingRates, setLoadingRates] = useState(false);
  const [showRatesModal, setShowRatesModal] = useState(false);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { showToast } = useToast();

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedShipments = useMemo(() => {
    if (!sortField) return shipments;

    return [...shipments].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'id':
          aValue = a.id.toLowerCase();
          bValue = b.id.toLowerCase();
          break;
        case 'collectionDate':
          aValue = new Date(a.collectionDate).getTime();
          bValue = new Date(b.collectionDate).getTime();
          break;
        case 'cost':
          aValue = a.cost;
          bValue = b.cost;
          break;
        case 'weight':
          aValue = a.weight;
          bValue = b.weight;
          break;
        case 'carrier':
          aValue = a.carrier.toLowerCase();
          bValue = b.carrier.toLowerCase();
          break;
        case 'transportMode':
          aValue = a.transportMode.toLowerCase();
          bValue = b.transportMode.toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [shipments, sortField, sortDirection]);

  const paginatedShipments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedShipments.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedShipments, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedShipments.length / itemsPerPage);

  const handleGetRates = async (shipment: ShipmentData) => {
    setSelectedShipment(shipment);
    setLoadingRates(true);
    setShowRatesModal(true);
    setRates([]);

    try {
      const response = await getShippingRates({
        collection_country: shipment.originCountry,
        delivery_country: shipment.destinationCountry,
        weight: shipment.weight,
        collection_postcode: shipment.collectionLocation,
        delivery_postcode: shipment.deliveryLocation,
      });

      if (response.success) {
        setRates(response.rates);
        if (response.rates.length === 0) {
          showToast('No rates found for this shipment', 'info');
        }
      } else {
        showToast('Failed to fetch rates', 'error');
      }
    } catch (error) {
      console.error('Error fetching rates:', error);
      showToast('Error fetching rates. Please check your connection.', 'error');
    } finally {
      setLoadingRates(false);
    }
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(sortedShipments.map(s => ({
      ID: s.id,
      'Collection Date': s.collectionDate,
      'Origin Country': s.originCountry,
      'Destination Country': s.destinationCountry,
      'Collection Location': s.collectionLocation,
      'Delivery Location': s.deliveryLocation,
      'Transport Mode': s.transportMode,
      Carrier: s.carrier,
      Weight: s.weight,
      Cost: s.cost,
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Shipments');
    XLSX.writeFile(wb, `shipments_${new Date().toISOString().split('T')[0]}.xlsx`);
    showToast(`Exported ${sortedShipments.length} shipments`, 'success');
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <span className="text-gray-400 ml-1">⇅</span>;
    }
    return sortDirection === 'asc' ? (
      <span className="text-blue-600 ml-1">↑</span>
    ) : (
      <span className="text-blue-600 ml-1">↓</span>
    );
  };

  if (shipments.length === 0) {
    return (
      <div className="card text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No shipments loaded
        </h3>
        <p className="text-gray-500">
          Upload an Excel file to get started
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="card overflow-hidden shadow-lg border border-gray-100">
        {/* Header with export button */}
        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50/30 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Shipments</h2>
            <p className="text-sm text-gray-600 mt-0.5">
              {sortedShipments.length} total shipment{sortedShipments.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={handleExport}
            className="btn-primary shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
          >
            Export Excel
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('id')}
                >
                  <div className="flex items-center">
                    ID
                    <SortIcon field="id" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('collectionDate')}
                >
                  <div className="flex items-center">
                    Date
                    <SortIcon field="collectionDate" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Route
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('transportMode')}
                >
                  <div className="flex items-center">
                    Mode
                    <SortIcon field="transportMode" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('carrier')}
                >
                  <div className="flex items-center">
                    Carrier
                    <SortIcon field="carrier" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('weight')}
                >
                  <div className="flex items-center">
                    Weight (kg)
                    <SortIcon field="weight" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('cost')}
                >
                  <div className="flex items-center">
                    Cost
                    <SortIcon field="cost" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedShipments.map((shipment) => (
                <tr
                  key={shipment.id}
                  className="hover:bg-blue-50/50 transition-colors"
                >
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {shipment.id}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {shipment.collectionDate}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                        {shipment.collectionLocation}
                      </span>
                      <span className="text-blue-500">→</span>
                      <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-0.5 rounded">
                        {shipment.deliveryLocation}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {shipment.transportMode}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 font-medium">
                    {shipment.carrier}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {shipment.weight.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900">
                    £{shipment.cost.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleGetRates(shipment)}
                      className="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-colors"
                    >
                      Get Rates
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedShipments.length)} of {sortedShipments.length} shipments
            </span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ««
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ‹ Prev
            </button>
            <span className="px-4 py-1.5 text-sm font-medium text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next ›
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              »»
            </button>
          </div>
        </div>
      </div>

      {/* Improved Rates Modal */}
      {showRatesModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={() => setShowRatesModal(false)}
        >
          <div
            className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl transform transition-all animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">
                Shipping Rates Comparison
              </h3>
              <button
                onClick={() => setShowRatesModal(false)}
                className="text-white hover:text-gray-200 font-bold text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {selectedShipment && (
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Route</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {selectedShipment.originCountry} → {selectedShipment.destinationCountry}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Weight</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {selectedShipment.weight} kg
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Collection</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {selectedShipment.collectionLocation}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Delivery</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {selectedShipment.deliveryLocation}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {loadingRates ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600 font-medium">Loading rates...</p>
                </div>
              ) : rates.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 font-medium">No rates available</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {rates
                    .sort((a, b) => a.price - b.price)
                    .map((rate, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-4 border-2 rounded-lg transition-all hover:shadow-md ${
                          index === 0
                            ? 'border-green-500 bg-green-50/50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-gray-900">{rate.carrier}</p>
                            {index === 0 && (
                              <span className="text-xs font-bold bg-green-500 text-white px-2 py-0.5 rounded-full">
                                BEST PRICE
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{rate.service}</p>
                          <p className="text-xs text-gray-500">{rate.transit}</p>
                        </div>
                        <div className="text-right ml-4">
                          <p className={`text-2xl font-bold ${
                            index === 0 ? 'text-green-600' : 'text-blue-600'
                          }`}>
                            £{rate.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ShipmentTable;
