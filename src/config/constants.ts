export const API_BASE_URL: string = import.meta.env.VITE_APP_URL || 'http://localhost:3000/api';
export const GOOGLE_CLIENT_ID: string = import.meta.env.VITE_GOOGLE_CLIENT_ID
export const _S3_BUCKET: string = import.meta.env.VITE_S3_BUCKET;
export const _AWS_REGION: string = import.meta.env.VITE_AWS_REGION;


//authentication

export const TOKEN_KEY: string = 'token';
export const USER_KEY: string = 'user';


//User roles
export enum UserRole {
    USER = 'user',
    ADIMN = 'admin'
};