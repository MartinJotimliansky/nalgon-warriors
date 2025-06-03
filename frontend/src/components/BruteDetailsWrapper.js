import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bruteService } from '../services/api';
import BruteDetails from './BruteDetails';

const BruteDetailsWrapper = () => {
  const { bruteId } = useParams();
  const navigate = useNavigate();
  const [brute, setBrute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBruteDetails = async () => {
      try {
        const bruteData = await bruteService.getBrute(bruteId);
        setBrute(bruteData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching brute details:', error);
        setError('Failed to load warrior details');
        setLoading(false);
      }
    };

    fetchBruteDetails();
  }, [bruteId]);

  const handleStartBattle = async () => {
    try {
      navigate(`/battle/${bruteId}`);
    } catch (error) {
      console.error('Error starting battle:', error);
    }
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
    <BruteDetails 
      brute={brute} 
      onStartBattle={handleStartBattle}
    />
  );
};

export default BruteDetailsWrapper;
