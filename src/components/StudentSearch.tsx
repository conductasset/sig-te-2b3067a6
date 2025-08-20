import React, { useState } from 'react';
import { StudentService } from '../lib/services/StudentService';
import { Student } from '../types';

const StudentSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const studentService = new StudentService();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const results = await studentService.searchStudents(query);
      setStudents(results);
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Buscar Alunos</h2>
      
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Digite o nome do aluno..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
      </form>

      {searched && (
        <div>
          {loading ? (
            <div className="text-center py-4">
              <div className="text-lg">Buscando alunos...</div>
            </div>
          ) : students.length === 0 ? (
            <p className="text-gray-500">Nenhum aluno encontrado para "{query}".</p>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Resultados ({students.length} encontrado{students.length !== 1 ? 's' : ''})
              </h3>
              {students.map((student) => (
                <div key={student.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-lg">{student.name}</h4>
                      <p className="text-gray-600">Curso: {student.course}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      ID: {student.id}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentSearch;

