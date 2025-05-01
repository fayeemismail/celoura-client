import axios from "axios";



const API = axios.create({
    baseURL: "http://localhost:3000/api",
    withCredentials: true
});

//login auth
export const login = async (formData: {email: string; password: string}) => {
    const response = await API.post('/auth/login', formData);
    return response.data;
};