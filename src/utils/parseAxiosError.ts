import axios from "axios";



export function parseAxiosError(error: unknown): string {
    if(axios.isAxiosError(error)) {
        const errMsg = error.response?.data?.error || error.message;

        if(error.response?.status === 401) {
            return "unauthorized: Pleas login again";
        }

        if(error.response?.status === 400) {
            return errMsg || 'Invalid Request';
        }

        return errMsg || "Something went wrong with the request.";
    }

    if(error instanceof Error) {
        return error.message;
    };

    return "An unknown error Occured.";
}