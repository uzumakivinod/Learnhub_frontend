import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const LearningPathContext = createContext();

export const useLearningPaths = () => {
  const context = useContext(LearningPathContext);
  if (!context) {
    throw new Error('useLearningPaths must be used within LearningPathProvider');
  }
  return context;
};

export const LearningPathProvider = ({ children }) => {
  const [learningPaths, setLearningPaths] = useState([]);
  const [userEnrolledPaths, setUserEnrolledPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchLearningPaths();
  }, []);

  const fetchLearningPaths = async (filters = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams(filters);
      const response = await axios.get(`${API_URL}/learning-paths?${params}`);
      setLearningPaths(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching learning paths:', err);
      setError('Failed to fetch learning paths');
      setLearningPaths([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserEnrolledPaths = async (token) => {
    try {
      const response = await axios.get(`${API_URL}/learning-paths/user/my-paths`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserEnrolledPaths(response.data);
    } catch (err) {
      console.error('Error fetching enrolled paths:', err);
    }
  };

  const enrollInPath = async (pathId, token) => {
    try {
      const response = await axios.post(
        `${API_URL}/learning-paths/${pathId}/enroll`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { success: true, data: response.data };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.error || 'Failed to enroll' 
      };
    }
  };

  const updateProgress = async (pathId, progressData, token) => {
    try {
      const response = await axios.put(
        `${API_URL}/learning-paths/${pathId}/progress`,
        progressData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { success: true, data: response.data };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.error || 'Failed to update progress' 
      };
    }
  };

  const getPathDetails = async (pathId, token = null) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.get(`${API_URL}/learning-paths/${pathId}`, { headers });
      return { success: true, data: response.data };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.error || 'Failed to fetch path details' 
      };
    }
  };

  return (
    <LearningPathContext.Provider
      value={{
        learningPaths,
        userEnrolledPaths,
        loading,
        error,
        fetchLearningPaths,
        fetchUserEnrolledPaths,
        enrollInPath,
        updateProgress,
        getPathDetails
      }}
    >
      {children}
    </LearningPathContext.Provider>
  );
};

export default LearningPathProvider;