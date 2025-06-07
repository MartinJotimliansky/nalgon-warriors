import React from 'react';
import { GiSwordman } from 'react-icons/gi';
import '../styles/ExperienceBar.css';

interface ExperienceBarProps {
  currentXp: number;
  currentLevelXp: number;
  nextLevelXp: number;
  level: number;
  canLevelUp: boolean;
  onLevelUp?: () => void;
}

const ExperienceBar: React.FC<ExperienceBarProps> = ({
  currentXp,
  currentLevelXp,
  nextLevelXp,
  level,
  canLevelUp,
  onLevelUp
}) => {
  // currentXp = experiencia actual del bruto
  // nextLevelXp = experiencia total requerida para el siguiente nivel
  // currentLevelXp = experiencia que falta para subir de nivel
  
  const expNeeded = currentLevelXp; // Experiencia que falta
  const progressPercentage = nextLevelXp > 0 ? (currentXp / nextLevelXp) * 100 : 0;  return (
    <div className="experience-bar-container">
      <div 
        className="experience-bar"
        title={`${currentXp} / ${nextLevelXp}`}
      >
        <div 
          className="experience-bar-fill" 
          style={{ width: `${Math.min(progressPercentage, 100)}%` }}
        />
      </div>
      
      <div className="experience-bar-header">
        <span className="exp-text">EXP</span>
      </div>
      
      {canLevelUp && onLevelUp && (
        <button 
          className="level-up-button"
          onClick={onLevelUp}
        >
          ¡Subir de Nivel!
        </button>
      )}
    </div>
  );
};

export default ExperienceBar;
