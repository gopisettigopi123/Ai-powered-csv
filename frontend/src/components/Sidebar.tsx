"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  UploadCloud, 
  Sun, 
  Moon,
  MessageSquare,
  Phone,
  BarChart,
  Megaphone
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Generate Leads', icon: Megaphone, path: '/generate-leads' },
    { name: 'Manage Leads', icon: Users, path: '/manage-leads' },
    { name: 'Engage Leads', icon: MessageSquare, path: '/engage-leads' },
  ];

  const controlCenterItems = [
    { name: 'Team Members', icon: Users, path: '/team' },
    { name: 'Lead Sources', icon: UploadCloud, path: '/lead-sources' },
    { name: 'Ad Accounts', icon: BarChart, path: '/ads' },
    { name: 'WhatsApp Account', icon: MessageSquare, path: '/whatsapp' },
    { name: 'Tele Calling', icon: Phone, path: '/tele' },
    { name: 'CRM Fields', icon: Settings, path: '/fields' },
    { name: 'API Center', icon: Settings, path: '/api' },
  ];

  const renderNavItems = (items: typeof navItems) => {
    return items.map((item) => {
      const isActive = pathname === item.path;
      return (
        <Link 
          key={item.path} 
          href={item.path}
          className={`flex items-center px-4 py-3 mb-1 rounded-xl font-medium transition-colors ${
            isActive 
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' 
              : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5'
          }`}
        >
          <item.icon className="w-5 h-5 mr-3" />
          {item.name}
        </Link>
      );
    });
  };

  return (
    <div className="w-64 h-screen border-r border-gray-200 dark:border-white/10 bg-white dark:bg-black overflow-y-auto flex flex-col shrink-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold flex items-center mb-6 text-foreground">
          <span className="text-emerald-600 mr-2">↗</span> GrowEasy
        </h1>
        
        <div className="flex items-center p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 mb-8 cursor-pointer">
          <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold mr-3">
            VK
          </div>
          <div>
            <div className="font-semibold text-sm">VK Test</div>
            <div className="text-xs text-gray-500">OWNER</div>
          </div>
        </div>

        <div className="mb-8">
          <div className="text-xs font-bold text-gray-400 mb-4 px-4 uppercase tracking-wider">Main</div>
          <nav>{renderNavItems(navItems)}</nav>
        </div>

        <div>
          <div className="text-xs font-bold text-gray-400 mb-4 px-4 uppercase tracking-wider">Control Center</div>
          <nav>{renderNavItems(controlCenterItems)}</nav>
        </div>
      </div>
      
      <div className="mt-auto p-6 border-t border-gray-200 dark:border-white/10">
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="flex items-center w-full px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5 transition-colors"
        >
          {mounted && theme === 'dark' ? <Sun className="w-5 h-5 mr-3" /> : <Moon className="w-5 h-5 mr-3" />}
          Toggle Theme
        </button>
      </div>
    </div>
  );
}
