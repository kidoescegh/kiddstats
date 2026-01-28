
export enum DataSource {
  CMC_SIGNALS = 'CMC_SIGNALS',
  OURBIT_LISTINGS = 'OURBIT_LISTINGS',
  MEXC_LISTINGS = 'MEXC_LISTINGS'
}

export interface ListingEntry {
  id: string;
  source: DataSource;
  title: string;
  symbol: string;
  timestamp: string;
  url: string;
  type?: string; // e.g., "New Listing", "Signal", "Announcement"
  rawText?: string;
}

export interface ChartDataPoint {
  date: string;
  count: number;
  source: string;
}

export interface SyncStats {
  lastSync: string | null;
  totalRecords: number;
  isSyncing: boolean;
}
