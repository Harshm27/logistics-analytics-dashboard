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

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 12,
        },
      },
    },
  };

  const barChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

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
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(236, 72, 153, 1)',
        ],
        borderWidth: 2,
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
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
      },
    ],
  };

  if (shipments.length === 0) {
    return (
      <div className="card text-center py-12">
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
    <div className="space-y-4 md:space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 shadow-md hover:shadow-lg transition-shadow">
          <div>
            <p className="text-sm text-blue-600 font-semibold mb-1">Total Shipments</p>
            <p className="text-3xl font-bold text-blue-900">{stats.totalShipments}</p>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-green-50 to-green-100 border border-green-200 shadow-md hover:shadow-lg transition-shadow">
          <div>
            <p className="text-sm text-green-600 font-semibold mb-1">Total Weight</p>
            <p className="text-3xl font-bold text-green-900">
              {stats.totalWeight.toFixed(1)} <span className="text-lg">kg</span>
            </p>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 shadow-md hover:shadow-lg transition-shadow">
          <div>
            <p className="text-sm text-purple-600 font-semibold mb-1">Total Cost</p>
            <p className="text-3xl font-bold text-purple-900">
              £{stats.totalCost.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 shadow-md hover:shadow-lg transition-shadow">
          <div>
            <p className="text-sm text-orange-600 font-semibold mb-1">Avg Cost</p>
            <p className="text-3xl font-bold text-orange-900">
              £{stats.avgCost.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="card shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold mb-4 text-gray-800">
            Transport Mode Distribution
          </h3>
          <div className="h-64">
            <Pie data={modeChartData} options={chartOptions} />
          </div>
        </div>
        <div className="card shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold mb-4 text-gray-800">
            Top Carriers
          </h3>
          <div className="h-64">
            <Bar data={carrierChartData} options={barChartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;

