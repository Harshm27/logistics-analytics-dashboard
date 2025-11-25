import * as XLSX from 'xlsx';

export interface ShipmentData {
  id: string;
  collectionDate: string;
  collectionLocation: string;
  deliveryLocation: string;
  originCountry: string;
  destinationCountry: string;
  transportMode: string;
  carrier: string;
  weight: number;
  cost: number;
}

/**
 * Parse Excel file and extract shipment data
 */
export function parseExcelFile(file: File): Promise<ShipmentData[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);

        const shipments: ShipmentData[] = jsonData.map((row: any, index: number) => {
          // Flexible column mapping
          const getId = () => row['Shipment ID'] || row['Unique identifier'] || row['ID'] || `SHIP${index + 1}`;
          const getDate = () => row['Collection Date'] || row['Shipping Date'] || row['Date'] || '';
          const getCollection = () => row['Collection Location'] || row['Collection Area Name'] || row['Pickup Location'] || '';
          const getDelivery = () => row['Delivery Location'] || row['Delivery Area Name'] || row['Delivery Location'] || '';
          const getOrigin = () => row['Origin Country'] || row['Collection Country'] || '';
          const getDest = () => row['Destination Country'] || row['Delivery Country'] || '';
          const getMode = () => row['Transport Mode'] || row['Mode'] || 'Road';
          const getCarrier = () => row['Carrier'] || row['Shipper'] || 'Unknown';
          const getWeight = () => parseFloat(row['Weight (kg)'] || row['Weight'] || row['weight'] || 0);
          const getCost = () => parseFloat(row['Cost'] || row['Cost of shipment'] || row['cost'] || 0);

          return {
            id: String(getId()),
            collectionDate: String(getDate()),
            collectionLocation: String(getCollection()),
            deliveryLocation: String(getDelivery()),
            originCountry: String(getOrigin()),
            destinationCountry: String(getDest()),
            transportMode: String(getMode()),
            carrier: String(getCarrier()),
            weight: getWeight(),
            cost: getCost(),
          };
        });

        resolve(shipments);
      } catch (error) {
        reject(new Error(`Failed to parse Excel file: ${error}`));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

