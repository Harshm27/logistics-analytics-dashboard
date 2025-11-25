import { useState } from 'react';
import { parseExcelFile, ShipmentData } from '../utils/excelParser';
import { useToast } from '../contexts/ToastContext';

interface FileUploadProps {
  onUpload: (data: ShipmentData[]) => void;
}

function FileUpload({ onUpload }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const handleFile = async (file: File) => {
    if (!file.name.match(/\.(xlsx|xls)$/)) {
      showToast('Please upload an Excel file (.xlsx or .xls)', 'error');
      return;
    }

    setFileName(file.name);
    setIsLoading(true);
    try {
      const data = await parseExcelFile(file);
      onUpload(data);
    } catch (error) {
      showToast(`Error parsing file: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
      setFileName('');
    } finally {
      setIsLoading(false);
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
    <div className="card shadow-lg border border-gray-100">
      <h2 className="text-lg font-bold mb-5 text-gray-800">
        Upload Excel File
      </h2>
      
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          isDragging 
            ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 scale-[1.02] shadow-inner' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50/50'
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
          disabled={isLoading}
        />
        <label
          htmlFor="file-input"
          className={`cursor-pointer block ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-3"></div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Processing file...
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Drag and drop your Excel file here
              </p>
              <p className="text-xs text-gray-500 mb-4">or</p>
              <button 
                type="button"
                className="btn-primary shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
              >
                Choose File
              </button>
            </>
          )}
        </label>
      </div>

      {fileName && (
        <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-sm text-green-800">
              <span className="font-semibold">Loaded:</span>{' '}
              <span className="font-medium">{fileName}</span>
            </p>
          </div>
        </div>
      )}

      <div className="mt-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 shadow-sm">
        <p className="text-sm text-blue-900 mb-3 font-semibold">
          Need sample data?
        </p>
        <a
          href="https://github.com/Harshm27/logistics-analytics-dashboard/raw/main/Sample_Data.xlsx"
          download="Sample_Data.xlsx"
          className="inline-block w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-center"
        >
          Download Sample Excel File
        </a>
        <p className="text-xs text-blue-700 mt-2 text-center">
          Contains 15 example shipments to test the dashboard
        </p>
      </div>
    </div>
  );
}

export default FileUpload;

