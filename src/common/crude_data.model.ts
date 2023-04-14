export interface CrudeData {
  dataset: {
    id: number;
    dataset_code: string;
    database_code: string;
    name: string;
    description: string;
    refreshed_at: string;
    newest_available_date: string;
    oldest_available_date: string;
    column_names: string[];
    frequency: string;
    type: string;
    premium: boolean;
    limit: null | number;
    transform: null;
    column_index: null;
    start_date: string;
    end_date: string;
    data: [string, number][];
  };
}
