import React, { useRef, useState } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';

const FileUpload = ({ onFileUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    setError(null);

    const validFiles = files.filter(file => {
      const isCSV = file.type === 'text/csv' || file.name.endsWith('.csv');
      const isTSV = file.type === 'text/tab-separated-values' || file.name.endsWith('.tsv');
      const isTXT = file.type === 'text/plain' || file.name.endsWith('.txt');

      return isCSV || isTSV || isTXT;
    });

    if (validFiles.length === 0) {
      setError('Please upload CSV, TSV, or TXT files');
      return;
    }

    if (validFiles.length !== files.length) {
      setError('Some files were skipped (only CSV/TSV/TXT supported)');
    }

    onFileUpload(validFiles);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
          transition-all duration-200
          ${isDragging
            ? 'border-primary bg-blue-50 scale-105'
            : 'border-gray-300 hover:border-primary hover:bg-gray-50'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".csv,.tsv,.txt,text/csv,text/plain,text/tab-separated-values"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-primary/10 rounded-full">
            <Upload className="w-12 h-12 text-primary" />
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Upload Bank Statements
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop your CSV files here, or click to browse
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <FileText className="w-4 h-4" />
              <span>Supports CSV, TSV, and TXT files</span>
            </div>
          </div>

          <button className="btn btn-primary mt-4">
            Choose Files
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">Supported Formats:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Most bank CSV exports (Chase, Bank of America, Wells Fargo, etc.)</li>
          <li>• Credit card statements (Discover, Capital One, Amex, etc.)</li>
          <li>• Any CSV with Date, Description, and Amount columns</li>
          <li>• Multiple files will be combined automatically</li>
        </ul>
      </div>
    </div>
  );
};

export default FileUpload;
