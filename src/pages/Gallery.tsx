import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSession } from '@supabase/auth-helpers-react';
import { Toggle } from '../components/ui/Toggle';
import { MemeGrid } from '../components/MemeGrid';
import { getMemes, getUserLikedMemes, likeMeme, unlikeMeme, deleteMeme } from '../lib/supabase';
import { Meme } from '../types';
import { Search } from 'lucide-react';
import { LoadingScreen } from '../components/LoadingScreen';
import { toast } from 'sonner';

type ContentType = 'memes' | 'templates' | 'all';

export const Gallery = () => {
  const session = useSession();
  const [contentType, setContentType] = useState<ContentType>('all');
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [likedMemes, setLikedMemes] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [fetchedMemes, userLikedMemes] = await Promise.all([
          getMemes(contentType === 'all' ? undefined : contentType.slice(0, -1) as 'meme' | 'template'),
          session?.user ? getUserLikedMemes(session.user.id) : []
        ]);
        setMemes(fetchedMemes);
        setLikedMemes(userLikedMemes);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch memes');
      }
      setLoading(false);
    };

    fetchData();
  }, [contentType, session]);

  const toggleOptions = [
    { value: 'memes', label: 'Memes' },
    { value: 'templates', label: 'Templates' },
    { value: 'all', label: 'All' },
  ];

  const filteredMemes = memes.filter(meme => 
    meme.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleLike = async (meme: Meme) => {
    if (!session?.user) {
      toast.error('Please log in to like memes');
      return;
    }

    try {
      if (likedMemes.includes(meme.id)) {
        await unlikeMeme(meme.id, session.user.id);
        setLikedMemes(likedMemes.filter(id => id !== meme.id));
      } else {
        await likeMeme(meme.id, session.user.id);
        setLikedMemes([...likedMemes, meme.id]);
      }
    } catch (error) {
      console.error('Error liking/unliking meme:', error);
      toast.error('Failed to like/unlike meme');
    }
  };

  const handleDelete = async (meme: Meme) => {
    if (!session?.user) {
      toast.error('Please log in to delete memes');
      return;
    }

    if (meme.user_id !== session.user.id) {
      toast.error('You can only delete your own memes');
      return;
    }

    try {
      await deleteMeme(meme.id, session.user.id);
      setMemes(memes.filter(m => m.id !== meme.id));
      toast.success('Meme deleted successfully');
    } catch (error) {
      console.error('Error deleting meme:', error);
      toast.error('Failed to delete meme');
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-[#0A0A0F] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <div className="pt-24 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto mb-8"
        >
          <Toggle
            options={toggleOptions}
            value={contentType}
            onChange={(value) => setContentType(value as ContentType)}
          />
        </motion.div>

        <div className="max-w-3xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-black/40 border border-purple-500/20 text-white focus:outline-none focus:border-purple-500"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <Search className="w-6 h-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-gradient-x" />
            </button>
          </div>
        </div>

        <MemeGrid 
          memes={filteredMemes} 
          likedMemes={likedMemes}
          onLike={handleLike}
          onDelete={handleDelete}
          currentUserId={session?.user?.id}
        />
      </div>
    </div>
  );
};

export default Gallery;

