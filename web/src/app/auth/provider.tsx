import { createContext, useContext, useState, useEffect, ReactNode, use } from 'react';
import { supabase } from '@/components/supabase';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
    user: User | undefined;
    session: Session | undefined;
    isAuthenticated: boolean;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider props
interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User>();
    const [session, setSession] = useState<Session>();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);

    const signIn = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth(
            { 
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            }
        );
        if (error) {
            console.error('Error signing in:', error);
        }
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error signing out:', error);
        } else {
            setUser(undefined);
            setSession(undefined);
            setIsAuthenticated(false);
            setLoading(true);
            localStorage.removeItem('sb-access-token');
            localStorage.removeItem('sb-refresh-token');
            localStorage.removeItem('dai-lng');
        }
    };

    const handleSession = async () => {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (session) {
            setSession(session);
            setUser(session.user);
            setIsAuthenticated(true);
            setLoading(false);
        }
    }

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                if (session) {
                    setSession(session);
                    setUser(session.user);
                    setIsAuthenticated(true);
                    setLoading(false)
                }
            }
        );

        handleSession();

        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, session, isAuthenticated, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
