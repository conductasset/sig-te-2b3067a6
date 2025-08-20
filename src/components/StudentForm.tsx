import React, { useState } from 'react';
import { StudentService } from '../lib/services/StudentService';

const StudentForm: React.FC = () => {
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const studentService = new StudentService();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const studentData = { name, course };

    // Validar dados do aluno
    const isValid = await studentService.validateStudent(studentData);
    if (!isValid) {
      setMessage('Dados inválidos. Verifique se nome e curso estão preenchidos.');
      setLoading(false);
      return;
    }

    try {
      const result = await studentService.registerStudent(studentData);
      
      if (result.success) {
        setMessage(result.message);
        setName('');
        setCourse('');
      }
    } catch (error) {
      setMessage('Erro ao registrar aluno');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Registrar Aluno</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Nome
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">
            Curso
          </label>
          <input
            type="text"
            id="course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Registrando...' : 'Registrar Aluno'}
        </button>
      </form>

      {message && (
        <div className={`mt-4 p-3 rounded ${
          message.includes('sucesso') 
            ? 'bg-green-100 border border-green-400 text-green-700'
            : 'bg-red-100 border border-red-400 text-red-700'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default StudentForm;

