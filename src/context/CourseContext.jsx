import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CourseContext = createContext();

export const useCourses = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourses must be used within CourseProvider');
  }
  return context;
};

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchCourses();
    fetchPlatforms();
  }, []);

  const fetchCourses = async (filters = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams(filters);
      const response = await axios.get(`${API_URL}/courses?${params}`);
      setCourses(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to fetch courses');
      setCourses(getSampleCourses());
    } finally {
      setLoading(false);
    }
  };

  const fetchPlatforms = async () => {
    try {
      const response = await axios.get(`${API_URL}/platforms`);
      setPlatforms(response.data);
    } catch (err) {
      console.error('Error fetching platforms:', err);
      setPlatforms(['Google', 'Coursera', 'Udemy']);
    }
  };

  const getSampleCourses = () => [
    {
      _id: '1',
      name: 'Machine Learning Crash Course',
      platform: 'Google',
      description: 'Learn ML fundamentals with TensorFlow APIs',
      domain: ['Machine Learning', 'AI'],
      link: 'https://developers.google.com/machine-learning/crash-course',
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop'
    },
    {
      _id: '2',
      name: 'Deep Learning Specialization',
      platform: 'Coursera',
      description: 'Master deep learning with Andrew Ng',
      domain: ['Deep Learning', 'AI'],
      link: 'https://www.coursera.org/specializations/deep-learning',
      thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=250&fit=crop'
    },
    {
      _id: '3',
      name: 'Cybersecurity Fundamentals',
      platform: 'Google',
      description: 'Essential cybersecurity concepts and practices',
      domain: ['Cybersecurity', 'Security'],
      link: 'https://www.coursera.org/google-certificates/cybersecurity-certificate',
      thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=250&fit=crop'
    },
    {
      _id: '4',
      name: 'Full Stack Web Development',
      platform: 'Udemy',
      description: 'Complete web development bootcamp',
      domain: ['Web Development', 'Programming'],
      link: 'https://www.udemy.com/topic/web-development/',
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop'
    },
    {
      _id: '5',
      name: 'Python for Data Science',
      platform: 'Coursera',
      description: 'Data analysis with Python and pandas',
      domain: ['Data Science', 'Python'],
      link: 'https://www.coursera.org/learn/python-data-analysis',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop'
    },
    {
      _id: '6',
      name: 'Cloud Computing Basics',
      platform: 'Google',
      description: 'Introduction to Google Cloud Platform',
      domain: ['Cloud Computing', 'DevOps'],
      link: 'https://cloud.google.com/training',
      thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=250&fit=crop'
    },
    {
      _id: '7',
      name: 'React Complete Guide',
      platform: 'Udemy',
      description: 'Master React.js with hooks and context',
      domain: ['Web Development', 'React'],
      link: 'https://www.udemy.com/course/react-the-complete-guide/',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop'
    },
    {
      _id: '8',
      name: 'AI Product Management',
      platform: 'Coursera',
      description: 'Build and manage AI products effectively',
      domain: ['AI', 'Product Management'],
      link: 'https://www.coursera.org/learn/ai-product-management',
      thumbnail: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=250&fit=crop'
    }
  ];

  return (
    <CourseContext.Provider
      value={{
        courses,
        platforms,
        loading,
        error,
        fetchCourses,
        fetchPlatforms
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};