import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bruteService } from '../services/api';

const Home = () => {
  const [brutes, setBrutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchBrutes = async () => {
      try {
        const response = await bruteService.getAllBrutes();
        setBrutes(response);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching brutes:', error);
        setError('Failed to load warriors');
        setLoading(false);
      }
    };
    
    fetchBrutes();
  }, []);

  const handleCreateBrute = () => {
    navigate('/create-brute');
  };

  const handleBruteClick = (bruteId) => {
    navigate(`/brutes/${bruteId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Warriors</h1>
      
      {brutes.length === 0 ? (
        <div className="text-center p-8">
          <p className="mb-4">You don't have any warriors yet!</p>
          <button
            onClick={handleCreateBrute}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Create Your First Warrior
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {brutes.map((brute) => (
            <div
              key={brute.id}
              onClick={() => handleBruteClick(brute.id)}
              className="border rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-bold mb-2">{brute.name}</h2>
              <div className="grid grid-cols-2 gap-2">
                <div>Level: {brute.level}</div>
                <div>XP: {brute.xp}</div>
                <div>HP: {brute.stats?.hp || 0}</div>
                <div>Strength: {brute.stats?.strength || 0}</div>
              </div>
              {brute.isSelected && (
                <div className="mt-2 text-sm text-green-600 font-semibold">
                  Selected Warrior
                </div>
              )}
            </div>
          ))}
          
          {brutes.length < 5 && (
            <div
              onClick={handleCreateBrute}
              className="border rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow flex items-center justify-center"
            >
              <div className="text-center">
                <span className="text-4xl block mb-2">+</span>
                <span>Create New Warrior</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
