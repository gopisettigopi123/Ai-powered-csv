"use client";

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { Upload, X, FileSpreadsheet, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ImportModalProps {
  onClose: () => void;
}

export function ImportModal({ onClose }: ImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [previewHeaders, setPreviewHeaders] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      
      Papa.parse(selectedFile, {
        header: true,
        preview: 5,
        complete: (results) => {
          if (results.data && results.data.length > 0) {
            setPreviewHeaders(Object.keys(results.data[0] as object));
            setPreviewData(results.data);
          }
        }
      });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    maxFiles: 1
  });

  const handleUpload = async () => {
    if (!file) return;
    setIsProcessing(true);
    
    const formData = new FormData();
    formData.append('file', file);

    toast.info('Starting AI CSV Processing. This may take a moment...', { duration: 5000 });

    try {
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('API Error');
      }

      const result = await response.json();
      toast.success(`Successfully imported ${result.totalImported} leads! Skipped ${result.totalSkipped}.`);
      onClose(); // Close modal on success
      
      // In a real app we'd trigger a refetch of the leads table here using a store or context
    } catch (error) {
      console.error(error);
      toast.error('Failed to import leads. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-white/10 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold mb-1">Import Leads via CSV</h2>
            <p className="text-sm text-gray-500">Upload a CSV file to bulk import leads into your system.</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {!file ? (
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' : 'border-gray-300 dark:border-white/20 hover:bg-gray-50 dark:hover:bg-white/5'
              }`}
            >
              <input {...getInputProps()} />
              <div className="w-12 h-12 rounded-full border border-emerald-200 bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 flex items-center justify-center mb-4">
                <Upload className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-1">Drop your CSV file here</h3>
              <p className="text-sm text-gray-500 mb-6">or click to browse files</p>
              
              <div className="text-xs text-gray-400 mb-6">
                <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-white/10 rounded mr-2">Supported file: .csv (max 5MB)</span>
              </div>
              
              <p className="text-xs text-gray-400 max-w-md mx-auto mb-6">
                Required headers: created_at, name, email, country_code, mobile_without_country_code, company, city, state, country, lead_owner, crm_status, crm_note. Template includes default + custom CRM fields to reduce upload errors.
              </p>
              
              <button className="flex items-center text-sm font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-500/20 px-4 py-2 rounded-lg">
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Download Sample CSV Template
              </button>
            </div>
          ) : (
            <div className="animate-in fade-in">
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-white/10 rounded-xl mb-6 bg-gray-50 dark:bg-white/5">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 rounded-lg flex items-center justify-center mr-3">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{file.name}</div>
                    <div className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</div>
                  </div>
                </div>
                <button onClick={() => setFile(null)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-x-auto border border-gray-200 dark:border-white/10 rounded-xl">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 dark:bg-white/5 text-gray-500 text-xs uppercase font-semibold">
                    <tr>
                      {previewHeaders.map((h, i) => (
                        <th key={i} className="px-4 py-3 border-b border-gray-200 dark:border-white/10">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, i) => (
                      <tr key={i} className="border-b border-gray-100 dark:border-white/5 last:border-0 hover:bg-gray-50 dark:hover:bg-white/5">
                        {previewHeaders.map((h, j) => (
                          <td key={j} className="px-4 py-3 text-gray-700 dark:text-gray-300">
                            {row[h] ? String(row[h]) : '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 dark:border-white/10 flex justify-between bg-gray-50 dark:bg-[#1a1a1a]">
          <button 
            onClick={onClose}
            disabled={isProcessing}
            className="px-6 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 font-medium hover:bg-gray-100 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleUpload}
            disabled={!file || isProcessing}
            className="px-6 py-2.5 rounded-xl bg-[#ff8c69] hover:bg-[#ff7a52] text-white font-semibold shadow-md flex items-center transition-colors disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing AI...
              </>
            ) : (
              'Upload File'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
