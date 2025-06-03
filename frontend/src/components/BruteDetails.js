import React, { useState } from 'react';
import BattleScreen from './BattleScreen';

const BruteDetails = ({ brute }) => {
  const [showBattleScreen, setShowBattleScreen] = useState(false);

  if (showBattleScreen) {
    return <BattleScreen brute={brute} onBack={() => setShowBattleScreen(false)} />;
  }

  return (
    <div className="brute-details">
      <div className="brute-header">
        <h2>{brute.name}</h2>
        <span className="level">Nivel {brute.level}</span>
      </div>

      <div className="stats-card">
        {brute.stats && (
          <>
            <div className="stats-header">
              <h3>Estadísticas</h3>
              <button 
                className="fight-button"
                onClick={() => setShowBattleScreen(true)}
              >
                ¡Pelear!
              </button>
            </div>
            <div className="stats-grid">
              <div className="stat">
                <label>HP:</label>
                <div className="stat-bar-container">
                  <div 
                    className="stat-bar" 
                    style={{ width: `${Math.min(100, brute.stats.hp / 2)}%` }}
                  ></div>
                  <span className="stat-value">{brute.stats.hp}</span>
                </div>
              </div>
              <div className="stat">
                <label>Fuerza:</label>
                <div className="stat-bar-container">
                  <div 
                    className="stat-bar strength" 
                    style={{ width: `${Math.min(100, brute.stats.strenght * 2)}%` }}
                  ></div>
                  <span className="stat-value">{brute.stats.strenght}</span>
                </div>
              </div>
              <div className="stat">
                <label>Agilidad:</label>
                <div className="stat-bar-container">
                  <div 
                    className="stat-bar agility" 
                    style={{ width: `${Math.min(100, brute.stats.agility * 2)}%` }}
                  ></div>
                  <span className="stat-value">{brute.stats.agility}</span>
                </div>
              </div>
              <div className="stat">
                <label>Resistencia:</label>
                <div className="stat-bar-container">
                  <div 
                    className="stat-bar endurance" 
                    style={{ width: `${Math.min(100, brute.stats.endurance * 2)}%` }}
                  ></div>
                  <span className="stat-value">{brute.stats.endurance}</span>
                </div>
              </div>
              <div className="stat">
                <label>Inteligencia:</label>
                <div className="stat-bar-container">
                  <div 
                    className="stat-bar intelligence" 
                    style={{ width: `${Math.min(100, brute.stats.intelligence * 2)}%` }}
                  ></div>
                  <span className="stat-value">{brute.stats.intelligence}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <style jsx="true">{`
        .brute-details {
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
        }

        .brute-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .level {
          font-size: 1.2em;
          color: #666;
        }

        .stats-card {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .stats-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .stats-grid {
          display: grid;
          gap: 15px;
        }

        .stat {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
        }

        .stat label {
          min-width: 100px;
          color: #666;
        }

        .stat-bar-container {
          flex-grow: 1;
          height: 24px;
          background: #f0f0f0;
          border-radius: 12px;
          position: relative;
          overflow: hidden;
        }

        .stat-bar {
          height: 100%;
          background: #4CAF50;
          border-radius: 12px;
          transition: width 0.3s ease;
        }

        .stat-bar.strength { background: #f44336; }
        .stat-bar.agility { background: #2196F3; }
        .stat-bar.endurance { background: #FF9800; }
        .stat-bar.intelligence { background: #9C27B0; }

        .stat-value {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: white;
          font-weight: bold;
          text-shadow: 1px 1px 1px rgba(0,0,0,0.3);
        }

        .fight-button {
          padding: 10px 20px;
          background-color: #dc3545;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1.1em;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .fight-button:hover {
          background-color: #c82333;
        }

        h2 {
          color: #343a40;
          margin: 0;
        }

        h3 {
          color: #495057;
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default BruteDetails;
