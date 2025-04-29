import { createContext, ReactNode, useEffect, useState } from "react";
import { loginUser, registerUser } from "../services/authService";



interface User {
    id: string;
    name: string;
    email: string;
    role: string;
};

interface AuthResponse {
    user : User;
    token: string;
};

interface UserData {
    name: string;
    email: string;
    password: string;
    role: string;
};

interface AuthContextType {
    currentUser: User | null;
    login: ( email: string , password: string ) => Promise< AuthResponse >;
    signup: ( userData: UserData ) => Promise< AuthResponse >;
    logout: () => Promise< void >;
    loading: boolean;
    authLoading: boolean;
}


interface AuthProviderProps {
    children: ReactNode;
};


// create the context with a default value
export const AuthContext = createContext< AuthContextType | null >(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [ currentUser, setCurrentUser ] = useState< User | null >( null );
    const [ loading, setLoading ] = useState< boolean >(false);
    const [ authLoading, setAuthLoading ] = useState< boolean >(false);
    
    useEffect(() => {
        const checkAuthStatus = async (): Promise< void > => {
            try {
                const storedUser = localStorage.getItem('user');
                if( storedUser ) {
                    setCurrentUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error("Authentication error: ", error);
            } finally {
                setAuthLoading(false)
            }
        };

        checkAuthStatus();
    }, []);

    const login = async ( email: string, password: string ): Promise< AuthResponse > => {
        setLoading(true);
        try {
            const response = await loginUser(email, password);
            console.log(response, 'response in authContext')
            setCurrentUser(response.user);
            localStorage.setItem('user', JSON.stringify(response.user));
            localStorage.setItem('token', response.token);
            console.log(response.token, 'this is response token')
            return { user: response.user, token: response.token };
        } catch (error) {
            throw error
        } finally {
            setLoading(false)
        }
    };

    const signup = async ( userData: UserData ): Promise< AuthResponse > => {
        setLoading(true);
        try {
            const response = await registerUser(userData);
            setCurrentUser(response.user);
            localStorage.setItem( 'user', JSON.stringify(response.user) );
            localStorage.setItem( 'token', response.token );
            return { user: response.user, token: response.token };
        } catch (error) {
            throw error
        } finally {
            setLoading(false);
        }
    };

    const logout = async (): Promise<void> => {
        setLoading(true);
        try {
            // await logouUser();
            setCurrentUser(null);
            localStorage.removeItem( 'user' );
            localStorage.removeItem( 'token' );
        } catch (error) {
            console.error( "Logout error: ", error );
        } finally {
            setLoading(false);
        }
    };

    const value: AuthContextType = {
        currentUser,
        login, 
        signup, 
        logout,
        loading,
        authLoading
    };

    return ( 
        <AuthContext.Provider value={value}>
            { children }
        </AuthContext.Provider>
    );

};