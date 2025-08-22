export interface Request {
  _id: string;
  fullName: string;
  phone: string;
  email: string;
  status: string;
  experience: string;
  expertise: string;
  dob: Date;
  address: string;
  idFileUrl: string;
  basedOn: string;
  userId: string;
  rejectReason?: string;
  re_apply?: number;
  createdAt: string;
  profilePhotoUrl?: string;
}