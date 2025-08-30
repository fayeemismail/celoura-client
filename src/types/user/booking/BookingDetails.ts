export interface BookingDetails {
    _id: string;
    createdAt: string;
    durationInDays: string;
    endDate: string;
    guide: {
        id: string;
        name: string;
        email: string;
        profilePic?: string;
        basedOn?: string;
        bio?: string;
    };
    guideAccepted: boolean;
    locations: string[];
    paymentStatus: string;
    rejected: boolean;
    rejectedReason?: string;
    specialRequests: string;
    startDate: string;
    status: string;
    updatedAt: string;
    user: {
        id: string;
        name: string;
        email: string;
        phone: string;
        address: {
            _id: string;
            line1: string;
            line2?: string;
            city: string;
            state: string;
            country: string;
            postalCode: string;
        };
    };

    totalAmount?: number;
    paymentMethod?: string;
    bookingReference?: string;
    paymentDeadline?: string;
}