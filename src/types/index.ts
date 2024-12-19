export interface UserData {
  name: string;
  address: string;
  city: string;
  stratum: number;
  email: string;
  phone: string;
}

export interface ConsumptionData {
  averageConsumption: number;
  billingPeriod: string;
  peakHours: number;
  roofArea: number;
  roofType: string;
}

export interface CostBreakdown {
  equipment: {
    panels: number;
    inverter: number;
    batteries: number;
    mountingSystem: number;
    protections: number;
    monitoring: number;
  };
  materials: {
    cables: number;
    conduits: number;
    connectors: number;
    groundingSystem: number;
  };
  labor: {
    installation: number;
    design: number;
    permits: number;
    inspection: number;
  };
}

export interface PanelConfiguration {
  stringsCount: number;
  panelsPerString: number;
  stringVoltage: number;
  totalCurrent: number;
}

export interface SolarCalculation {
  panelCount: number;
  panelPower: number;
  inverterSize: number;
  batteryCapacity: number;
  cableLength: number;
  estimatedSavings: number;
  totalCost: number;
  totalCostWithoutBatteries: number;
  costBreakdown: CostBreakdown;
  panelConfiguration: PanelConfiguration;
  equipmentSpecs: {
    panelSpecs: string[];
    inverterSpecs: string[];
    batterySpecs: string[];
    protectionSpecs: string[];
  };
}