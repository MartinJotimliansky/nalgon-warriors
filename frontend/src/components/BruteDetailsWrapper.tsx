import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { bruteService } from '../services/api';
import BruteDetails from './BruteDetails';
import { Brute } from '../types/brute';

const BruteDetailsWrapper = () => {
  const { bruteId } = useParams<{ bruteId: string }>();
  const [brute, setBrute] = useState<Brute | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBruteDetails = async (id: string) => {
    try {
      setLoading(true);
      const bruteIdNum = parseInt(id, 10);
      
      if (isNaN(bruteIdNum)) {
        throw new Error('ID de bruto inválido');
      }

      // Primero seleccionamos el bruto
      await bruteService.selectBrute(bruteIdNum);
      // Luego obtenemos sus datos actualizados
      const bruteData = await bruteService.getBruteById(bruteIdNum);
      setBrute(bruteData);
      setError(null);
    } catch (err) {
      console.error('Error fetching brute details:', err);
      setError('No se pudo cargar la información del guerrero');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bruteId) {
      fetchBruteDetails(bruteId);
    }
  }, [bruteId]); // Se ejecutará cada vez que cambie bruteId

  if (loading) {
    return (
      <div className="loading-container">
        <div>Cargando...</div>
        <style>{`
          .loading-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 200px;
            color: #666;
            font-size: 1.2em;
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <style>{`
          .error-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 200px;
          }
          .error-message {
            color: #dc3545;
            font-size: 1.2em;
          }
        `}</style>
      </div>
    );
  }

  if (!brute) {
    return <div>No hay bruto para mostrar</div>;
  }

  return <BruteDetails brute={brute} />;
};

export default BruteDetailsWrapper;
