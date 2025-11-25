import { useMemo } from 'react';
import { ShipmentData } from '../utils/excelParser';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface AnalyticsProps {
  shipments: ShipmentData[];
}

function Analytics({ shipments }: AnalyticsProps) {
  const stats = useMemo(() => {
    const totalShipments = shipments.length;
    const totalWeight = shipments.reduce((sum, s) => sum + s.weight, 0);
    const totalCost = shipments.reduce((sum, s) => sum + s.cost, 0);
    const avgCost = totalShipments > 0 ? totalCost / totalShipments : 0;

    // Group by transport mode
    const modeCounts: Record<string, number> = {};
    shipments.forEach((s) => {
      modeCounts[s.transportMode] = (modeCounts[s.transportMode] || 0) + 1;
    });

    // Group by carrier
    const carrierCounts: Record<string, number> = {};
    shipments.forEach((s) => {
      carrierCounts[s.carrier] = (carrierCounts[s.carrier] || 0) + 1;
    });

    return {
      totalShipments,
      totalWeight,
      totalCost,
      avgCost,
      modeCounts,
      carrierCounts,
    };
  }, [shipments]);

  const modeChartData = {
    labels: Object.keys(stats.modeCounts),
    datasets: [
      {
        label: 'Shipments',
        data: Object.values(stats.modeCounts),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
        ],
      },
    ],
  };

  const carrierChartData = {
    labels: Object.keys(stats.carrierCounts).slice(0, 5),
    datasets: [
      {
        label: 'Shipments',
        data: Object.values(stats.carrierCounts).slice(0, 5),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
    ],
  };

  if (shipments.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="text-6xl mb-4">📈</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No data to analyze
        </h3>
        <p className="text-gray-500">
          Upload an Excel file to see analytics
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-blue-50">
          <p className="text-sm text-blue-600 font-medium">Total Shipments</p>
          <p className="text-2xl font-bold text-blue-900">{stats.totalShipments}</p>
        </div>
        <div className="card bg-green-50">
          <p className="text-sm text-green-600 font-medium">Total Weight</p>
          <p className="text-2xl font-bold text-green-900">
            {stats.totalWeight.toFixed(1)} kg
          </p>
        </div>
        <div className="card bg-purple-50">
          <p className="text-sm text-purple-600 font-medium">Total Cost</p>
          <p className="text-2xl font-bold text-purple-900">
            £{stats.totalCost.toFixed(2)}
          </p>
        </div>
        <div className="card bg-orange-50">
          <p className="text-sm text-orange-600 font-medium">Avg Cost</p>
          <p className="text-2xl font-bold text-orange-900">
            £{stats.avgCost.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Transport Mode Distribution</h3>
          <Pie data={modeChartData} />
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Top Carriers</h3>
          <Bar data={carrierChartData} />
        </div>
      </div>
    </div>
  );
}

export default Analytics;

