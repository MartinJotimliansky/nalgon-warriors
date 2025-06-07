import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { bruteService, fightService, levelService } from '../services/api';
import { staticDataManager } from '../services/staticDataManager';
import { Brute, Skill } from '../types/brute';
import ExperienceBar from './ExperienceBar';
import LevelUp from './LevelUp';
import Tooltip from './Tooltip';
import '../styles/OpponentSelection.css';
// Importar iconos para los stats
import { FaHeart, FaDumbbell, FaBolt, FaStar, FaFire, FaSnowflake, FaShieldAlt } from 'react-icons/fa';
import { GiSwordman, GiBrain, GiShield, GiRunningShoe, GiMagicSwirl, GiHealthPotion, GiLightningArc, GiIceBolt, GiFireBomb, GiSpeedometer } from 'react-icons/gi';
// Importar iconos específicos de game-icons.net para habilidades
import { 
    GiBullseye, GiRocket, GiShieldReflect, GiNightSleep, GiFlax, 
    GiMegaphone, GiMeditation, GiArmorUpgrade, GiRegeneration, GiMagicShield,
    GiSwordSmithing, GiBrain as GiTacticalMind, GiVampireDracula, GiPunchBlast,
    GiHeartBottle, GiStunGrenade, GiLightningBow, GiAngelWings, GiMagicGate,
    GiSpoon, GiCrossMark, GiWerewolf, GiTornado, GiBirdClaw, GiHourglass,
    GiCrown, GiLightningStorm, GiSoulVessel, GiSwordClash, GiWarAxe,
    GiMuscleUp, GiStoneBlock, GiBoxingGlove, GiInjustice, GiLightningTrio,
    GiAura, GiVortex, GiCage, GiFeatheredWing, GiHelmet, GiGhost
} from 'react-icons/gi';

interface FightHistory {
    id: number;
    attacker: Brute;
    defender: Brute;
    winner: Brute;
}

interface LevelInfo {
    currentXp: number;
    level: number;
    currentLevelXp: number;
    nextLevelXp: number;
    progressPercentage: number;
    canLevelUp: boolean;
    blockedFromCombat: boolean;
}

interface StatBarProps {
    icon: React.ReactNode;
    value: number;
    maxValue?: number;
    statName: string;
}

const StatBar: React.FC<StatBarProps> = ({ icon, value, maxValue = 20, statName }) => (
    <div className="stat-bar" title={`${statName}: ${value}`}>
        <div className="stat-icon">{icon}</div>
        <div className="stat-bar-bg">
            <div
                className="stat-bar-fill"
                style={{ width: `${(value / maxValue) * 100}%` }}
            />
        </div>
    </div>
);

const OpponentSelection: React.FC = () => {
    const [selectedBrute, setSelectedBrute] = useState<Brute | null>(null);
    const [levelInfo, setLevelInfo] = useState<LevelInfo | null>(null);
    const [opponents, setOpponents] = useState<Brute[]>([]);
    const [fightHistory, setFightHistory] = useState<FightHistory[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [showLevelUpModal, setShowLevelUpModal] = useState<boolean>(false);    const [allSkills, setAllSkills] = useState<any[]>([]);
    const [skillsLoading, setSkillsLoading] = useState<boolean>(false);
    const navigate = useNavigate();    // Helper function to get skill icon component using game-icons.net icons
    const getSkillIconComponent = (skillName: string) => {
        if (!skillName) return <GiMagicSwirl />;
        
        const name = skillName.toLowerCase();
        // Mapeo específico para cada habilidad basado en game-icons.net
        if (name.includes('golpe certero') || name.includes('certero')) return <GiBullseye />;
        if (name.includes('contraataque') || name.includes('veloz')) return <GiSwordClash />;
        if (name.includes('bloqueo') || name.includes('perfecto')) return <GiShieldReflect />;
        if (name.includes('esquiva') || name.includes('sombría')) return <GiNightSleep />;
        if (name.includes('grito') || name.includes('guerra')) return <GiWarAxe />;
        if (name.includes('intimidación')) return <GiMegaphone />;
        if (name.includes('concentración') || name.includes('mental')) return <GiMeditation />;
        if (name.includes('piel') || name.includes('hierro')) return <GiStoneBlock />;
        if (name.includes('regeneración')) return <GiRegeneration />;
        if (name.includes('escudo') || name.includes('mágico')) return <GiMagicShield />;
        if (name.includes('maestría') || name.includes('marcial')) return <GiSwordSmithing />;
        if (name.includes('mente') || name.includes('táctica')) return <GiTacticalMind />;
        if (name.includes('absorción') || name.includes('vital')) return <GiVampireDracula />;
        if (name.includes('combo') || name.includes('devastador')) return <GiBoxingGlove />;
        if (name.includes('adrenalina')) return <GiMuscleUp />;
        if (name.includes('aturdidor')) return <GiStunGrenade />;
        if (name.includes('rayo') || name.includes('cegador')) return <GiLightningTrio />;
        if (name.includes('curación') || name.includes('divina')) return <GiAngelWings />;
        if (name.includes('barrera') || name.includes('arcana')) return <GiAura />;
        if (name.includes('drenar') || name.includes('energía')) return <GiVortex />;
        if (name.includes('fortuna') || name.includes('guerrero')) return <GiCrossMark />;
        if (name.includes('berserker') || name.includes('salvaje')) return <GiCage />;
        if (name.includes('tormenta') || name.includes('acero')) return <GiTornado />;
        if (name.includes('segunda') || name.includes('oportunidad')) return <GiFeatheredWing />;
        if (name.includes('furia') || name.includes('imparable')) return <GiCage />;
        if (name.includes('velocidad') || name.includes('sobrenatural')) return <GiSpeedometer />;
        if (name.includes('phoenix') || name.includes('renacido')) return <GiFeatheredWing />;
        if (name.includes('maestro') || name.includes('tiempo')) return <GiHourglass />;
        if (name.includes('señor') || name.includes('guerra')) return <GiHelmet />;
        if (name.includes('dios') || name.includes('tormenta')) return <GiLightningStorm />;
        if (name.includes('alma') || name.includes('inmortal')) return <GiGhost />;
          return <GiMagicSwirl />; // Default icon
    };    // Helper function to check if brute has a specific skill
    const bruteHasSkill = (skillId: number): boolean => {
        const hasSkill = selectedBrute?.skills?.some(skill => skill.id === skillId) || false;
        if (hasSkill) {
            console.log(`🔍 DEBUG - Brute tiene la habilidad ${skillId}:`, selectedBrute?.skills?.find(skill => skill.id === skillId));
        }
        return hasSkill;
    };const loadSkills = async () => {
        try {
            setSkillsLoading(true);
            const skillsData = await staticDataManager.getSkills();
            console.log('🔍 DEBUG - Skills cargadas desde static data:', skillsData);
            setAllSkills(skillsData);
        } catch (error) {
            console.error('Error loading skills:', error);
        } finally {
            setSkillsLoading(false);
        }
    };

    const loadInitialData = useCallback(async () => {
        setLoading(true);        try {
            // Load skills in parallel with other data
            loadSkills();
            
            // First try to get current brute from sessionStorage (cached by Header)
            const cachedBrute = sessionStorage.getItem('currentSelectedBrute');
            const cachedOpponents = sessionStorage.getItem('bruteOpponents');
            const cachedHistory = sessionStorage.getItem('fightHistory');
            const cachedLevelInfo = sessionStorage.getItem('bruteLevelInfo');
            
            let currentBrute = null;
              if (cachedBrute) {
                currentBrute = JSON.parse(cachedBrute);
                console.log('🎯 OpponentSelection: Using cached brute from Header');
                console.log('🔍 DEBUG - Brute completo:', currentBrute);
                console.log('🔍 DEBUG - Habilidades del bruto:', currentBrute?.skills);
                console.log('🔍 DEBUG - Stats del bruto:', currentBrute?.stats);
                console.log('🔍 DEBUG - Level del bruto:', currentBrute?.level);
                console.log('🔍 DEBUG - XP del bruto:', currentBrute?.xp);
                setSelectedBrute(currentBrute);
                
                // If we have all cached data, use it and skip API calls
                if (cachedOpponents && cachedHistory && cachedLevelInfo) {
                    console.log('🎯 OpponentSelection: Using all cached data, skipping API calls');
                    console.log('🔍 DEBUG - Level info cached:', JSON.parse(cachedLevelInfo));
                    setOpponents(JSON.parse(cachedOpponents));
                    setFightHistory(JSON.parse(cachedHistory));
                    setLevelInfo(JSON.parse(cachedLevelInfo));
                    return;
                }
            } else {
                // Only make API call if no cached brute exists
                console.log('⚠️ OpponentSelection: No cached brute found, fetching from API');
                currentBrute = await bruteService.getCurrentSelectedBrute();
                setSelectedBrute(currentBrute);
                sessionStorage.setItem('currentSelectedBrute', JSON.stringify(currentBrute));
            }
              if (currentBrute) {
                // Load opponents data, history and level info in parallel
                const [opponentsList, historyData, bruteLevelInfo] = await Promise.all([
                    bruteService.getBruteOpponents(currentBrute.id),
                    fightService.getFightHistory(currentBrute.id),
                    levelService.getBruteLevelInfo(currentBrute.id)
                ]);
                
                const limitedHistory = historyData.slice(0, 6); // Últimos 6 combates
                
                setOpponents(opponentsList);
                setFightHistory(limitedHistory);
                setLevelInfo(bruteLevelInfo);
                
                // Cache the data
                sessionStorage.setItem('bruteOpponents', JSON.stringify(opponentsList));
                sessionStorage.setItem('fightHistory', JSON.stringify(limitedHistory));
                sessionStorage.setItem('bruteLevelInfo', JSON.stringify(bruteLevelInfo));
                
                console.log('💾 OpponentSelection: Cached fresh data');            }
            
            // Load skills data
            await loadSkills();
        } catch (error) {
            console.error('Error loading data:', error);
            navigate('/login');
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    // Separate function to reload data without changing selected brute
    const reloadOpponentData = async () => {
        if (!selectedBrute) return;
        
        try {
            const [opponentsList, historyData, bruteLevelInfo] = await Promise.all([
                bruteService.getBruteOpponents(selectedBrute.id),
                fightService.getFightHistory(selectedBrute.id),
                levelService.getBruteLevelInfo(selectedBrute.id)
            ]);
            
            setOpponents(opponentsList);
            setFightHistory(historyData.slice(0, 6));
            setLevelInfo(bruteLevelInfo);
        } catch (error) {
            console.error('Error reloading opponent data:', error);
        }
    };    useEffect(() => {
        // Only load initial data on first mount or when navigating to this route
        loadInitialData();
    }, [loadInitialData]); // Remove location.key dependency to prevent reloads on refresh    // Listen for brute selection changes from Header
    useEffect(() => {
        const handleBruteChange = (event: any) => {
            console.log('🔄 OpponentSelection: Brute change detected, clearing cache and reloading data...');
            
            // Clear all cache to ensure fresh data
            sessionStorage.removeItem('bruteOpponents');
            sessionStorage.removeItem('fightHistory');
            sessionStorage.removeItem('bruteLevelInfo');
            
            // Force reload of all data
            loadInitialData();
        };

        window.addEventListener('bruteUpdated', handleBruteChange);
        return () => window.removeEventListener('bruteUpdated', handleBruteChange);
    }, [loadInitialData]);

    const handleLevelUp = () => {
        if (!selectedBrute || !levelInfo?.canLevelUp) return;
        setShowLevelUpModal(true);
    };    const handleLevelUpComplete = async (result: any) => {
        setShowLevelUpModal(false);
        console.log('Level up result:', result);
        // Reload only the necessary data (level info and opponent data)
        await reloadOpponentData();
    };

    const handleLevelUpCancel = () => {
        setShowLevelUpModal(false);
    };

    const handleFightClick = (opponentId: number): void => {
        // Block combat if brute can level up
        if (levelInfo?.blockedFromCombat) {
            alert('¡Tu bruto debe subir de nivel antes de continuar combatiendo!');
            return;
        }
        navigate(`/battle?opponentId=${opponentId}`);
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (!selectedBrute) {
        return <div>No tienes un bruto seleccionado</div>;
    }

    return (
        <div className="opponent-selection">
            <div className="battle-layout">
                {/* Tu bruto */}
                <div className="your-brute">                    <div className="brute-header">
                        <div className="avatar-container">
                            <img src={`https://robohash.org/${selectedBrute?.id.toString()}?set=2&size=180x180`} alt="Avatar" className="brute-avatar" />
                        </div>
                        <h2>{selectedBrute?.name || ''}</h2>
                        <div className="brute-hp">
                            <FaHeart /> {selectedBrute?.stats?.hp || 0}
                        </div>
                        
                        {/* Experience Bar */}
                        {levelInfo && (
                            <ExperienceBar
                                currentXp={levelInfo.currentXp}
                                currentLevelXp={levelInfo.currentLevelXp}
                                nextLevelXp={levelInfo.nextLevelXp}
                                level={levelInfo.level}
                                canLevelUp={levelInfo.canLevelUp}
                                onLevelUp={handleLevelUp}
                            />
                        )}
                    </div>                {selectedBrute?.stats && (
                        <div className="stats-grid">
                            <StatBar icon={<FaDumbbell />} value={selectedBrute.stats.strenght} statName="Fuerza" />
                            <StatBar icon={<GiShield />} value={selectedBrute.stats.endurance} statName="Resistencia" />
                            <StatBar icon={<GiRunningShoe />} value={selectedBrute.stats.agility} statName="Agilidad" />
                            <StatBar icon={<GiBrain />} value={selectedBrute.stats.intelligence} statName="Inteligencia" />
                        </div>
                    )}                    {/* Skills section */}
                    <div className="skills-section">
                        <h3>Habilidades Disponibles</h3>
                        {skillsLoading ? (
                            <div className="loading-text">Cargando habilidades...</div>
                        ) : (
                            <div className="skills-grid">
                                {(() => {
                                    console.log('🔍 DEBUG - Renderizando habilidades. Total:', allSkills.length);
                                    console.log('🔍 DEBUG - allSkills:', allSkills);
                                    return allSkills.map((skill) => {
                                        const hasSkill = bruteHasSkill(skill.id);
                                        return (
                                            <Tooltip 
                                                key={skill.id} 
                                                content={skill.description || 'Habilidad especial que otorga ventajas únicas en combate'}
                                                className="skill-tooltip"
                                            >
                                                <div className={`skill-item ${hasSkill ? 'skill-owned' : 'skill-disabled'}`}>
                                                    <div className="skill-icon">
                                                        {getSkillIconComponent(skill.name)}
                                                    </div>
                                                    <div className="skill-info">
                                                        <span className="skill-name">{skill.name || 'Habilidad'}</span>
                                                        <span className="skill-type">{skill.effectJson?.type || 'pasiva'}</span>
                                                    </div>
                                                    {hasSkill && <div className="skill-owned-indicator">✓</div>}
                                                </div>
                                            </Tooltip>
                                        );
                                    });
                                })()}
                            </div>
                        )}
                    </div>
                </div>                {/* Lista de oponentes */}
                <div className="opponents">
                    {levelInfo?.blockedFromCombat && (
                        <div className="combat-blocked-notice">
                            ⚠️ Debes subir de nivel antes de continuar combatiendo
                        </div>
                    )}
                    <div className={`opponents-grid ${levelInfo?.blockedFromCombat ? 'disabled' : ''}`}>                        {opponents.map((opponent) => (                            <div key={opponent.id} className="opponent-card" onClick={() => handleFightClick(opponent.id)}>
                                <div className="opponent-header">
                                    <h3 className="opponent-name">{opponent.name}</h3>
                                </div>
                                <div className="opponent-special-stats-row">
                                    <div className="opponent-hp-icon-block">
                                        <FaHeart className="hp-icon-large" />
                                        <span className="hp-value-large">{opponent.stats?.hp || 0}</span>
                                    </div>                                    <div className="opponent-special-stats-bars">
                                        <div className="stat-bar-row"><FaDumbbell className="stat-icon" /> <div className="stat-bar-bg"><div className="stat-bar-fill" style={{width: `${(opponent.stats?.strenght || 0) * 10}%`}} /></div></div>
                                        <div className="stat-bar-row"><GiShield className="stat-icon" /> <div className="stat-bar-bg"><div className="stat-bar-fill" style={{width: `${(opponent.stats?.endurance || 0) * 10}%`}} /></div></div>
                                        <div className="stat-bar-row"><GiRunningShoe className="stat-icon" /> <div className="stat-bar-bg"><div className="stat-bar-fill" style={{width: `${(opponent.stats?.agility || 0) * 10}%`}} /></div></div>
                                        <div className="stat-bar-row"><GiBrain className="stat-icon" /> <div className="stat-bar-bg"><div className="stat-bar-fill" style={{width: `${(opponent.stats?.intelligence || 0) * 10}%`}} /></div></div>
                                    </div>
                                    <div className="avatar-container-right">
                                        <img src={`https://robohash.org/${opponent.id.toString()}?set=2&size=80x80`} alt="Avatar" className="opponent-avatar" />
                                        <div className="level-badge">
                                            <GiSwordman /> Nivel {opponent.level}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Historial de combates */}                <div className="fight-history">
                    <h2>Últimos Combates</h2>
                    <div className="history-list">
                        {fightHistory.map((fight) => {
                            const isWinner = fight.winner.id === selectedBrute?.id;
                            const opponent = fight.attacker.id === selectedBrute?.id ? fight.defender : fight.attacker;
                            return (
                                <div key={fight.id} className={`history-card ${isWinner ? 'victory' : 'defeat'}`}>
                                    <p>
                                        {selectedBrute?.name} {isWinner ? 'ha vencido a' : 'ha perdido contra'} {opponent.name}
                                    </p>
                                    <p className="exp-gain">+{isWinner ? '2' : '1'} exp.</p>
                                </div>
                            );
                        })}
                    </div>                </div>
            </div>

            {/* Modal de Level Up */}
            {showLevelUpModal && selectedBrute && (
                <LevelUp
                    bruteId={selectedBrute.id}
                    currentLevel={selectedBrute.level}
                    onLevelUpComplete={handleLevelUpComplete}
                    onCancel={handleLevelUpCancel}
                />
            )}
        </div>
    );
};

export default OpponentSelection;
