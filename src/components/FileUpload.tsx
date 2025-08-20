import React, { useState } from 'react';
import { DriveService } from '../lib/services/DriveService';

const FileUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const driveService = new DriveService();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setMessage('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Por favor, selecione um arquivo');
      return;
    }

    setUploading(true);
    setMessage('');

    try {
      const result = await driveService.uploadFile(selectedFile);
      if (result.success) {
        setMessage(result.message);
        setSelectedFile(null);
        // Reset the file input
        const fileInput = document.getElementById('file-input') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      }
    } catch (error) {
      setMessage('Erro ao fazer upload do arquivo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Upload de Arquivo</h2>
      
      <div className="mb-4">
        <label htmlFor="file-input" className="block text-sm font-medium text-gray-700 mb-2">
          Selecionar Arquivo
        </label>
        <input
          id="file-input"
          type="file"
          onChange={handleFileSelect}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {selectedFile && (
        <div className="mb-4 p-3 bg-gray-100 rounded-md">
          <p className="text-sm text-gray-700">
            <strong>Arquivo selecionado:</strong> {selectedFile.name}
          </p>
          <p className="text-sm text-gray-500">
            Tamanho: {(selectedFile.size / 1024).toFixed(2)} KB
          </p>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!selectedFile || uploading}
        className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 disabled:opacity-50"
      >
        {uploading ? 'Enviando...' : 'Fazer Upload'}
      </button>

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

export default FileUpload;

