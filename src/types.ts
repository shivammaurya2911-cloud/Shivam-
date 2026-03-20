export interface User {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  bio?: string;
  followers: number;
  following: number;
  postsCount: number;
  isPremium?: boolean;
}

export interface Comment {
  id: string;
  username: string;
  text: string;
  timestamp: string;
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  imageUrl: string;
  caption: string;
  likes: number;
  comments: Comment[];
  timestamp: string;
  isLiked?: boolean;
  isSponsored?: boolean;
}

export interface Activity {
  id: string;
  type: 'like' | 'comment' | 'follow';
  username: string;
  avatar: string;
  timestamp: string;
  postImage?: string;
}

export interface Story {
  id: string;
  username: string;
  avatar: string;
  isSeen: boolean;
}
