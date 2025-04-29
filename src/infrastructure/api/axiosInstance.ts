import axios from "axios";
import { API_BASE_URL } from "../config/constants";

const instance = axios.create( { 
    baseURL : API_BASE_URL || 'http://localhost:3000/api',
    withCredentials: true
 } );


 export default instance;