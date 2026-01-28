
import React, { useState, useEffect, useMemo } from 'react';
import { DataSource, ListingEntry } from './types';
import { storageService } from './services/storageService';
import SyncControl from './components/SyncControl';
import DataTable from './components/DataTable';
import Charts from './components/Charts';

const App: React.FC = () => {
  const [allData, setAllData] = useState<ListingEntry[]>([]);
  const [filter, setFilter] = useState<string>('');

  const refreshData = () => {
    setAllData(storageService.getAll());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const cmcData = useMemo(() => 
    allData.filter(d => d.source === DataSource.CMC_SIGNALS && (d.symbol.toLowerCase().includes(filter.toLowerCase()) || d.title.toLowerCase().includes(filter.toLowerCase()))),
    [allData, filter]
  );

  const mexcData = useMemo(() => 
    allData.filter(d => d.source === DataSource.MEXC_LISTINGS && (d.symbol.toLowerCase().includes(filter.toLowerCase()) || d.title.toLowerCase().includes(filter.toLowerCase()))),
    [allData, filter]
  );

  const ourbitData = useMemo(() => 
    allData.filter(d => d.source === DataSource.OURBIT_LISTINGS && (d.symbol.toLowerCase().includes(filter.toLowerCase()) || d.title.toLowerCase().includes(filter.toLowerCase()))),
    [allData, filter]
  );

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight uppercase">CRYPTO <span className="text-blue-500">SENTINEL</span></h1>
          </div>

          <div className="relative w-full max-w-xs ml-4">
            <input 
              type="text"
              placeholder="Search ticker or event..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3 top-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="space-y-8">
          {/* Sync & Stats Banner */}
          <SyncControl onSyncComplete={refreshData} />

          {/* Analytics Section */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Charts data={allData} />
            </div>
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 flex flex-col justify-center">
              <h4 className="text-slate-400 text-xs font-bold uppercase mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                Database Status
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-end border-b border-slate-700 pb-2">
                  <span className="text-sm">Global Records</span>
                  <span className="text-2xl font-bold text-white mono">{allData.length}</span>
                </div>
                <div className="flex justify-between items-end border-b border-slate-700 pb-2">
                  <span className="text-sm text-blue-400">CMC Signals</span>
                  <span className="text-xl font-bold mono">{allData.filter(d => d.source === DataSource.CMC_SIGNALS).length}</span>
                </div>
                <div className="flex justify-between items-end border-b border-slate-700 pb-2">
                  <span className="text-sm text-cyan-400">MEXC Listings</span>
                  <span className="text-xl font-bold mono">{allData.filter(d => d.source === DataSource.MEXC_LISTINGS).length}</span>
                </div>
                <div className="flex justify-between items-end border-b border-slate-700 pb-2">
                  <span className="text-sm text-purple-400">Ourbit Listings</span>
                  <span className="text-xl font-bold mono">{allData.filter(d => d.source === DataSource.OURBIT_LISTINGS).length}</span>
                </div>
              </div>
              <p className="mt-6 text-[10px] text-slate-500 leading-relaxed uppercase">
                * Configured with CMC API Key <span className="text-blue-400">141...28f</span>. 
                Intelligence layer utilizes Gemini 3.0 Pro with real-time Google Search grounding.
              </p>
            </div>
          </section>

          {/* Tables Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DataTable 
              title="Fresh CMC Signals" 
              source={DataSource.CMC_SIGNALS} 
              data={cmcData} 
            />
            <DataTable 
              title="Ourbit Announcements" 
              source={DataSource.OURBIT_LISTINGS} 
              data={ourbitData} 
            />
            <DataTable 
              title="MEXC Listings" 
              source={DataSource.MEXC_LISTINGS} 
              data={mexcData} 
            />
          </section>
        </div>
      </main>

      <footer className="mt-16 py-8 border-t border-slate-800 text-center text-slate-600 text-xs">
        <p>&copy; 2024 Crypto Sentinel Dashboard. Data parsed via AI Search Grounding.</p>
        <div className="mt-3 flex justify-center gap-6">
          <a href="https://dex.coinmarketcap.com" target="_blank" className="hover:text-blue-400 transition-colors">CoinMarketCap</a>
          <a href="https://www.ourbit.com" target="_blank" className="hover:text-blue-400 transition-colors">Ourbit</a>
          <a href="https://www.mexc.com" target="_blank" className="hover:text-blue-400 transition-colors">MEXC Global</a>
        </div>
      </footer>
    </div>
  );
};

export default App;
