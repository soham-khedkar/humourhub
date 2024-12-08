import { useState, useEffect } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { motion } from 'framer-motion';
import { User, Heart, ImageIcon } from 'lucide-react';
import { getMemes } from '../lib/supabase';
import { Meme } from '../types';
import { MemeGrid } from '../components/MemeGrid'; // Assuming MemeGrid is imported from here

export function Profile() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const [likedMemes, setLikedMemes] = useState<Meme[]>([]);
  const [roast, setRoast] = useState('');

  useEffect(() => {
    if (session?.user) {
      fetchLikedMemes();
      generateRoast();
    }
  }, [session]);

  const fetchLikedMemes = async () => {
    try {
      const { data, error } = await supabase
        .from('likes')
        .select('meme_id')
        .eq('user_id', session?.user.id);

      if (error) throw error;

      const memeIds = data.map(like => like.meme_id);
      const memes = await getMemes();
      const userLikedMemes = memes.filter(meme => memeIds.includes(meme.id));
      setLikedMemes(userLikedMemes);
    } catch (error) {
      console.error('Error fetching liked memes:', error);
    }
  }

  const generateRoast = () => {
    const roasts = [
      "Your meme game is weaker than your Wi-Fi signal.",
      "I've seen better memes in my grandma's Facebook feed.",
      "Your meme taste is like your fashion sense - stuck in 2010.",
      "If memes were currency, you'd be living in a cardboard box.",
      "Your meme collection is more disappointing than a pizza without cheese."
    ];
    setRoast(roasts[Math.floor(Math.random() * roasts.length)]);
  };

  const handleDeleteMeme = (meme: Meme) => {
    // Implement your delete meme logic here
    console.log('Delete meme:', meme.id);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] text-white pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/40 backdrop-blur-lg rounded-lg p-8 mb-8 hover:shadow-lg hover:border hover:border-purple-500/20 transition-all duration-300"
        >
          <div className="flex items-center mb-4">
            <User className="w-12 h-12 text-purple-500 mr-4" />
            <h1 className="text-4xl font-bold">{session?.user.user_metadata.full_name || 'Meme Enthusiast'}</h1>
          </div>
          <p className="text-xl text-gray-300 mb-4">{session?.user.email}</p>
          <p className="text-lg text-yellow-300 italic">"{roast}"</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-black/40 backdrop-blur-lg rounded-lg p-8 mb-8 hover:shadow-lg hover:border hover:border-purple-500/20 transition-all duration-300"
        >
          <div className="flex items-center mb-4">
            <Heart className="w-8 h-8 text-red-500 mr-2" />
            <h2 className="text-2xl font-bold">Liked Memes</h2>
          </div>
          <MemeGrid 
            memes={likedMemes} 
            likedMemes={likedMemes.map(meme => meme.id)}
            onLike={() => {}} 
            onDelete={handleDeleteMeme}
            currentUserId={session?.user?.id}
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-black/40 backdrop-blur-lg rounded-lg p-8 hover:shadow-lg hover:border hover:border-purple-500/20 transition-all duration-300"
        >
          <div className="flex items-center mb-4">
            <ImageIcon className="w-8 h-8 text-green-500 mr-2" />
            <h2 className="text-2xl font-bold">Meme Stats</h2>
          </div>
          <p className="text-lg">Total Likes: {likedMemes.length}</p>
          <p className="text-lg">Meme Lord Level: {Math.floor(likedMemes.length / 10)}</p>
        </motion.div>
      </div>
    </div>
  );
}

export default Profile;

