import React, { useState, useEffect } from 'react';
import { IncidentService } from '../lib/services/IncidentService';
import { Incident } from '../types';

const IncidentList: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  const incidentService = new IncidentService();

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const data = await incidentService.getIncidents();
        setIncidents(data);
      } catch (error) {
        console.error('Erro ao buscar incidentes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg">Carregando incidentes...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Lista de Incidentes</h2>
      
      {incidents.length === 0 ? (
        <p className="text-gray-500">Nenhum incidente encontrado.</p>
      ) : (
        <div className="space-y-4">
          {incidents.map((incident) => (
            <div key={incident.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">Incidente #{incident.id}</h3>
                  <p className="text-gray-700 mt-2">{incident.description}</p>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(incident.date).toLocaleDateString('pt-BR')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IncidentList;

