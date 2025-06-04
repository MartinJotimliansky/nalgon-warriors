import React, { useState } from 'react';
import { Brute } from '../types/brute';
import BattleScreen from './BattleScreen';

interface BruteDetailsProps {
  brute: Brute;
}

const BruteDetails: React.FC<BruteDetailsProps> = ({ brute }) => {
  const [showBattleScreen, setShowBattleScreen] = useState<boolean>(false);

  if (!brute) {
    return <div className="error-message">No se pudo cargar la información del guerrero</div>;
  }

  if (showBattleScreen) {
    return <BattleScreen brute={brute} onBack={() => setShowBattleScreen(false)} />;
  }

  const getSkillDescription = (skill: Brute['skills'][0]): string => {
    const { type, value } = skill.effectJson;
    
    const descriptions: Record<string, string> = {
      buff: `Aumenta el daño en ${value} al atacar`,
      heal: `Cura ${value} de HP al inicio del turno`,
      dodge: `${value}% de probabilidad de esquivar al defender`,
      counter: `Contraataca con ${value} de daño al recibir un golpe`
    };

    return descriptions[type] || `${type}: ${value}`;
  };

  return (
    <div className="brute-details">
      <div className="brute-header">
        <div className="brute-title">
          <h2>{brute.name}</h2>
          <span className="level">Nivel {brute.level}</span>
        </div>
        <button 
          className="arena-button"
          onClick={() => setShowBattleScreen(true)}
        >
          ARENA
        </button>
      </div>

      <div className="stats-card">
        <h3>Estadísticas</h3>
        {brute.stats && (
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
        )}
      </div>

      {brute.weapons && brute.weapons.length > 0 && (
        <div className="equipment-card">
          <h3>Armas</h3>
          <div className="equipment-grid">
            {brute.weapons.map((weapon) => (
              <div key={weapon.id} className="equipment-item weapon">
                <h4>{weapon.name}</h4>
                <div className="weapon-stats">
                  <p>Daño: {weapon.min_damage}-{weapon.max_damage}</p>
                  <p>Crítico: {weapon.crit_chance}%</p>
                  <p>Precisión: {weapon.hit_chance}%</p>
                  <p>Velocidad: {weapon.speed}</p>
                  {weapon.range > 1 && <p>Alcance: {weapon.range}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {brute.skills && brute.skills.length > 0 && (
        <div className="equipment-card">
          <h3>Habilidades</h3>
          <div className="equipment-grid">
            {brute.skills.map((skill) => (
              <div key={skill.id} className="equipment-item skill">
                <h4>{skill.name || 'Habilidad'}</h4>
                <p className="skill-description">{getSkillDescription(skill)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        // ...existing styles...
      `}</style>
    </div>
  );
};

export default BruteDetails;
