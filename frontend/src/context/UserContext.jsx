import React, { createContext, useContext, useState, useEffect } from 'react';
import { usersService } from '../services/users.service';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await usersService.getUsers();
      setUsers(data);
      if (data.length > 0 && !currentUser) {
        setCurrentUser(data[0]); // Default to first user (Sarah Chen - Admin)
      }
      setError(null);
    } catch (err) {
      console.error('Failed to load team users:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const switchUser = (userId) => {
    const found = users.find((u) => u.id === Number(userId));
    if (found) {
      setCurrentUser(found);
    }
  };

  return (
    <UserContext.Provider
      value={{
        users,
        currentUser,
        loading,
        error,
        switchUser,
        refreshUsers: fetchUsers
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
