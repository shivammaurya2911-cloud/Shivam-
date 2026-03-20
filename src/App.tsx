/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  MoreHorizontal, 
  Home, 
  Search, 
  PlusSquare, 
  User as UserIcon,
  Grid,
  Settings,
  LogOut,
  Camera,
  ChevronLeft,
  Moon,
  Sun,
  X,
  Crown,
  ExternalLink,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Post, Story, User, Activity, Comment } from './types';
import { currentUser, mockPosts, mockStories, mockActivities } from './mockData';

// --- Components ---

const Navbar = ({ onTabChange, activeTab, isDark, toggleDark }: { 
  onTabChange: (tab: string) => void, 
  activeTab: string,
  isDark: boolean,
  toggleDark: () => void
}) => (
  <nav className="sticky top-0 z-50 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 flex justify-between items-center">
    <h1 
      className="text-2xl font-bold tracking-tight cursor-pointer dark:text-white" 
      style={{ fontFamily: 'Playfair Display, serif' }}
      onClick={() => onTabChange('feed')}
    >
      Shivam
    </h1>
    <div className="flex items-center gap-4">
      <button onClick={toggleDark} className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
        {isDark ? <Sun className="w-6 h-6 text-yellow-400" /> : <Moon className="w-6 h-6 text-zinc-600" />}
      </button>
      <Send className="w-6 h-6 cursor-pointer hover:text-blue-500 transition-colors dark:text-white" />
    </div>
  </nav>
);

const Stories = () => (
  <div className="flex gap-4 overflow-x-auto p-4 no-scrollbar border-b border-zinc-100 dark:border-zinc-900">
    {mockStories.map((story) => (
      <div key={story.id} className="flex flex-col items-center gap-1 flex-shrink-0">
        <div className={`p-[2px] rounded-full ${story.isSeen ? 'bg-zinc-200 dark:bg-zinc-800' : 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600'}`}>
          <div className="p-[2px] bg-white dark:bg-zinc-950 rounded-full">
            <img 
              src={story.avatar} 
              alt={story.username} 
              className="w-14 h-14 rounded-full object-cover border border-zinc-200 dark:border-zinc-800"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
        <span className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate w-16 text-center">
          {story.username === 'your_story' ? 'Your Story' : story.username}
        </span>
      </div>
    ))}
  </div>
);

const CommentModal = ({ post, onClose, onAddComment }: { 
  post: Post, 
  onClose: () => void,
  onAddComment: (text: string) => void
}) => {
  const [text, setText] = useState('');

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-t-2xl sm:rounded-2xl h-[80vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="w-8" />
          <h3 className="font-semibold dark:text-white">Comments</h3>
          <button onClick={onClose}><X className="w-6 h-6 dark:text-white" /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex gap-3">
            <img src={post.userAvatar} className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer" />
            <div>
              <p className="text-sm dark:text-white">
                <span className="font-semibold mr-2">{post.username}</span>
                {post.caption}
              </p>
              <p className="text-[10px] text-zinc-400 mt-1">{post.timestamp}</p>
            </div>
          </div>
          
          {post.comments.map(comment => (
            <div key={comment.id} className="flex gap-3">
              <img src={`https://picsum.photos/seed/${comment.username}/100`} className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer" />
              <div>
                <p className="text-sm dark:text-white">
                  <span className="font-semibold mr-2">{comment.username}</span>
                  {comment.text}
                </p>
                <p className="text-[10px] text-zinc-400 mt-1">{comment.timestamp}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 flex gap-3 items-center">
          <img src={currentUser.avatar} className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer" />
          <input 
            type="text" 
            placeholder="Add a comment..." 
            className="flex-1 bg-transparent outline-none text-sm dark:text-white"
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && text && (onAddComment(text), setText(''))}
          />
          <button 
            className="text-blue-500 font-semibold text-sm disabled:opacity-50"
            disabled={!text}
            onClick={() => { onAddComment(text); setText(''); }}
          >
            Post
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

interface PostCardProps {
  post: Post;
  onUpdatePost: (updated: Post) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onUpdatePost }) => {
  const [liked, setLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount(prev => liked ? prev - 1 : prev + 1);
  };

  const handleAddComment = (text: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      username: currentUser.username,
      text,
      timestamp: 'Just now'
    };
    onUpdatePost({
      ...post,
      comments: [...post.comments, newComment]
    });
  };

  return (
    <div className="flex flex-col border-b border-zinc-100 dark:border-zinc-900 pb-4">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src={post.userAvatar} 
              alt={post.username} 
              className="w-8 h-8 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
            {post.isSponsored && (
              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5 border border-white dark:border-zinc-950">
                <TrendingUp className="w-2 h-2 text-white" />
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm dark:text-white flex items-center gap-1">
              {post.username}
              {post.isSponsored && <span className="text-[10px] font-normal text-zinc-500 dark:text-zinc-400">• Sponsored</span>}
            </span>
            {post.isSponsored && <span className="text-[10px] text-blue-500 font-medium">Visit Website</span>}
          </div>
        </div>
        <MoreHorizontal className="w-5 h-5 text-zinc-500 cursor-pointer" />
      </div>
      
      <div className="aspect-square bg-zinc-100 dark:bg-zinc-900 overflow-hidden relative" onDoubleClick={handleLike}>
        <img 
          src={post.imageUrl} 
          alt="Post content" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        {post.isSponsored && (
          <div className="absolute bottom-0 left-0 right-0 bg-blue-500/90 backdrop-blur-sm p-3 flex justify-between items-center">
            <span className="text-white text-xs font-semibold">Learn More</span>
            <ExternalLink className="w-4 h-4 text-white" />
          </div>
        )}
        <AnimatePresence>
          {liked && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <Heart className="w-24 h-24 text-white fill-white drop-shadow-lg" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <Heart 
              className={`w-6 h-6 cursor-pointer transition-colors ${liked ? 'fill-red-500 text-red-500' : 'hover:text-zinc-500 dark:text-white'}`} 
              onClick={handleLike}
            />
            <MessageCircle 
              className="w-6 h-6 cursor-pointer hover:text-zinc-500 dark:text-white" 
              onClick={() => setShowComments(true)}
            />
            <Send className="w-6 h-6 cursor-pointer hover:text-zinc-500 dark:text-white" />
          </div>
          <Bookmark className="w-6 h-6 cursor-pointer hover:text-zinc-500 dark:text-white" />
        </div>
        
        <p className="font-semibold text-sm mb-1 dark:text-white">{likesCount.toLocaleString()} likes</p>
        <p className="text-sm dark:text-zinc-200">
          <span className="font-semibold mr-2">{post.username}</span>
          {post.caption}
        </p>
        
        {post.comments.length > 0 && (
          <button 
            onClick={() => setShowComments(true)}
            className="text-zinc-500 dark:text-zinc-400 text-sm mt-1"
          >
            View all {post.comments.length} comments
          </button>
        )}
        
        <p className="text-zinc-400 text-[10px] uppercase mt-2">{post.timestamp}</p>
        
        {post.username === currentUser.username && !post.isSponsored && (
          <button className="mt-3 w-full py-2 border border-blue-500 text-blue-500 rounded-lg text-xs font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center justify-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Promote Post
          </button>
        )}
      </div>

      <AnimatePresence>
        {showComments && (
          <CommentModal 
            post={post} 
            onClose={() => setShowComments(false)} 
            onAddComment={handleAddComment}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const ProfileView = ({ user }: { user: User }) => (
  <div className="flex flex-col">
    <div className="p-4 flex items-center gap-8">
      <div className="relative">
        <div className="p-[2px] rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600">
          <div className="p-[2px] bg-white dark:bg-zinc-950 rounded-full">
            <img 
              src={user.avatar} 
              alt={user.username} 
              className="w-20 h-20 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-1">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-light dark:text-white">{user.username}</h2>
          <Settings className="w-5 h-5 text-zinc-700 dark:text-white" />
        </div>
        <div className="flex justify-between text-center dark:text-white">
          <div>
            <p className="font-semibold">{user.postsCount}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">posts</p>
          </div>
          <div>
            <p className="font-semibold">{user.followers}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">followers</p>
          </div>
          <div>
            <p className="font-semibold">{user.following}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">following</p>
          </div>
        </div>
      </div>
    </div>
    
    <div className="px-4 pb-6 border-b border-zinc-100 dark:border-zinc-900">
      <p className="font-semibold text-sm dark:text-white">{user.fullName}</p>
      <p className="text-sm text-zinc-600 dark:text-zinc-300 whitespace-pre-line">{user.bio}</p>
    </div>

    {/* Monetization: Premium Banner */}
    <div className="p-4">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-4 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Crown className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <h3 className="font-bold text-lg">Shivam Premium</h3>
          </div>
          <p className="text-xs text-indigo-100 mb-3">Get exclusive badges, ad-free experience, and advanced analytics.</p>
          <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg text-xs font-bold shadow-sm hover:bg-indigo-50 transition-colors">
            Upgrade for $4.99/mo
          </button>
        </div>
        <Crown className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10 rotate-12" />
      </div>
    </div>

    <div className="flex border-b border-zinc-100 dark:border-zinc-900">
      <div className="flex-1 flex justify-center py-3 border-b-2 border-black dark:border-white">
        <Grid className="w-5 h-5 dark:text-white" />
      </div>
      <div className="flex-1 flex justify-center py-3 text-zinc-400">
        <Bookmark className="w-5 h-5" />
      </div>
      <div className="flex-1 flex justify-center py-3 text-zinc-400">
        <UserIcon className="w-5 h-5" />
      </div>
    </div>

    <div className="grid grid-cols-3 gap-[2px] mt-[2px]">
      {[...Array(12)].map((_, i) => (
        <div key={i} className="aspect-square bg-zinc-100 dark:bg-zinc-900">
          <img 
            src={`https://picsum.photos/seed/post-${i}/300/300`} 
            alt="User post" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      ))}
    </div>
  </div>
);

const ActivityView = () => (
  <div className="flex flex-col p-4 space-y-6">
    <h2 className="text-xl font-bold dark:text-white">Activity</h2>
    <div className="space-y-4">
      {mockActivities.map(activity => (
        <div key={activity.id} className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            <img src={activity.avatar} className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
            <p className="text-sm dark:text-white">
              <span className="font-semibold">{activity.username}</span>
              {' '}
              {activity.type === 'like' ? 'liked your photo.' : 
               activity.type === 'comment' ? 'commented on your post.' : 
               'started following you.'}
              <span className="text-zinc-400 ml-2">{activity.timestamp}</span>
            </p>
          </div>
          {activity.postImage && (
            <img src={activity.postImage} className="w-10 h-10 object-cover rounded" referrerPolicy="no-referrer" />
          )}
          {activity.type === 'follow' && (
            <button className="bg-blue-500 text-white text-xs font-semibold px-4 py-1.5 rounded-lg">
              Follow
            </button>
          )}
        </div>
      ))}
    </div>
  </div>
);

const SearchView = () => (
  <div className="flex flex-col">
    <div className="p-4">
      <div className="bg-zinc-100 dark:bg-zinc-900 rounded-lg flex items-center px-3 py-2 gap-2">
        <Search className="w-4 h-4 text-zinc-400" />
        <input 
          type="text" 
          placeholder="Search" 
          className="bg-transparent outline-none text-sm w-full dark:text-white"
        />
      </div>
    </div>
    <div className="grid grid-cols-3 gap-[2px]">
      {[...Array(18)].map((_, i) => (
        <div key={i} className={`aspect-square bg-zinc-100 dark:bg-zinc-900 ${i % 10 === 0 ? 'col-span-2 row-span-2' : ''}`}>
          <img 
            src={`https://picsum.photos/seed/search-${i}/400/400`} 
            alt="Search result" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      ))}
    </div>
  </div>
);

const CreatePostModal = ({ onClose, onPost }: { onClose: () => void, onPost: (caption: string, image: string) => void }) => {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState('https://picsum.photos/seed/newpost/600/600');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      className="fixed inset-0 z-[60] bg-white dark:bg-zinc-950 flex flex-col"
    >
      <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
        <button onClick={onClose} className="text-zinc-600 dark:text-zinc-300">Cancel</button>
        <h2 className="font-semibold dark:text-white">New Post</h2>
        <button 
          onClick={() => onPost(caption, image)} 
          className="text-blue-500 font-semibold disabled:opacity-50"
          disabled={!caption}
        >
          Share
        </button>
      </div>
      
      <div className="p-4 flex gap-4">
        <img src={image} alt="Preview" className="w-20 h-20 object-cover rounded" />
        <textarea 
          placeholder="Write a caption..." 
          className="flex-1 resize-none outline-none text-sm pt-2 bg-transparent dark:text-white"
          rows={4}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
      </div>
      
      <div className="mt-auto border-t border-zinc-100 dark:border-zinc-800 p-4">
        <div className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-300">
          <div className="flex items-center gap-2 cursor-pointer">
            <Camera className="w-5 h-5" />
            <span>Take Photo</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const BottomNav = ({ activeTab, onTabChange }: { activeTab: string, onTabChange: (tab: string) => void }) => (
  <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 px-6 py-3 flex justify-between items-center z-50">
    <Home 
      className={`w-6 h-6 cursor-pointer ${activeTab === 'feed' ? 'fill-black dark:fill-white dark:text-white' : 'text-zinc-600 dark:text-zinc-400'}`} 
      onClick={() => onTabChange('feed')}
    />
    <Search 
      className={`w-6 h-6 cursor-pointer ${activeTab === 'search' ? 'stroke-[3px] dark:text-white' : 'text-zinc-600 dark:text-zinc-400'}`} 
      onClick={() => onTabChange('search')}
    />
    <PlusSquare 
      className="w-6 h-6 cursor-pointer text-zinc-600 dark:text-zinc-400" 
      onClick={() => onTabChange('create')}
    />
    <Heart 
      className={`w-6 h-6 cursor-pointer ${activeTab === 'activity' ? 'fill-black dark:fill-white dark:text-white' : 'text-zinc-600 dark:text-zinc-400'}`} 
      onClick={() => onTabChange('activity')}
    />
    <div 
      className={`w-6 h-6 rounded-full border cursor-pointer overflow-hidden ${activeTab === 'profile' ? 'border-black dark:border-white p-[1px]' : 'border-transparent'}`}
      onClick={() => onTabChange('profile')}
    >
      <img src={currentUser.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('feed');
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [showCreate, setShowCreate] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleTabChange = (tab: string) => {
    if (tab === 'create') {
      setShowCreate(true);
    } else {
      setActiveTab(tab);
    }
  };

  const handleUpdatePost = (updatedPost: Post) => {
    setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p));
  };

  const handleCreatePost = (caption: string, image: string) => {
    const newPost: Post = {
      id: `p${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      userAvatar: currentUser.avatar,
      imageUrl: image,
      caption: caption,
      likes: 0,
      comments: [],
      timestamp: 'Just now',
      isLiked: false,
    };
    
    setPosts([newPost, ...posts]);
    setShowCreate(false);
    setActiveTab('feed');
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-zinc-950 min-h-screen pb-20 relative shadow-xl transition-colors duration-300">
      <Navbar 
        onTabChange={handleTabChange} 
        activeTab={activeTab} 
        isDark={isDark} 
        toggleDark={() => setIsDark(!isDark)} 
      />
      
      <main>
        {activeTab === 'feed' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="flex flex-col"
          >
            <Stories />
            <div className="flex flex-col">
              {posts.map(post => (
                <PostCard key={post.id} post={post} onUpdatePost={handleUpdatePost} />
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'profile' && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
          >
            <ProfileView user={currentUser} />
          </motion.div>
        )}

        {activeTab === 'search' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
          >
            <SearchView />
          </motion.div>
        )}

        {activeTab === 'activity' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
          >
            <ActivityView />
          </motion.div>
        )}
      </main>

      <AnimatePresence>
        {showCreate && (
          <CreatePostModal 
            onClose={() => setShowCreate(false)} 
            onPost={handleCreatePost}
          />
        )}
      </AnimatePresence>

      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}


