import { useState } from 'react';
import { parseExcelFile, ShipmentData } from '../utils/excelParser';

interface FileUploadProps {
  onUpload: (data: ShipmentData[]) => void;
}

function FileUpload({ onUpload }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string>('');

  const handleFile = async (file: File) => {
    if (!file.name.match(/\.(xlsx|xls)$/)) {
      alert('Please upload an Excel file (.xlsx or .xls)');
      return;
    }

    setFileName(file.name);
    try {
      const data = await parseExcelFile(file);
      onUpload(data);
    } catch (error) {
      alert(`Error parsing file: ${error}`);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-4">📁 Upload Excel File</h2>
      
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleChange}
          className="hidden"
          id="file-input"
        />
        <label
          htmlFor="file-input"
          className="cursor-pointer block"
        >
          <div className="text-4xl mb-2">📄</div>
          <p className="text-sm text-gray-600 mb-2">
            Drag and drop your Excel file here
          </p>
          <p className="text-xs text-gray-500 mb-4">or</p>
          <button className="btn-primary">
            Choose File
          </button>
        </label>
      </div>

      {fileName && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-green-800">
            ✓ Loaded: <span className="font-medium">{fileName}</span>
          </p>
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-800 mb-2 font-medium">
          📥 Need sample data?
        </p>
        <a
          href="https://github.com/Harshm27/logistics-dashboard-v2/raw/main/Sample_Data.xlsx"
          download="Sample_Data.xlsx"
          className="text-xs text-blue-600 hover:underline"
        >
          Download Sample Excel File →
        </a>
      </div>
    </div>
  );
}

export default FileUpload;

