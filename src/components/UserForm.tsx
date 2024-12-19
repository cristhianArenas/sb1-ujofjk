import React from 'react';
import { useForm } from 'react-hook-form';
import { UserData } from '../types';
import { useSolarStore } from '../store/store';

export function UserForm({ onNext }: { onNext: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<UserData>();
  const setUserData = useSolarStore((state) => state.setUserData);

  const onSubmit = (data: UserData) => {
    setUserData(data);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
        <input
          {...register('name', { required: 'Este campo es requerido' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Dirección</label>
        <input
          {...register('address', { required: 'Este campo es requerido' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Ciudad</label>
        <input
          {...register('city', { required: 'Este campo es requerido' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Estrato</label>
        <select
          {...register('stratum', { required: 'Este campo es requerido' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Seleccione un estrato</option>
          {[1, 2, 3, 4, 5, 6].map((stratum) => (
            <option key={stratum} value={stratum}>
              {stratum}
            </option>
          ))}
        </select>
        {errors.stratum && <p className="mt-1 text-sm text-red-600">{errors.stratum.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          {...register('email', { 
            required: 'Este campo es requerido',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Email inválido'
            }
          })}
          type="email"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Teléfono</label>
        <input
          {...register('phone', { required: 'Este campo es requerido' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
      >
        Continuar
      </button>
    </form>
  );
}