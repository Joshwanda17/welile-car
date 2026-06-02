import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Mock User type to replace Supabase User
export interface User {
  id: string;
  email?: string;
  user_metadata?: {
    name?: string;
    phone?: string;
    residence?: string;
    referral_code?: string;
  };
}

interface AuthContextType {
  user: User | null;
  session: any | null; // Mock session
  loading: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string, name: string, phone: string, residence: string, referralCode?: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check local storage for mocked user session on load
    const storedUser = localStorage.getItem('mockUser');
    const storedIsAdmin = localStorage.getItem('mockIsAdmin');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setSession({ access_token: 'mock-token' });
    }
    if (storedIsAdmin === 'true') {
      setIsAdmin(true);
    }
    
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, name: string, phone: string, residence: string, referralCode?: string) => {
    const newUser = { id: 'mock-id-' + Date.now(), email, user_metadata: { name, phone, residence, referralCode } };
    setUser(newUser);
    setSession({ access_token: 'mock-token' });
    setIsAdmin(false);
    
    localStorage.setItem('mockUser', JSON.stringify(newUser));
    localStorage.setItem('mockIsAdmin', 'false');
    
    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    // Admin login mock
    if (email === 'admin@admin.com') {
      const adminUser = { id: 'mock-admin-id', email };
      setUser(adminUser);
      setSession({ access_token: 'mock-token' });
      setIsAdmin(true);
      
      localStorage.setItem('mockUser', JSON.stringify(adminUser));
      localStorage.setItem('mockIsAdmin', 'true');
      return { error: null };
    }

    const standardUser = { id: 'mock-id-' + Date.now(), email };
    setUser(standardUser);
    setSession({ access_token: 'mock-token' });
    setIsAdmin(false);
    
    localStorage.setItem('mockUser', JSON.stringify(standardUser));
    localStorage.setItem('mockIsAdmin', 'false');
    
    return { error: null };
  };

  const signOut = async () => {
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    localStorage.removeItem('mockUser');
    localStorage.removeItem('mockIsAdmin');
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, isAdmin, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
