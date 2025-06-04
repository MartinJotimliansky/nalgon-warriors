import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bruteService } from '../services/api';

const Home = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadInitialBrute = async () => {
      try {
        const brutes = await bruteService.getAllBrutes();
        if (brutes.length > 0) {
          // Si hay brutos, buscar el seleccionado o usar el primero
          const selectedBrute = brutes.find(b => b.isSelected) || brutes[0];
          navigate(`/brutes/${selectedBrute.id}`);
        } else {
          // Si no hay brutos, ir a la página de creación
          navigate('/create-brute');
        }
      } catch (error) {
        console.error('Error loading brutes:', error);
        navigate('/create-brute');
      }
    };
    
    loadInitialBrute();
  }, [navigate]);

  return (
    <div className="loading-container">
      <div>Cargando...</div>
      <style jsx="true">{`
        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          color: #666;
          font-size: 1.2em;
        }
      `}</style>
    </div>
  );
};

export default Home;
