import { createContext, useContext, useState, useEffect } from 'react';
import { adminMe, adminLogin, adminLogout } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin,   setAdmin]   = useState(null);
  const [loading, setLoading] = useState(true);

  // Check session on mount
  useEffect(() => {
    adminMe()
      .then(r => setAdmin(r.data))
      .catch(() => setAdmin(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (username, password) => {
    const res = await adminLogin({ username, password });
    setAdmin(res.data.admin);
    return res.data;
  };

  const logout = async () => {
    await adminLogout();
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
