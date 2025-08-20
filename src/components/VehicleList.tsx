import React, { useState, useEffect } from 'react';
import { VehicleService } from '../lib/services/VehicleService';
import { Vehicle } from '../types';

const VehicleList: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  const vehicleService = new VehicleService();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await vehicleService.getVehicles();
        setVehicles(data);
      } catch (error) {
        console.error('Erro ao buscar veículos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg">Carregando veículos...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Lista de Veículos</h2>
      
      {vehicles.length === 0 ? (
        <p className="text-gray-500">Nenhum veículo encontrado.</p>
      ) : (
        <div className="space-y-4">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{vehicle.model}</h3>
                  <p className="text-gray-700 mt-1">Placa: {vehicle.plate}</p>
                </div>
                <div className="text-sm text-gray-500">
                  ID: {vehicle.id}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VehicleList;

