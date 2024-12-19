import React from 'react';
import { useForm } from 'react-hook-form';
import { ConsumptionData } from '../types';
import { useSolarStore } from '../store/store';

export function ConsumptionForm({ onCalculate }: { onCalculate: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<ConsumptionData>();
  const setConsumptionData = useSolarStore((state) => state.setConsumptionData);

  const onSubmit = (data: ConsumptionData) => {
    setConsumptionData(data);
    onCalculate();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Consumo Promedio Mensual (kWh)
        </label>
        <input
          {...register('averageConsumption', { 
            required: 'Este campo es requerido',
            min: { value: 1, message: 'El consumo debe ser mayor a 0' }
          })}
          type="number"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.averageConsumption && (
          <p className="mt-1 text-sm text-red-600">{errors.averageConsumption.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Período de Facturación
        </label>
        <select
          {...register('billingPeriod', { required: 'Este campo es requerido' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Seleccione un período</option>
          <option value="monthly">Mensual</option>
          <option value="bimonthly">Bimestral</option>
        </select>
        {errors.billingPeriod && (
          <p className="mt-1 text-sm text-red-600">{errors.billingPeriod.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Horas de Mayor Consumo
        </label>
        <input
          {...register('peakHours', { 
            required: 'Este campo es requerido',
            min: { value: 1, message: 'Debe ser al menos 1 hora' },
            max: { value: 24, message: 'No puede ser más de 24 horas' }
          })}
          type="number"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.peakHours && (
          <p className="mt-1 text-sm text-red-600">{errors.peakHours.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Área Disponible en Techo (m²)
        </label>
        <input
          {...register('roofArea', { 
            required: 'Este campo es requerido',
            min: { value: 1, message: 'El área debe ser mayor a 0' }
          })}
          type="number"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.roofArea && (
          <p className="mt-1 text-sm text-red-600">{errors.roofArea.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tipo de Techo
        </label>
        <select
          {...register('roofType', { required: 'Este campo es requerido' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Seleccione un tipo</option>
          <option value="flat">Plano</option>
          <option value="sloped">Inclinado</option>
          <option value="tile">Teja</option>
        </select>
        {errors.roofType && (
          <p className="mt-1 text-sm text-red-600">{errors.roofType.message}</p>
        )}
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
      >
        Calcular
      </button>
    </form>
  );
}