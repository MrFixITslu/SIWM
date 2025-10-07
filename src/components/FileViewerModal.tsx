import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { CloseIcon } from '@/constants';
import * as XLSX from 'xlsx';

interface FileViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  fileData: string;
  fileType: string;
}

const FileViewerModal: React.FC<FileViewerModalProps> = ({
  isOpen,
  onClose,
  fileName,
  fileData,
  fileType,
}) => {
  const [excelData, setExcelData] = useState<any[]>([]);
  const [excelHeaders, setExcelHeaders] = useState<string[]>([]);
  const [isExcelLoading, setIsExcelLoading] = useState(false);

  useEffect(() => {
    if (isOpen && (fileName.toLowerCase().includes('.xlsx') || fileName.toLowerCase().includes('.xls'))) {
      parseExcelFile();
    }
  }, [isOpen, fileName, fileData]);

  const parseExcelFile = async () => {
    setIsExcelLoading(true);
    try {
      // Convert base64 to binary
      const binaryString = atob(fileData);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      // Parse Excel file
      const workbook = XLSX.read(bytes, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      if (jsonData.length > 0) {
        // First row as headers
        const headers = jsonData[0] as string[];
        setExcelHeaders(headers);
        
        // Rest as data rows
        const dataRows = jsonData.slice(1).map((row: unknown) => {
          const rowArray = row as any[];
          const rowData: any = {};
          headers.forEach((header, index) => {
            rowData[header] = rowArray[index] || '';
          });
          return rowData;
        });
        setExcelData(dataRows);
      }
    } catch (error) {
      console.error('Error parsing Excel file:', error);
      setExcelData([]);
      setExcelHeaders([]);
    } finally {
      setIsExcelLoading(false);
    }
  };
  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) {
      return '📄';
    } else if (type.includes('image')) {
      return '🖼️';
    } else if (type.includes('word') || type.includes('document')) {
      return '📝';
    } else if (type.includes('excel') || type.includes('spreadsheet') || fileName.toLowerCase().includes('.xlsx') || fileName.toLowerCase().includes('.xls')) {
      return '📊';
    } else {
      return '📎';
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `data:${fileType};base64,${fileData}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePdfLoad = (e: React.SyntheticEvent<HTMLIFrameElement>) => {
    const iframe = e.target as HTMLIFrameElement;
    
    // Wait a bit for PDF to load
    setTimeout(() => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (iframeDoc) {
          const body = iframeDoc.body;
          if (body) {
            // Get PDF dimensions
            const pdfWidth = iframeDoc.documentElement.scrollWidth;
            const pdfHeight = iframeDoc.documentElement.scrollHeight;
            
            // Set iframe size to match PDF
            iframe.style.width = `${pdfWidth}px`;
            iframe.style.height = `${pdfHeight}px`;
          }
        }
      } catch (error) {
        // Cross-origin restrictions may prevent access
        console.log('Cannot access iframe content for auto-sizing');
      }
    }, 1000); // Wait 1 second for PDF to fully load
  };

  const renderFileContent = () => {
    if (fileType.includes('pdf')) {
      return (
        <iframe
          src={`data:${fileType};base64,${fileData}`}
          className="w-full h-full border-0"
          title={fileName}
          onLoad={handlePdfLoad}
        />
      );
    } else if (fileType.includes('image')) {
      return (
        <img
          src={`data:${fileType};base64,${fileData}`}
          alt={fileName}
          className="w-full h-full object-contain"
        />
      );
    } else if (fileName.toLowerCase().includes('.xlsx') || fileName.toLowerCase().includes('.xls')) {
      return (
        <div className="w-full h-full overflow-auto p-4">
          {isExcelLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                <p className="text-secondary-600 dark:text-secondary-400">Loading Excel file...</p>
              </div>
            </div>
          ) : excelData.length > 0 ? (
            <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-secondary-200 dark:divide-secondary-700">
                  <thead className="bg-secondary-50 dark:bg-secondary-700">
                    <tr>
                      {excelHeaders.map((header, index) => (
                        <th
                          key={index}
                          className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-300 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-secondary-800 divide-y divide-secondary-200 dark:divide-secondary-700">
                    {excelData.map((row, rowIndex) => (
                      <tr key={rowIndex} className="hover:bg-secondary-50 dark:hover:bg-secondary-700">
                        {excelHeaders.map((header, colIndex) => (
                          <td
                            key={colIndex}
                            className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900 dark:text-secondary-100"
                          >
                            {row[header] || ''}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-6xl mb-4">📊</div>
                <p className="text-lg font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  {fileName}
                </p>
                <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-4">
                  Unable to parse Excel file
                </p>
                <button
                  onClick={handleDownload}
                  className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium"
                >
                  Download File
                </button>
              </div>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="flex items-center justify-center w-full h-full">
          <div className="text-center">
            <div className="text-6xl mb-4">{getFileIcon(fileType)}</div>
            <p className="text-lg font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              {fileName}
            </p>
            <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-4">
              This file type cannot be previewed inline
            </p>
            <button
              onClick={handleDownload}
              className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium"
            >
              Download File
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full" title="File Viewer">
      <div className="flex flex-col w-full h-[110vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-secondary-200 dark:border-secondary-700">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getFileIcon(fileType)}</span>
            <div>
              <h3 className="text-lg font-semibold text-secondary-800 dark:text-secondary-200">
                {fileName}
              </h3>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">
                {fileType}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownload}
              className="bg-secondary-100 hover:bg-secondary-200 dark:bg-secondary-700 dark:hover:bg-secondary-600 text-secondary-700 dark:text-secondary-300 px-3 py-2 rounded-lg text-sm font-medium"
              title="Download file"
            >
              Download
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-secondary-500 hover:bg-secondary-100 dark:hover:bg-secondary-700"
              title="Close file viewer"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* File Content */}
        <div className="flex-1 p-4 bg-secondary-50 dark:bg-secondary-800/50">
          {renderFileContent()}
        </div>
      </div>
    </Modal>
  );
};

export default FileViewerModal;
