import React from 'react';
import { Brute } from '../types/brute';
import { useNavigate } from 'react-router-dom';
import Tooltip from './Tooltip';
import '../styles/BruteDetails.css';

interface BruteDetailsProps {
  brute: Brute;
}

const BruteDetails: React.FC<BruteDetailsProps> = ({ brute }) => {
  const navigate = useNavigate();

  console.log('🔍 DEBUG - BruteDetails brute completo:', brute);
  console.log('🔍 DEBUG - BruteDetails skills:', brute?.skills);
  console.log('🔍 DEBUG - BruteDetails weapons:', brute?.weapons);

  if (!brute) {
    return <div className="error-message">No se pudo cargar la información del guerrero</div>;
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
        </div>        <button 
          className="arena-button"
          onClick={() => navigate('/battle')}
        >
          ARENA
        </button>
      </div>      <div className="classic-stats">
        <h3>Estadísticas</h3>
        {brute.stats && (
          <ul className="classic-stats-list">
            <li><span className="stat-label">HP:</span> <span className="stat-value-classic">{brute.stats.hp}</span></li>
            <li><span className="stat-label">Fuerza:</span> <span className="stat-value-classic">{brute.stats.strenght}</span></li>
            <li><span className="stat-label">Agilidad:</span> <span className="stat-value-classic">{brute.stats.agility}</span></li>
            <li><span className="stat-label">Resistencia:</span> <span className="stat-value-classic">{brute.stats.endurance}</span></li>
            <li><span className="stat-label">Inteligencia:</span> <span className="stat-value-classic">{brute.stats.intelligence}</span></li>
          </ul>
        )}
      </div>

      {brute.weapons && brute.weapons.length > 0 && (
        <div className="equipment-card">
          <h3>Armas</h3>          <div className="equipment-grid">
            {brute.weapons.map((weapon) => (
              <Tooltip 
                key={weapon.id} 
                content={weapon.description || `Arma con ${weapon.min_damage}-${weapon.max_damage} de daño, ${weapon.speed}% de velocidad y ${weapon.crit_chance}% de crítico`}
                className="weapon-tooltip"
              >
                <div className="equipment-item weapon">
                  <h4>{weapon.name}</h4>
                  <div className="weapon-stats">
                    <p>Daño: {weapon.min_damage}-{weapon.max_damage}</p>
                    <p>Crítico: {weapon.crit_chance}%</p>
                    <p>Precisión: {weapon.hit_chance}%</p>
                    <p>Velocidad: {weapon.speed}</p>
                    {weapon.range > 1 && <p>Alcance: {weapon.range}</p>}
                  </div>
                </div>
              </Tooltip>
            ))}
          </div>
        </div>
      )}      {brute.skills && brute.skills.length > 0 && (
        <div className="equipment-card">
          <h3>Habilidades</h3>
          <div className="equipment-grid">
            {(() => {
              console.log('🔍 DEBUG - BruteDetails renderizando habilidades:', brute.skills);
              return brute.skills.map((skill) => (
                <div key={skill.id} className="equipment-item skill">
                  <h4>{skill.name || 'Habilidad'}</h4>
                  <p className="skill-description">{skill.description || getSkillDescription(skill)}</p>
                </div>
              ));
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default BruteDetails;
