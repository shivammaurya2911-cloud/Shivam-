import { User, Post, Story, Activity } from './types';

export const currentUser: User = {
  id: 'me',
  username: 'shivam_maurya',
  fullName: 'Shivam',
  avatar: 'https://picsum.photos/seed/shivam-profile/400',
  bio: 'Building the future of social media 🚀 | Shivam App',
  followers: 1250,
  following: 450,
  postsCount: 12,
};

export const mockStories: Story[] = [
  { id: '1', username: 'your_story', avatar: currentUser.avatar, isSeen: false },
  { id: '2', username: 'alex_dev', avatar: 'https://picsum.photos/seed/alex/200', isSeen: false },
  { id: '3', username: 'sarah_design', avatar: 'https://picsum.photos/seed/sarah/200', isSeen: true },
  { id: '4', username: 'mike_travels', avatar: 'https://picsum.photos/seed/mike/200', isSeen: false },
  { id: '5', username: 'tech_guru', avatar: 'https://picsum.photos/seed/tech/200', isSeen: false },
  { id: '6', username: 'fitness_freak', avatar: 'https://picsum.photos/seed/fit/200', isSeen: true },
  { id: '7', username: 'foodie_life', avatar: 'https://picsum.photos/seed/food/200', isSeen: false },
];

export const mockPosts: Post[] = [
  {
    id: 'p1',
    userId: '2',
    username: 'alex_dev',
    userAvatar: 'https://picsum.photos/seed/alex/200',
    imageUrl: 'https://picsum.photos/seed/code/600/600',
    caption: 'Coding late into the night. 💻✨ #developer #codinglife',
    likes: 124,
    comments: [
      { id: 'c1', username: 'sarah_design', text: 'Looking good! 🔥', timestamp: '1h' },
      { id: 'c2', username: 'mike_travels', text: 'Keep it up!', timestamp: '30m' }
    ],
    timestamp: '2 hours ago',
    isLiked: false,
  },
  {
    id: 'p2',
    userId: '3',
    username: 'sarah_design',
    userAvatar: 'https://picsum.photos/seed/sarah/200',
    imageUrl: 'https://picsum.photos/seed/design/600/600',
    caption: 'New design system coming along nicely. 🎨 #uiux #design',
    likes: 856,
    comments: [
      { id: 'c3', username: 'shivam_maurya', text: 'Amazing work Sarah!', timestamp: '2h' }
    ],
    timestamp: '5 hours ago',
    isLiked: true,
  },
  {
    id: 'p3',
    userId: '4',
    username: 'mike_travels',
    userAvatar: 'https://picsum.photos/seed/mike/200',
    imageUrl: 'https://picsum.photos/seed/mountain/600/600',
    caption: 'The view from the top is always worth it. 🏔️ #adventure #mountains',
    likes: 2341,
    comments: [],
    timestamp: '1 day ago',
    isLiked: false,
  },
  {
    id: 'p4',
    userId: '5',
    username: 'pixel_perfect',
    userAvatar: 'https://picsum.photos/seed/pixel/200',
    imageUrl: 'https://picsum.photos/seed/ad/600/600',
    caption: 'Get 50% off on all design assets! Limited time offer. 🎁 #ad #design',
    likes: 15420,
    comments: [],
    timestamp: 'Sponsored',
    isLiked: false,
    isSponsored: true,
  },
];

export const mockActivities: Activity[] = [
  { id: 'a1', type: 'like', username: 'alex_dev', avatar: 'https://picsum.photos/seed/alex/200', timestamp: '2m', postImage: 'https://picsum.photos/seed/post-0/100/100' },
  { id: 'a2', type: 'comment', username: 'sarah_design', avatar: 'https://picsum.photos/seed/sarah/200', timestamp: '15m', postImage: 'https://picsum.photos/seed/post-1/100/100' },
  { id: 'a3', type: 'follow', username: 'mike_travels', avatar: 'https://picsum.photos/seed/mike/200', timestamp: '1h' },
  { id: 'a4', type: 'like', username: 'tech_guru', avatar: 'https://picsum.photos/seed/tech/200', timestamp: '3h', postImage: 'https://picsum.photos/seed/post-2/100/100' },
];
