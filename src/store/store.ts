import { create } from 'zustand';
import { UserData, ConsumptionData, SolarCalculation } from '../types';

interface SolarStore {
  userData: UserData | null;
  consumptionData: ConsumptionData | null;
  solarCalculation: SolarCalculation | null;
  setUserData: (data: UserData) => void;
  setConsumptionData: (data: ConsumptionData) => void;
  setSolarCalculation: (data: SolarCalculation) => void;
}

export const useSolarStore = create<SolarStore>((set) => ({
  userData: null,
  consumptionData: null,
  solarCalculation: null,
  setUserData: (data) => set({ userData: data }),
  setConsumptionData: (data) => set({ consumptionData: data }),
  setSolarCalculation: (data) => set({ solarCalculation: data }),
}));