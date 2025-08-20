import React, { useState } from 'react';
import IncidentForm from './components/IncidentForm';
import IncidentList from './components/IncidentList';
import FileUpload from './components/FileUpload';
import StudentForm from './components/StudentForm';
import StudentSearch from './components/StudentSearch';
import VehicleForm from './components/VehicleForm';
import VehicleList from './components/VehicleList';

type ActiveTab = 'incidents' | 'students' | 'vehicles' | 'files';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('incidents');

  const tabs = [
    { id: 'incidents' as ActiveTab, label: 'Incidentes' },
    { id: 'students' as ActiveTab, label: 'Alunos' },
    { id: 'vehicles' as ActiveTab, label: 'Veículos' },
    { id: 'files' as ActiveTab, label: 'Arquivos' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'incidents':
        return (
          <div className="space-y-8">
            <IncidentForm />
            <IncidentList />
          </div>
        );
      case 'students':
        return (
          <div className="space-y-8">
            <StudentForm />
            <StudentSearch />
          </div>
        );
      case 'vehicles':
        return (
          <div className="space-y-8">
            <VehicleForm />
            <VehicleList />
          </div>
        );
      case 'files':
        return <FileUpload />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">SIG-TE</h1>
            <p className="text-gray-600">Sistema Integrado de Gestão de Transporte Escolar</p>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;

