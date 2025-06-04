import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { bruteService } from '../services/api';
import BruteDetails from './BruteDetails';

const BruteDetailsWrapper = () => {
  const { bruteId } = useParams();
  const [brute, setBrute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBruteDetails = async (id) => {
    try {
      setLoading(true);
      // Primero seleccionamos el bruto
      await bruteService.selectBrute(id);
      // Luego obtenemos sus datos actualizados
      const bruteData = await bruteService.getBruteById(id);
      setBrute(bruteData);
      setError(null);
    } catch (error) {
      console.error('Error fetching brute details:', error);
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
        <style jsx="true">{`
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
        <style jsx="true">{`
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

  return <BruteDetails brute={brute} />;
};

export default BruteDetailsWrapper;
