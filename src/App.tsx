import React, { useState } from 'react';
import { Sun } from 'lucide-react';
import { UserForm } from './components/UserForm';
import { ConsumptionForm } from './components/ConsumptionForm';
import { useSolarStore } from './store/store';
import { calculateSolarRequirements } from './utils/calculations';
import { generateReport } from './utils/pdfGenerator';

function App() {
  const [step, setStep] = useState(1);
  const { userData, consumptionData, solarCalculation, setSolarCalculation } = useSolarStore();

  const handleCalculation = () => {
    if (consumptionData) {
      const calculation = calculateSolarRequirements(consumptionData);
      setSolarCalculation(calculation);
      setStep(3);
    }
  };

  const downloadReport = () => {
    if (userData && consumptionData && solarCalculation) {
      const doc = generateReport(userData, consumptionData, solarCalculation);
      doc.save('informe-solar.pdf');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2">
            <Sun className="h-8 w-8" />
            <h1 className="text-2xl font-bold">Calculadora Solar Residencial</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                1
              </div>
              <div className={`h-1 w-16 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                2
              </div>
              <div className={`h-1 w-16 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                3
              </div>
            </div>
          </div>

          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Información Personal</h2>
              <UserForm onNext={() => setStep(2)} />
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Datos de Consumo</h2>
              <ConsumptionForm onCalculate={handleCalculation} />
            </div>
          )}

          {step === 3 && solarCalculation && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Resultados del Cálculo</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900">Paneles Solares</h3>
                  <p className="text-gray-700">{solarCalculation.panelCount} paneles de {solarCalculation.panelPower}W</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900">Inversor</h3>
                  <p className="text-gray-700">{solarCalculation.inverterSize}kW</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900">Baterías</h3>
                  <p className="text-gray-700">{solarCalculation.batteryCapacity}kWh</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900">Ahorro Anual Estimado</h3>
                  <p className="text-gray-700">{formatCurrency(solarCalculation.estimatedSavings)}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-900">Inversión Total con Baterías</h3>
                  <p className="text-blue-800 text-lg font-semibold">{formatCurrency(solarCalculation.totalCost)}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-medium text-green-900">Inversión Total sin Baterías</h3>
                  <p className="text-green-800 text-lg font-semibold">{formatCurrency(solarCalculation.totalCostWithoutBatteries)}</p>
                </div>
              </div>
              <button
                onClick={downloadReport}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Descargar Informe PDF
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;