import { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const auth = useAuth();

  return (
    <UserContext.Provider
      value={{
        users: auth.users,
        currentUser: auth.user,
        loading: auth.loading,
        error: null,
        switchUser: auth.switchUser,
        refreshUsers: () => {},
        isAdmin: auth.isAdmin,
        isMember: auth.isMember,
        canDeleteTask: auth.canDeleteTask
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
