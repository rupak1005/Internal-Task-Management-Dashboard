import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth.service';
import { usersService } from '../services/users.service';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('auth_token'));
  const [loading, setLoading] = useState(true);
  const [usersList, setUsersList] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply dark mode class to documentElement
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Fetch all team users for quick switching
  const fetchUsers = useCallback(async () => {
    try {
      const list = await usersService.getUsers();
      setUsersList(list || []);
      return list;
    } catch {
      return [];
    }
  }, []);

  // Initialize current user from token or auto-login default admin
  useEffect(() => {
    async function initAuth() {
      try {
        setLoading(true);
        const users = await fetchUsers();

        const storedToken = localStorage.getItem('auth_token');
        if (storedToken) {
          try {
            const profile = await authService.getMe();
            setUser(profile.data || profile);
          } catch {
            localStorage.removeItem('auth_token');
            setToken(null);
            // Fallback auto login as default first user (Sarah Chen / Admin)
            if (users.length > 0) {
              const res = await authService.login({
                email: users[0].email,
                password: 'password123'
              });
              localStorage.setItem('auth_token', res.token);
              setToken(res.token);
              setUser(res.data);
            }
          }
        } else if (users.length > 0) {
          // Auto login as default first user
          const res = await authService.login({
            email: users[0].email,
            password: 'password123'
          });
          localStorage.setItem('auth_token', res.token);
          setToken(res.token);
          setUser(res.data);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    }
    initAuth();
  }, [fetchUsers]);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    localStorage.setItem('auth_token', res.token);
    setToken(res.token);
    setUser(res.data);
    return res.data;
  };

  const register = async (data) => {
    const res = await authService.register(data);
    localStorage.setItem('auth_token', res.token);
    setToken(res.token);
    setUser(res.data);
    fetchUsers();
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
  };

  const switchDemoUser = async (userEmail, password = 'password123') => {
    const res = await authService.login({ email: userEmail, password });
    localStorage.setItem('auth_token', res.token);
    setToken(res.token);
    setUser(res.data);
    return res.data;
  };

  const isAdmin = Boolean(user && user.role && user.role.toLowerCase() === 'admin');
  const isMember = Boolean(user && user.role && user.role.toLowerCase() === 'member');

  const canDeleteTask = () => {
    return isAdmin;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        currentUser: user,
        token,
        isAuthenticated: Boolean(user),
        isAdmin,
        isMember,
        canDeleteTask,
        users: usersList,
        loading,
        login,
        register,
        logout,
        switchDemoUser,
        switchUser: (id) => {
          const target = usersList.find((u) => u.id === id);
          if (target) switchDemoUser(target.email);
        },
        isDarkMode,
        toggleDarkMode
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
