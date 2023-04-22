import { CrudeData } from 'src/common';

export const getCrudeDataStub = (): CrudeData => ({
  dataset: {
    id: 123,
    dataset_code: 'CRUDE',
    database_code: 'FRED',
    name: 'Crude Oil Prices: Brent - Europe',
    description: 'Brent crude oil prices: spot prices from EIA',
    refreshed_at: '2021-09-01T00:00:00.000Z',
    newest_available_date: '2021-08-31',
    oldest_available_date: '1987-05-20',
    column_names: ['Date', 'Price'],
    frequency: 'daily',
    type: 'Time Series',
    premium: false,
    limit: null,
    transform: null,
    column_index: null,
    start_date: '1987-05-20',
    end_date: '2021-08-31',
    data: [
      ['2021-08-31', 72.61],
      ['2021-08-30', 73.03],
    ],
  },
});
