import { API_BASE_URL } from "../../config/constants";


interface User {
    id: string;
    name: string;
    email: string;
    role: string;
};

interface AuthResponse {
    user: User;
    token: string;
    message?: string;
};

interface UserData {
    name: string;
    email: string;
    password: string;
    role: string;
};

interface ErrorResponse {
    message: string;
};

//loginUser service frontend
export const loginUser = async ( email: string, password: string ): Promise< AuthResponse > => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        console.log(data, 'raw response')

        if( !response.ok ){
            const errorData : ErrorResponse = await response.json();
            throw new Error( errorData.message || 'LOGIN FAILED' );
        };

        return data as AuthResponse;
    } catch (error) {
        console.log('Login Failed Error', error)
        throw error;
    }
}

export const registerUser = async ( userData: UserData ): Promise<AuthResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        if( !response.ok ) {
            const errorData: ErrorResponse = await response.json();
            throw new Error(errorData.message || "REGISTRATION FAILED");
        }

        return await response.json() as AuthResponse;

    } catch (error) {
        throw error
    };

}

export const logoutUser = async(): Promise<{ success: boolean; message?: string }> => {
    try {
        const token = localStorage.getItem('token');

        if(!token) {
            return { success: true };
        };

        const response = await fetch(`${API_BASE_URL}/auth/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if( !response.ok ) {
            const errorData : ErrorResponse = await response.json();
            throw new Error(errorData.message|| "LOGOUT FAILED" );
        }

        return await response.json() as { success: boolean; message?: string }

    } catch (error) {
        throw error
    }
}