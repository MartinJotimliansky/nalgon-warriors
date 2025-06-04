import React, { useState, useEffect } from 'react';
import { bruteService } from '../services/api';
import { Brute } from '../types/brute';
import FightScreen from './FightScreen';

interface BattleScreenProps {
  brute: Brute;
  onBack: () => void;
}

const BattleScreen: React.FC<BattleScreenProps> = ({ brute, onBack }) => {
  const [opponents, setOpponents] = useState<Brute[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOpponent, setSelectedOpponent] = useState<Brute | null>(null);
  const [isFighting, setIsFighting] = useState<boolean>(false);

  useEffect(() => {
    const loadOpponents = async () => {
      try {
        const data = await bruteService.getBruteOpponents(brute.id);
        setOpponents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar oponentes');
      } finally {
        setLoading(false);
      }
    };

    loadOpponents();
  }, [brute.id]);

  if (loading) {
    return <div>Cargando oponentes...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      {isFighting && selectedOpponent && (
        <FightScreen
          brute={brute}
          opponent={selectedOpponent}
          onClose={() => {
            setIsFighting(false);
            setSelectedOpponent(null);
          }}
        />
      )}
      <div className="battle-screen">
        <button onClick={onBack} className="back-button">
          Volver
        </button>
        
        <div className="battle-layout">          <div className="your-brute">
            <div className="brute-header">
              <img
                src={`https://robohash.org/${brute.id.toString()}?set=2&size=200x200`}
                alt={brute.name}
                className="brute-avatar"
              />
              <h2>{brute.name}</h2>
            </div>
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

          <div className="opponents">
            <h2>Oponentes</h2>
            <div className="opponents-grid">
              {opponents.map((opponent) => (                <div key={opponent.id} className="opponent-card">
                  <div className="opponent-image">
                    <img 
                      src={`https://robohash.org/${opponent.id}?set=2&size=150x150`} 
                      alt={opponent.name}
                      className="opponent-avatar"
                    />
                  </div>
                  <div className="opponent-stats">
                    <h3>{opponent.name}</h3>
                    <p className="opponent-level">Nivel {opponent.level}</p>
                    {opponent.stats && (
                      <div className="opponent-stats-grid">
                        <div className="opponent-stat">
                          <span className="stat-label">HP:</span>
                          <span className="stat-value">{opponent.stats.hp}</span>
                        </div>
                        <div className="opponent-stat">
                          <span className="stat-label">Fuerza:</span>
                          <span className="stat-value">{opponent.stats.strenght}</span>
                        </div>
                        <div className="opponent-stat">
                          <span className="stat-label">Agilidad:</span>
                          <span className="stat-value">{opponent.stats.agility}</span>
                        </div>
                        <div className="opponent-stat">
                          <span className="stat-label">Resistencia:</span>
                          <span className="stat-value">{opponent.stats.endurance}</span>
                        </div>
                        <div className="opponent-stat">
                          <span className="stat-label">Inteligencia:</span>
                          <span className="stat-value">{opponent.stats.intelligence}</span>
                        </div>
                      </div>
                    )}
                    <button 
                      className="fight-button"
                      onClick={async () => {
                        try {
                          setSelectedOpponent(opponent);
                          setIsFighting(true);
                          const result = await bruteService.initiateFight(brute.id, opponent.id);
                          console.log('Fight result:', result);
                        } catch (err) {
                          setError(err instanceof Error ? err.message : 'Error al iniciar batalla');
                        }
                      }}
                    >
                      ¡Pelear!
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>        <style>{`
          .battle-screen {
            padding: 20px;
            color: white;
          }

          .back-button {
            background-color: #2c3e50;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin-bottom: 20px;
            font-size: 16px;
          }

          .back-button:hover {
            background-color: #34495e;
          }

          .battle-layout {
            display: grid;
            grid-template-columns: 300px 1fr;
            gap: 20px;
          }          .your-brute {
            background-color: rgba(44, 62, 80, 0.9);
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .brute-header {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 20px;
          }

          .brute-avatar {
            width: 200px;
            height: 200px;
            border-radius: 10px;
            margin-bottom: 15px;
            background-color: rgba(52, 73, 94, 0.8);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
          }

          .your-brute h2 {
            color: #fff;
            margin-bottom: 15px;
            font-size: 24px;
            text-align: center;
          }

          .stats-card {
            background-color: rgba(52, 73, 94, 0.8);
            padding: 15px;
            border-radius: 8px;
          }

          .stats-card h3 {
            color: #fff;
            margin-bottom: 15px;
          }

          .stats-grid {
            display: grid;
            gap: 10px;
          }

          .stat {
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .stat label {
            color: #ecf0f1;
            min-width: 100px;
          }

          .stat span {
            color: #3498db;
            font-weight: bold;
          }

          .opponents {
            padding: 20px;
          }

          .opponents h2 {
            color: #fff;
            margin-bottom: 20px;
            font-size: 24px;
          }

          .opponents-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
            gap: 20px;
          }          .opponent-card {
            background-color: rgba(44, 62, 80, 0.9);
            border-radius: 10px;
            overflow: hidden;
            display: grid;
            grid-template-columns: 150px 1fr;
            display: grid;
            grid-template-columns: 150px 1fr;
            gap: 15px;
          }

          .opponent-image {
            background-color: rgba(52, 73, 94, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }

          .opponent-image img {
            width: 100%;
            height: auto;
            max-height: 150px;
            object-fit: contain;
          }          .opponent-image {
            padding: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: rgba(52, 73, 94, 0.8);
          }

          .opponent-avatar {
            width: 130px;
            height: 130px;
            border-radius: 8px;
          }

          .opponent-stats {
            padding: 15px;
          }

          .opponent-stats h3 {
            color: #fff;
            margin: 0 0 5px 0;
            font-size: 20px;
          }

          .opponent-level {
            color: #3498db;
            margin: 0 0 15px 0;
            font-weight: bold;
          }

          .opponent-stats-grid {
            display: grid;
            gap: 8px;
          }

          .opponent-stat {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .stat-label {
            color: #ecf0f1;
          }

          .stat-value {
            color: #3498db;
            font-weight: bold;
          }

          .fight-button {
            background-color: #e74c3c;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 10px;
            font-weight: bold;
            transition: background-color 0.2s;
          }

          .fight-button:hover {
            background-color: #c0392b;
          }
        `}</style>
      </div>
    </>
  );
};

export default BattleScreen;
