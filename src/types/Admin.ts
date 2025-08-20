


export interface CreateDestinationFormData {
    name: string;
    description: string;
    location: string;
    country: string
    features: string;
    photos: (File | null)[];
}