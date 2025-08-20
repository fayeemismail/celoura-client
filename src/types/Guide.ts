



export interface Guide {
  _id?: string;
  user: string;
  name: string;
  email: string;
  destinations: string[];
  happyCustomers: string[];
  followers: string[];
  bio: string;
  profilePic: string;
  posts: string[];
  createdAt?: string;
  updatedAt?: string;
  basedOn?: string;
};


export interface guideRejection{
  applicationId: string;
  userId: string;
  reason: string;
}