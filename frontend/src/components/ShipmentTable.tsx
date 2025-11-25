import { useState } from 'react';
import { ShipmentData } from '../utils/excelParser';
import { getShippingRates, ShippingRate } from '../utils/api';

interface ShipmentTableProps {
  shipments: ShipmentData[];
}

function ShipmentTable({ shipments }: ShipmentTableProps) {
  const [selectedShipment, setSelectedShipment] = useState<ShipmentData | null>(null);
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [loadingRates, setLoadingRates] = useState(false);
  const [showRatesModal, setShowRatesModal] = useState(false);

  const handleGetRates = async (shipment: ShipmentData) => {
    setSelectedShipment(shipment);
    setLoadingRates(true);
    setShowRatesModal(true);

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
      } else {
        alert('Failed to fetch rates');
      }
    } catch (error) {
      console.error('Error fetching rates:', error);
      alert('Error fetching rates');
    } finally {
      setLoadingRates(false);
    }
  };

  if (shipments.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="text-6xl mb-4">📦</div>
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
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mode
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Carrier
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Weight (kg)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {shipments.map((shipment) => (
                <tr key={shipment.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {shipment.id}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {shipment.collectionDate}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className="text-xs">{shipment.collectionLocation}</span>
                      <span className="mx-2">→</span>
                      <span className="text-xs">{shipment.deliveryLocation}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {shipment.transportMode}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {shipment.carrier}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {shipment.weight.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    £{shipment.cost.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleGetRates(shipment)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Get Rates
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 bg-gray-50 text-sm text-gray-700">
          Showing {shipments.length} shipment{shipments.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Rates Modal */}
      {showRatesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">💰 Shipping Rates</h3>
                <button
                  onClick={() => setShowRatesModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {selectedShipment && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Route:</strong> {selectedShipment.originCountry} → {selectedShipment.destinationCountry}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Weight:</strong> {selectedShipment.weight} kg
                  </p>
                </div>
              )}

              {loadingRates ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading rates...</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {rates.map((rate, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{rate.carrier}</p>
                        <p className="text-sm text-gray-500">{rate.service}</p>
                        <p className="text-xs text-gray-400 mt-1">{rate.transit}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-600">
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

