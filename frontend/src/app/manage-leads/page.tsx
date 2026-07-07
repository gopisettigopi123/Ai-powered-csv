"use client";

import React, { useState } from 'react';
import { 
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Search, RotateCcw } from 'lucide-react';

type Lead = {
  id: string;
  name: string;
  email: string;
  contact: string;
  dateCreated: string;
  company: string;
  status: string;
  quality: string;
};

// Mock data matching the screenshot
const defaultData: Lead[] = [
  { id: '1', name: 'punnnf g', email: 'kjgkhv2@gcghc.com', contact: '+917894561177', dateCreated: 'Jun 23, 2026, 2:37 PM', company: '-', status: 'Sale Done', quality: '-' },
  { id: '2', name: 'kjjkvkh', email: 'jkhbkbn@hjf.hfv', contact: '+911212121415', dateCreated: 'Jun 23, 2026, 12:23 PM', company: 'fhtf', status: 'Not Dialed', quality: '-' },
  { id: '3', name: 'kugkkh', email: 'jgjg@hgdh.hjc', contact: '+911212121217', dateCreated: 'Jun 23, 2026, 12:17 PM', company: 'fhtf', status: 'Not Dialed', quality: '-' },
  { id: '4', name: 'hjvjv', email: 'jfgf@fgd.com', contact: '+911515151515', dateCreated: 'Jun 23, 2026, 12:16 PM', company: 'fhtf', status: 'Good Lead', quality: '-' },
  { id: '5', name: 'Abhraneel Dhar', email: 'abhraneeldhar7@growe...', contact: '+919051589728', dateCreated: 'Jun 23, 2026, 11:01 AM', company: 'groweasy', status: 'Good Lead', quality: '-' },
  { id: '6', name: 'fhjf ghf', email: 'tjrf.ft@gfjj.com', contact: '+911414141414', dateCreated: 'Jun 22, 2026, 4:49 PM', company: 'thr rh', status: 'Not Dialed', quality: '-' },
  { id: '7', name: 'fht', email: 'gnhfg@fgjf.com', contact: '+911313131313', dateCreated: 'Jun 22, 2026, 4:48 PM', company: 'fhtf', status: 'Not Dialed', quality: '-' },
];

const columnHelper = createColumnHelper<Lead>();

const columns = [
  columnHelper.accessor('name', {
    header: 'LEAD NAME',
    cell: info => <span className="font-medium text-gray-900 dark:text-gray-100">{info.getValue()}</span>,
  }),
  columnHelper.accessor('email', {
    header: 'EMAIL',
  }),
  columnHelper.accessor('contact', {
    header: 'CONTACT',
  }),
  columnHelper.accessor('dateCreated', {
    header: 'DATE CREATED',
  }),
  columnHelper.accessor('company', {
    header: 'COMPANY',
  }),
  columnHelper.accessor('status', {
    header: 'STATUS',
    cell: info => {
      const val = info.getValue();
      let colorClass = 'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-400';
      if (val === 'Sale Done') colorClass = 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400';
      if (val === 'Good Lead') colorClass = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400';
      
      return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}>
          {val}
        </span>
      );
    }
  }),
  columnHelper.accessor('quality', {
    header: 'QUALITY',
  }),
  columnHelper.display({
    id: 'actions',
    header: 'ACTIONS',
    cell: () => (
      <button className="text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center text-sm font-medium">
        <span className="mr-1">P</span> More <span className="ml-1 text-xs">›</span>
      </button>
    )
  })
];

import { useVirtualizer } from '@tanstack/react-virtual';

export default function ManageLeadsPage() {
  const [data, setData] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/leads');
        if (response.ok) {
          const rawLeads = await response.json();
          const formattedLeads: Lead[] = rawLeads.map((l: any) => ({
            id: l._id,
            name: l.name || '-',
            email: l.email || '-',
            contact: l.mobile_without_country_code ? `${l.country_code || ''} ${l.mobile_without_country_code}`.trim() : '-',
            dateCreated: new Date(l.createdAt || l.created_at).toLocaleString(),
            company: l.company || '-',
            status: l.crm_status || 'Not Dialed',
            quality: l.description || '-'
          }));
          setData(formattedLeads);
        } else {
          console.error('Failed to fetch leads');
        }
      } catch (error) {
        console.error('Error fetching leads:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeads();
  }, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 65, // Estimated row height
    overscan: 5,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
  const paddingBottom = virtualRows.length > 0
    ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0)
    : 0;

  return (
    <div className="h-full flex flex-col p-8 bg-gray-50 dark:bg-black overflow-hidden">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Manage Your Leads</h1>
        <p className="text-gray-500">Monitor lead status, assign tasks, and close deals faster.</p>
      </div>

      <div className="flex-1 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {/* Table Header Controls */}
        <div className="p-4 border-b border-gray-200 dark:border-white/10 flex justify-between items-center bg-white dark:bg-transparent">
          <h2 className="text-lg font-bold">Your Leads ({rows.length})</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Enter email or phone number..." 
                className="pl-4 pr-10 py-2 border border-gray-200 dark:border-white/20 rounded-lg text-sm w-64 bg-gray-50 dark:bg-black focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
              <div className="absolute right-0 top-0 h-full w-10 bg-emerald-600 rounded-r-lg flex items-center justify-center text-white">
                <Search className="w-4 h-4" />
              </div>
            </div>
            <button className="w-9 h-9 border border-gray-200 dark:border-white/20 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-50 dark:hover:bg-white/10">
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table Body */}
        <div className="flex-1 overflow-auto" ref={tableContainerRef}>
          <table className="w-full text-sm text-left">
            <thead className="bg-white dark:bg-black sticky top-0 border-b border-gray-200 dark:border-white/10 z-10">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="px-6 py-4 text-xs font-bold text-gray-500 tracking-wider uppercase">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                    Loading leads...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                    No leads found. Upload a CSV to get started.
                  </td>
                </tr>
              ) : (
                <>
                  {paddingTop > 0 && (
                    <tr><td style={{ height: `${paddingTop}px` }} /></tr>
                  )}
                  {virtualRows.map(virtualRow => {
                    const row = rows[virtualRow.index];
                    return (
                      <tr 
                        key={row.id} 
                        className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                        ref={rowVirtualizer.measureElement}
                        data-index={virtualRow.index}
                      >
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id} className="px-6 py-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                  {paddingBottom > 0 && (
                    <tr><td style={{ height: `${paddingBottom}px` }} /></tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
