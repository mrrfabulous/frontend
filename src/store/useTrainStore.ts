import { create } from 'zustand';
import { Train } from '../types';
import { mockTrains } from '../data/mockData';

interface TrainState {
  trains: Train[];
  searchTrains: (from: string, to: string, date: string) => Train[];
  getTrainById: (id: string) => Train | undefined;
}

export const useTrainStore = create<TrainState>((set, get) => ({
  trains: mockTrains,
  searchTrains: (from: string, to: string, date: string) => {
    return get().trains.filter(train => 
      (!from || train.from.toLowerCase().includes(from.toLowerCase())) &&
      (!to || train.to.toLowerCase().includes(to.toLowerCase())) &&
      (!date || train.departureTime.includes(date))
    );
  },
  getTrainById: (id: string) => {
    return get().trains.find(train => train.id === id);
  }
}));