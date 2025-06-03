import React, { useState, useEffect } from 'react';
import { bruteService } from '../services/api';

const BattleScreen = ({ brute, onBack }) => {
  const [opponents, setOpponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOpponents = async () => {
      try {
        const data = await bruteService.getBruteOpponents(brute.id);
        setOpponents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadOpponents();
  }, [brute.id]);

  if (loading) return <div>Cargando oponentes...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="battle-screen">
      <button onClick={onBack} className="back-button">
        Volver
      </button>
      
      <div className="battle-layout">
        {/* Tu bruto */}
        <div className="your-brute">
          <h2>{brute.name}</h2>
          <div className="stats-card">
            <h3>Estadísticas</h3>
            {brute.stats && (
              <div className="stats-grid">
                <div className="stat">
                  <label>HP:</label>
                  <span>{brute.stats.hp}</span>
                </div>
                <div className="stat">
                  <label>Fuerza:</label>
                  <span>{brute.stats.strenght}</span>
                </div>
                <div className="stat">
                  <label>Agilidad:</label>
                  <span>{brute.stats.agility}</span>
                </div>
                <div className="stat">
                  <label>Resistencia:</label>
                  <span>{brute.stats.endurance}</span>
                </div>
                <div className="stat">
                  <label>Inteligencia:</label>
                  <span>{brute.stats.intelligence}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Oponentes */}
        <div className="opponents">
          <h2>Oponentes</h2>
          <div className="opponents-grid">
            {opponents.map((opponent) => (
              <div key={opponent.id} className="opponent-card">
                <h3>{opponent.name}</h3>
                <div className="opponent-stats">
                  <p>Nivel: {opponent.level}</p>
                  {opponent.stats && (
                    <>
                      <p>HP: {opponent.stats.hp}</p>
                      <p>Fuerza: {opponent.stats.strenght}</p>
                      <p>Agilidad: {opponent.stats.agility}</p>
                    </>
                  )}
                  <button 
                    className="fight-button"
                    onClick={() => {
                      // TODO: Implementar la lógica de batalla
                      alert('¡Batalla contra ' + opponent.name + '!');
                    }}
                  >
                    ¡Pelear!
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .battle-screen {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .back-button {
          margin-bottom: 20px;
          padding: 8px 16px;
          background-color: #6c757d;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .battle-layout {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 20px;
        }

        .your-brute {
          position: sticky;
          top: 20px;
        }

        .stats-card {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 15px;
        }

        .stat {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          background: #f8f9fa;
          border-radius: 4px;
        }

        .opponents-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
        }

        .opponent-card {
          background: white;
          border-radius: 8px;
          padding: 15px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .fight-button {
          width: 100%;
          padding: 10px;
          background-color: #dc3545;
          color: white;
          border: none;
          border-radius: 4px;
          margin-top: 10px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .fight-button:hover {
          background-color: #c82333;
        }

        h2 {
          color: #343a40;
          margin-bottom: 20px;
        }

        h3 {
          color: #495057;
          margin-bottom: 15px;
        }
      `}</style>
    </div>
  );
};

export default BattleScreen;
