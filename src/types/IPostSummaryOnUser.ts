// src/types/guide.ts

export interface Guide {
  _id: string;
  name: string;
  email: string;
  profilePic?: string;
  bio?: string;
  basedOn: string;
  destinations: string[];
  followers: string[];
  happyCustomers: string[];
}

export interface IPostSummary {
  _id: string;
  photo: string[];      // Array of image URLs
  caption?: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;    // ISO date string
  // Add any other post summary fields you need
}

export interface IPost extends IPostSummary {
  likes: Array<{ _id: string }>;
  comments: IComment[];
  // Additional detailed post fields
}

export interface IComment {
  _id: string;
  user: {
    _id: string;
    username?: string;
    profilePic?: string;
  };
  text: string;
  createdAt: string;
  replies?: IComment[];
}