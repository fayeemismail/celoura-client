



export interface Guide {
  _id?: string;
  user: string;
  name: string;
  destinations: string[];
  happyCustomers: string[];
  followers: string[];
  bio: string;
  profilePic: string;
  posts: string[];
  createdAt?: string;
  updatedAt?: string;
}