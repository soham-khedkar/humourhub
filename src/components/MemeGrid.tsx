import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Share2, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { Meme } from '../types';
import { supabase } from '../lib/supabase';

interface MemeGridProps {
  memes: Meme[];
}

export const MemeGrid: React.FC<MemeGridProps> = ({ memes }) => {
  const [likedMemes, setLikedMemes] = useState<Set<string>>(new Set());

  const copyMemeUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard!');
  };

  const downloadMeme = (url: string, title: string) => {
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${title}.jpg`;
        link.click();
        URL.revokeObjectURL(link.href);
      })
      .catch(() => toast.error('Failed to download meme'));
  };

  const likeMeme = async (meme: Meme) => {
    if (likedMemes.has(meme.id)) {
      toast.error('You have already liked this meme');
      return;
    }

    try {
      const { error } = await supabase
        .from('memes')
        .update({ likes: meme.likes + 1 })
        .eq('id', meme.id)
        .select();

      if (error) throw error;

      setLikedMemes(new Set(likedMemes).add(meme.id));
      toast.success('Meme liked!');
    } catch (error) {
      console.error('Error liking meme:', error);
      toast.error('Failed to like meme');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {memes.map((meme) => (
        <motion.div
          key={meme.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          className="bg-black/40 backdrop-blur-lg rounded-lg overflow-hidden border border-purple-500/20 relative group"
        >
          <img
            src={meme.url}
            alt={meme.title}
            className="w-full h-64 object-cover"
            loading="lazy"
          />
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          >
            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => likeMeme(meme)}
                className="text-white hover:text-red-500 transition-colors"
              >
                <Heart size={24} fill={likedMemes.has(meme.id) ? 'currentColor' : 'none'} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => copyMemeUrl(meme.url)}
                className="text-white hover:text-blue-500 transition-colors"
              >
                <Share2 size={24} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => downloadMeme(meme.url, meme.title)}
                className="text-white hover:text-green-500 transition-colors"
              >
                <Download size={24} />
              </motion.button>
            </div>
          </motion.div>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2 text-white">{meme.title}</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {meme.tags?.map((tag) => (
                <span 
                  key={tag} 
                  className="px-2 py-1 text-sm bg-purple-500/20 text-purple-300 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart size={20} className="text-red-500" />
                <span>{meme.likes}</span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

