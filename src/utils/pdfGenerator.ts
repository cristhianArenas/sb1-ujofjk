import { jsPDF } from 'jspdf';
import { UserData, ConsumptionData, SolarCalculation } from '../types';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function generateReport(
  userData: UserData,
  consumptionData: ConsumptionData,
  calculation: SolarCalculation
) {
  const doc = new jsPDF();
  let y = 20;
  
  // Header
  doc.setFontSize(20);
  doc.text('Informe de Factibilidad Solar', 20, y);
  
  // User Information
  y += 30;
  doc.setFontSize(12);
  doc.text('Información del Cliente:', 20, y);
  y += 10;
  doc.text(`Nombre: ${userData.name}`, 30, y);
  y += 10;
  doc.text(`Dirección: ${userData.address}`, 30, y);
  y += 10;
  doc.text(`Ciudad: ${userData.city}`, 30, y);
  y += 10;
  doc.text(`Estrato: ${userData.stratum}`, 30, y);
  
  // Consumption Data
  y += 20;
  doc.text('Datos de Consumo:', 20, y);
  y += 10;
  doc.text(`Consumo Promedio: ${consumptionData.averageConsumption} kWh`, 30, y);
  y += 10;
  doc.text(`Período de Facturación: ${consumptionData.billingPeriod === 'monthly' ? 'Mensual' : 'Bimestral'}`, 30, y);
  y += 10;
  doc.text(`Área de Techo Disponible: ${consumptionData.roofArea} m²`, 30, y);
  y += 10;
  doc.text(`Tipo de Techo: ${
    {
      flat: 'Plano',
      sloped: 'Inclinado',
      tile: 'Teja'
    }[consumptionData.roofType]
  }`, 30, y);
  
  // System Specifications
  y += 20;
  doc.text('Especificaciones del Sistema:', 20, y);
  y += 10;
  doc.text(`Número de Paneles: ${calculation.panelCount}`, 30, y);
  y += 10;
  doc.text(`Potencia por Panel: ${calculation.panelPower}W`, 30, y);
  y += 10;
  doc.text(`Potencia Total Instalada: ${(calculation.panelCount * calculation.panelPower / 1000).toFixed(2)}kWp`, 30, y);
  
  // Panel Configuration
  y += 20;
  doc.text('Configuración de Paneles:', 20, y);
  y += 10;
  doc.text(`• Número de strings: ${calculation.panelConfiguration.stringsCount}`, 30, y);
  y += 10;
  doc.text(`• Paneles por string: ${calculation.panelConfiguration.panelsPerString}`, 30, y);
  y += 10;
  doc.text(`• Voltaje por string: ${calculation.panelConfiguration.stringVoltage.toFixed(1)}V`, 30, y);
  y += 10;
  doc.text(`• Corriente total: ${calculation.panelConfiguration.totalCurrent.toFixed(1)}A`, 30, y);

  // Cost Breakdown
  doc.addPage();
  y = 20;
  doc.text('Desglose de Costos:', 20, y);
  
  // Equipment Costs
  y += 20;
  doc.text('1. Equipos:', 20, y);
  y += 10;
  doc.text(`• Paneles Solares: ${formatCurrency(calculation.costBreakdown.equipment.panels)}`, 30, y);
  y += 10;
  doc.text(`• Inversor: ${formatCurrency(calculation.costBreakdown.equipment.inverter)}`, 30, y);
  y += 10;
  doc.text(`• Sistema de Baterías: ${formatCurrency(calculation.costBreakdown.equipment.batteries)}`, 30, y);
  y += 10;
  doc.text(`• Sistema de Montaje: ${formatCurrency(calculation.costBreakdown.equipment.mountingSystem)}`, 30, y);
  y += 10;
  doc.text(`• Protecciones Eléctricas: ${formatCurrency(calculation.costBreakdown.equipment.protections)}`, 30, y);
  y += 10;
  doc.text(`• Sistema de Monitoreo: ${formatCurrency(calculation.costBreakdown.equipment.monitoring)}`, 30, y);

  // Materials Costs
  y += 20;
  doc.text('2. Materiales:', 20, y);
  y += 10;
  doc.text(`• Cableado: ${formatCurrency(calculation.costBreakdown.materials.cables)}`, 30, y);
  y += 10;
  doc.text(`• Tubería y Canalización: ${formatCurrency(calculation.costBreakdown.materials.conduits)}`, 30, y);
  y += 10;
  doc.text(`• Conectores: ${formatCurrency(calculation.costBreakdown.materials.connectors)}`, 30, y);
  y += 10;
  doc.text(`• Sistema de Puesta a Tierra: ${formatCurrency(calculation.costBreakdown.materials.groundingSystem)}`, 30, y);

  // Labor Costs
  y += 20;
  doc.text('3. Mano de Obra:', 20, y);
  y += 10;
  doc.text(`• Instalación: ${formatCurrency(calculation.costBreakdown.labor.installation)}`, 30, y);
  y += 10;
  doc.text(`• Diseño e Ingeniería: ${formatCurrency(calculation.costBreakdown.labor.design)}`, 30, y);
  y += 10;
  doc.text(`• Permisos: ${formatCurrency(calculation.costBreakdown.labor.permits)}`, 30, y);
  y += 10;
  doc.text(`• Inspección: ${formatCurrency(calculation.costBreakdown.labor.inspection)}`, 30, y);

  // Equipment Specifications
  doc.addPage();
  y = 20;
  doc.text('Especificaciones Técnicas de Equipos:', 20, y);

  // Panel Specs
  y += 20;
  doc.text('1. Paneles Solares:', 20, y);
  calculation.equipmentSpecs.panelSpecs.forEach(spec => {
    y += 10;
    doc.text(`• ${spec}`, 30, y);
  });

  // Inverter Specs
  y += 20;
  doc.text('2. Inversor:', 20, y);
  calculation.equipmentSpecs.inverterSpecs.forEach(spec => {
    y += 10;
    doc.text(`• ${spec}`, 30, y);
  });

  // Battery Specs
  y += 20;
  doc.text('3. Sistema de Baterías:', 20, y);
  calculation.equipmentSpecs.batterySpecs.forEach(spec => {
    y += 10;
    doc.text(`• ${spec}`, 30, y);
  });

  // Protection Specs
  y += 20;
  doc.text('4. Sistema de Protecciones:', 20, y);
  calculation.equipmentSpecs.protectionSpecs.forEach(spec => {
    y += 10;
    doc.text(`• ${spec}`, 30, y);
  });

  // Law 1715 Benefits
  doc.addPage();
  y = 20;
  doc.text('Beneficios Tributarios - Ley 1715 de 2024:', 20, y);
  y += 20;
  doc.text('1. Deducción del 50% de la inversión en la declaración de renta,', 30, y);
  y += 10;
  doc.text('   distribuida en los siguientes 15 años.', 30, y);
  y += 20;
  doc.text('2. Exclusión del IVA en equipos y servicios.', 30, y);
  y += 20;
  doc.text('3. Exención de aranceles para equipos importados.', 30, y);
  y += 20;
  doc.text('4. Depreciación acelerada de los activos.', 30, y);
  
  return doc;
}