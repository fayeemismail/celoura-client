import axios from "axios";



const API = axios.create({
    baseURL: "http://localhost:3000/api",
    withCredentials: true
});

//login auth admin
export const login = async (formData: {email: string; password: string}) => {
    const response = await API.post('/auth/login', formData);
    return response.data;
};

export const adminLogin = async ( formData: { email: string; password: string } ) => {
    const response = await API.post('auth/admin/login', formData);
    return response.data;
}