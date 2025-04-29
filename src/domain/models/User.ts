export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: 'user' | 'guide' | 'admin';
    blocked: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface LoggedUser {
    id: string;
    name: string;
    email: string;
    token: string;
    role: string;
}


export interface UserCredentials {
    email: string;
    password: string;
    role: string;
}


  
export interface UserRegistration {
    name: string;
    email: string;
    password: string;
    role: string;
}