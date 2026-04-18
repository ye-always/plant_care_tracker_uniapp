export interface Plant {
  id: string;
  name: string;
  species?: string;
  plantedDate: string;
  imageUrl?: string;
  notes?: string;
  location?: string;
  tags?: string[];
  wateringInterval?: number; // days
  fertilizingInterval?: number; // days
}

export interface CareRecord {
  id: string;
  plantId: string;
  type: 'water' | 'fertilize' | 'prune' | 'disease' | 'pest';
  date: string;
  notes?: string;
}

export interface HealthIssue {
  id: string;
  plantId: string;
  type: 'disease' | 'pest';
  description: string;
  date: string;
  resolved: boolean;
  resolvedDate?: string;
}

export type ViewMode = 'grid' | 'list';
export type SortBy = 'name' | 'date' | 'recent-care';