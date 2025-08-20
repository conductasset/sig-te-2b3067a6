export class IncidentService {
  // Lógica para registrar e visualizar incidentes
  async registerIncident(incidentData: any): Promise<any> {
    console.log('Registrando incidente:', incidentData);
    // Simular chamada de API ou lógica de persistência
    return { success: true, message: 'Incidente registrado com sucesso!' };
  }

  async getIncidents(): Promise<any[]> {
    console.log('Buscando incidentes...');
    // Simular chamada de API ou lógica de busca
    return [
      { id: '1', description: 'Incidente Teste 1', date: '2025-08-20' },
      { id: '2', description: 'Incidente Teste 2', date: '2025-08-19' },
    ];
  }
}


