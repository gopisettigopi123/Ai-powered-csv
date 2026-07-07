"use client";

import React, { useState } from 'react';
import { ImportModal } from '@/components/ImportModal';
import { Upload } from 'lucide-react';

export default function LeadSourcesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="h-full flex flex-col p-8 bg-gray-50 dark:bg-black overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Lead Sources</h1>
        <p className="text-gray-500">Connect, manage, and control all your lead channels from one dashboard.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div 
          onClick={() => setIsModalOpen(true)}
          className="border border-dashed border-gray-300 dark:border-white/20 rounded-2xl p-6 flex items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-white/5 transition-colors bg-white dark:bg-white/5 shadow-sm"
        >
          <div className="flex items-center text-gray-700 dark:text-gray-200 font-medium">
            <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 flex items-center justify-center mr-4">
              <Upload className="w-5 h-5" />
            </div>
            Upload CSV / Single Lead
            <span className="ml-2 text-sm text-gray-400 font-normal">Add a new lead</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Active Lead Sources</h2>
        
        {/* Dummy Cards for UI completeness based on screenshot */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 dark:border-white/10 rounded-2xl p-6 bg-white dark:bg-white/5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4 text-xl">G</div>
                <div className="font-semibold">Google Ads</div>
              </div>
              <span className="px-3 py-1 bg-gray-100 dark:bg-white/10 rounded-full text-xs text-gray-500">Not Connected</span>
            </div>
            <button className="w-full py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
              Connect
            </button>
          </div>

          <div className="border border-gray-200 dark:border-white/10 rounded-2xl p-6 bg-white dark:bg-white/5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mr-4 text-white font-bold">f</div>
                <div className="font-semibold">Facebook Ads</div>
              </div>
              <span className="px-3 py-1 bg-gray-100 dark:bg-white/10 rounded-full text-xs text-gray-500">Not Connected</span>
            </div>
            <button className="w-full py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
              Connect
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && <ImportModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
