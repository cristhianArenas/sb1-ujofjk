import { ConsumptionData, SolarCalculation, CostBreakdown, PanelConfiguration } from '../types';

const COLOMBIA_SOLAR_CONSTANTS = {
  averageSunHours: 5.5,
  panelEfficiency: 0.185,
  systemLosses: 0.14,
  panelPower: 550,
  panelArea: 2.2,
  energyCost: 650,
  // Costos de equipos
  panelCost: 1200000,
  inverterCostPerKw: 1500000,
  batteryCostPerKwh: 2000000,
  mountingCostPerPanel: 200000,
  protectionsCostPerKw: 300000,
  monitoringSystemCost: 2500000,
  // Costos de materiales (ajustados para sistema conectado a red)
  cableCostPerMeter: 25000,
  conduitCostPerMeter: 15000,
  connectorCostPerPanel: 50000,
  groundingSystemBaseCost: 500000, // Reducido ya que se aprovecha el sistema existente
  // Costos de mano de obra
  installationCostPerPanel: 150000,
  designCostBase: 2000000,
  permitsCost: 1500000,
  inspectionCost: 1000000,
};

function calculatePanelConfiguration(panelCount: number, panelPower: number): PanelConfiguration {
  const nominalVoltage = 48;
  const panelVoltage = 37.5;
  const panelCurrent = panelPower / panelVoltage;
  
  const maxPanelsPerString = Math.floor(600 / panelVoltage);
  const panelsPerString = Math.min(maxPanelsPerString, Math.ceil(Math.sqrt(panelCount)));
  const stringsCount = Math.ceil(panelCount / panelsPerString);
  
  return {
    stringsCount,
    panelsPerString,
    stringVoltage: panelVoltage * panelsPerString,
    totalCurrent: panelCurrent * stringsCount
  };
}

function calculateCostBreakdown(
  panelCount: number,
  inverterSize: number,
  batteryCapacity: number,
  roofArea: number
): CostBreakdown {
  // Calculamos la longitud del cableado para sistema conectado a red
  // Solo necesitamos cablear desde el techo hasta el inversor y al panel principal
  const estimatedHeight = 3; // Altura promedio de un piso
  const distanciaAlTablero = 5; // Distancia promedio al tablero principal
  const cableLength = Math.ceil(roofArea * 0.5 + estimatedHeight + distanciaAlTablero);

  const equipment = {
    panels: panelCount * COLOMBIA_SOLAR_CONSTANTS.panelCost,
    inverter: inverterSize * COLOMBIA_SOLAR_CONSTANTS.inverterCostPerKw,
    batteries: batteryCapacity * COLOMBIA_SOLAR_CONSTANTS.batteryCostPerKwh,
    mountingSystem: panelCount * COLOMBIA_SOLAR_CONSTANTS.mountingCostPerPanel,
    protections: inverterSize * COLOMBIA_SOLAR_CONSTANTS.protectionsCostPerKw,
    monitoring: COLOMBIA_SOLAR_CONSTANTS.monitoringSystemCost
  };

  const materials = {
    cables: cableLength * COLOMBIA_SOLAR_CONSTANTS.cableCostPerMeter,
    conduits: cableLength * COLOMBIA_SOLAR_CONSTANTS.conduitCostPerMeter,
    connectors: panelCount * COLOMBIA_SOLAR_CONSTANTS.connectorCostPerPanel,
    groundingSystem: COLOMBIA_SOLAR_CONSTANTS.groundingSystemBaseCost
  };

  const labor = {
    installation: panelCount * COLOMBIA_SOLAR_CONSTANTS.installationCostPerPanel,
    design: COLOMBIA_SOLAR_CONSTANTS.designCostBase,
    permits: COLOMBIA_SOLAR_CONSTANTS.permitsCost,
    inspection: COLOMBIA_SOLAR_CONSTANTS.inspectionCost
  };

  return { equipment, materials, labor };
}

export function calculateSolarRequirements(data: ConsumptionData): SolarCalculation {
  const monthlyConsumption = data.billingPeriod === 'bimonthly' 
    ? data.averageConsumption / 2 
    : data.averageConsumption;

  const dailyConsumption = monthlyConsumption / 30;
  const requiredDailyEnergy = dailyConsumption * 1.1;

  const dailyEnergyPerPanel = COLOMBIA_SOLAR_CONSTANTS.panelPower * 
    COLOMBIA_SOLAR_CONSTANTS.averageSunHours * 
    (1 - COLOMBIA_SOLAR_CONSTANTS.systemLosses) / 1000;

  const panelCount = Math.ceil(requiredDailyEnergy / dailyEnergyPerPanel);
  const requiredArea = panelCount * COLOMBIA_SOLAR_CONSTANTS.panelArea;
  const adjustedPanelCount = data.roofArea < requiredArea 
    ? Math.floor(data.roofArea / COLOMBIA_SOLAR_CONSTANTS.panelArea)
    : panelCount;

  const inverterSize = Math.ceil((adjustedPanelCount * COLOMBIA_SOLAR_CONSTANTS.panelPower * 1.2) / 1000);
  const batteryCapacity = Math.ceil(dailyConsumption * 1.2);

  // Cálculos financieros
  const annualProduction = adjustedPanelCount * dailyEnergyPerPanel * 365;
  const estimatedSavings = Math.floor(annualProduction * COLOMBIA_SOLAR_CONSTANTS.energyCost);

  // Configuración de paneles
  const panelConfiguration = calculatePanelConfiguration(adjustedPanelCount, COLOMBIA_SOLAR_CONSTANTS.panelPower);

  // Desglose de costos actualizado para sistema conectado a red
  const costBreakdown = calculateCostBreakdown(
    adjustedPanelCount,
    inverterSize,
    batteryCapacity,
    data.roofArea
  );

  // Cálculo de costos totales
  const totalCostWithoutBatteries = Math.floor(
    Object.values(costBreakdown.equipment).reduce((acc, val) => acc + val, 0) +
    Object.values(costBreakdown.materials).reduce((acc, val) => acc + val, 0) +
    Object.values(costBreakdown.labor).reduce((acc, val) => acc + val, 0) -
    costBreakdown.equipment.batteries
  );

  const totalCost = Math.floor(
    Object.values(costBreakdown.equipment).reduce((acc, val) => acc + val, 0) +
    Object.values(costBreakdown.materials).reduce((acc, val) => acc + val, 0) +
    Object.values(costBreakdown.labor).reduce((acc, val) => acc + val, 0)
  );

  // Especificaciones técnicas recomendadas
  const equipmentSpecs = {
    panelSpecs: [
      'Tecnología: Monocristalino PERC',
      'Eficiencia: ≥ 20%',
      'Tolerancia de potencia: 0/+5W',
      'Certificaciones: IEC 61215, IEC 61730',
      'Garantía de producción: 25 años',
      'Garantía de producto: 12 años'
    ],
    inverterSpecs: [
      `Potencia nominal: ${inverterSize}kW`,
      'Eficiencia: ≥ 98%',
      'Protección IP65 o superior',
      'Monitoreo integrado',
      'Garantía: 10 años',
      'Certificaciones: IEC 62109-1/2',
      'Compatible con red bidireccional'
    ],
    batterySpecs: [
      'Tecnología: Litio-Ion LFP',
      `Capacidad total: ${batteryCapacity}kWh`,
      'Profundidad de descarga: 90%',
      'Ciclos de vida: >6000',
      'Garantía: 10 años',
      'Sistema BMS integrado'
    ],
    protectionSpecs: [
      'Protecciones DC: Clase II',
      'Protecciones AC: Tipo 1+2',
      'Monitoreo de aislamiento',
      'Protección anti-isla',
      'Seccionadores DC/AC',
      'Sistema de puesta a tierra',
      'Medidor bidireccional'
    ]
  };

  return {
    panelCount: adjustedPanelCount,
    panelPower: COLOMBIA_SOLAR_CONSTANTS.panelPower,
    inverterSize,
    batteryCapacity,
    cableLength: Math.ceil(data.roofArea * 0.5 + 8), // Longitud aproximada para sistema grid-tied
    estimatedSavings,
    totalCost,
    totalCostWithoutBatteries,
    costBreakdown,
    panelConfiguration,
    equipmentSpecs
  };
}