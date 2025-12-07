import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user', signupDate: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', signupDate: '2024-02-20' },
    { id: 3, name: 'Admin User', email: 'admin@learnhub.com', role: 'admin', signupDate: '2024-01-01' }
  ]);

  useEffect(() => {
    const savedUser = localStorage.getItem('learnhub_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const savedUsers = localStorage.getItem('learnhub_users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
  }, []);

  const login = (email, password) => {
    if (email === 'admin@learnhub.com' && password === 'admin123') {
      const adminUser = users.find(u => u.email === 'admin@learnhub.com');
      setUser(adminUser);
      localStorage.setItem('learnhub_user', JSON.stringify(adminUser));
      return { success: true, user: adminUser };
    }
    
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      setUser(existingUser);
      localStorage.setItem('learnhub_user', JSON.stringify(existingUser));
      return { success: true, user: existingUser };
    }
    
    return { success: false, message: 'Invalid credentials' };
  };

  const signup = (name, email, password) => {
    if (password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters' };
    }

    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return { success: false, message: 'Email already exists' };
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      role: 'user',
      signupDate: new Date().toISOString().split('T')[0]
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    setUser(newUser);
    localStorage.setItem('learnhub_user', JSON.stringify(newUser));
    localStorage.setItem('learnhub_users', JSON.stringify(updatedUsers));
    
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('learnhub_user');
  };

  return (
    <AuthContext.Provider value={{ user, users, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};