"use client";

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { UploadCloud, CheckCircle, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

export default function CsvImporter() {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<Record<string, unknown>[]>([]);
  const [previewHeaders, setPreviewHeaders] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    success: boolean;
    data: Record<string, unknown>[];
    totalImported: number;
    totalSkipped: number;
  } | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      
      // Parse for preview
      Papa.parse(selectedFile, {
        header: true,
        preview: 5, // preview first 5 rows
        complete: (results) => {
          if (results.data && results.data.length > 0) {
            setPreviewHeaders(Object.keys(results.data[0] as object));
            setPreviewData(results.data as Record<string, unknown>[]);
            setStep(2);
          }
        }
      });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    maxFiles: 1
  });

  const handleConfirmImport = async () => {
    if (!file) return;
    setLoading(true);
    setStep(3);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // In production, configure API URL correctly
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Import failed');
      }

      const resultData = await response.json();
      setResults(resultData);
      setStep(4);
    } catch (error) {
      console.error(error);
      alert('An error occurred during import. Is the backend running?');
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl shadow-2xl mt-12 mb-20 text-foreground transition-all">
      
      {/* STEPS HEADER */}
      <div className="flex items-center justify-between mb-8 px-4">
        {[
          { num: 1, label: 'Upload' },
          { num: 2, label: 'Preview' },
          { num: 3, label: 'Processing' },
          { num: 4, label: 'Results' }
        ].map((s, i) => (
          <div key={s.num} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all duration-300 ${
              step >= s.num ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]' : 'bg-white/10 text-gray-400'
            }`}>
              {s.num}
            </div>
            <span className={`ml-3 font-medium hidden sm:block ${step >= s.num ? 'text-indigo-400' : 'text-gray-500'}`}>
              {s.label}
            </span>
            {i < 3 && <div className={`w-12 sm:w-20 h-px mx-4 ${step > s.num ? 'bg-indigo-500' : 'bg-white/10'}`} />}
          </div>
        ))}
      </div>

      {/* STEP 1: UPLOAD */}
      {step === 1 && (
        <div 
          {...getRootProps()} 
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-16 cursor-pointer transition-all duration-300 ${
            isDragActive ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02]' : 'border-white/20 hover:border-indigo-400 hover:bg-white/5'
          }`}
        >
          <input {...getInputProps()} />
          <UploadCloud className={`w-20 h-20 mb-6 transition-all duration-300 ${isDragActive ? 'text-indigo-400 scale-110' : 'text-gray-400'}`} />
          <h3 className="text-2xl font-bold mb-2">
            {isDragActive ? 'Drop your CSV here' : 'Drag & Drop your CSV'}
          </h3>
          <p className="text-gray-400 mb-6 text-center max-w-md">
            Upload any CSV file from Facebook, Google Ads, or your CRM. Our AI will automatically map the fields for you.
          </p>
          <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-lg transition-colors">
            Browse Files
          </button>
        </div>
      )}

      {/* STEP 2: PREVIEW */}
      {step === 2 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h3 className="text-2xl font-bold mb-1">Preview Data</h3>
              <p className="text-gray-400">File: <span className="text-indigo-400">{file?.name}</span></p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmImport}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium flex items-center shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all hover:scale-105"
              >
                Confirm & Import <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/20 backdrop-blur-md">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white/5 sticky top-0">
                <tr>
                  {previewHeaders.map(h => (
                    <th key={h} className="px-4 py-3 font-semibold text-gray-300 border-b border-white/10">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    {previewHeaders.map(h => (
                      <td key={h} className="px-4 py-3 text-gray-400">{row[h] ? String(row[h]) : '-'}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-center text-sm text-gray-500 mt-4">Showing top 5 rows for preview.</p>
        </div>
      )}

      {/* STEP 3: PROCESSING */}
      {step === 3 && (
        <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in-95 duration-500">
          <Loader2 className="w-20 h-20 text-indigo-500 animate-spin mb-8" />
          <h3 className="text-3xl font-bold mb-3">AI is processing your file</h3>
          <p className="text-gray-400 max-w-lg text-center">
            Our AI models are intelligently mapping your specific columns to GrowEasy CRM format...
          </p>
          <div className="w-64 h-2 bg-white/10 rounded-full mt-8 overflow-hidden relative">
            <div className="absolute top-0 left-0 h-full w-1/2 bg-indigo-500 rounded-full animate-[pulse_1.5s_ease-in-out_infinite] shadow-[0_0_10px_rgba(79,70,229,0.8)]"></div>
          </div>
        </div>
      )}

      {/* STEP 4: RESULTS */}
      {step === 4 && results && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-black/20 p-6 rounded-2xl border border-white/10">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mr-6">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-1 text-green-400">Import Complete</h3>
                <p className="text-gray-400">Your AI-mapped CRM records are ready.</p>
              </div>
            </div>
            
            <div className="flex gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-400">{results.totalImported}</div>
                <div className="text-sm text-gray-500">Successfully Imported</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400">{results.totalSkipped}</div>
                <div className="text-sm text-gray-500">Skipped (Invalid)</div>
              </div>
            </div>
          </div>

          <div className="flex justify-between mb-4">
            <h4 className="text-lg font-bold">Imported CRM Records</h4>
            <button 
              onClick={() => {
                setStep(1);
                setFile(null);
                setResults(null);
              }}
              className="text-sm text-indigo-400 hover:text-indigo-300"
            >
              + Import Another File
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/20 backdrop-blur-md max-h-[500px]">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white/10 sticky top-0 z-10 backdrop-blur-xl">
                <tr>
                  {Object.keys(results.data[0] || {}).map(h => (
                    <th key={h} className="px-4 py-3 font-semibold text-gray-200 border-b border-white/10">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.data.map((row, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    {Object.values(row).map((val: unknown, vi) => (
                      <td key={vi} className="px-4 py-3 text-gray-400">
                        {val ? String(val) : '-'}
                      </td>
                    ))}
                  </tr>
                ))}
                {results.data.length === 0 && (
                  <tr>
                    <td colSpan={100} className="px-4 py-8 text-center text-gray-500">
                      No records matched the criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
