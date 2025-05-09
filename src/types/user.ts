export interface UpdateProfilePayload {
    id: string;
    name?: string;
    password?: string;
    confirmPassword?: string;
    currentPassword?: string;
};