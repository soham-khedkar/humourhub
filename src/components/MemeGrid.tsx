import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Meme } from '../types';

interface MemeGridProps {
  memes: Meme[];
}

export const MemeGrid: React.FC<MemeGridProps> = ({ memes }) => {
  const copyMemeUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard!');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {memes.map((meme) => (
        <motion.div
          key={meme.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          className="bg-black/40 backdrop-blur-lg rounded-lg overflow-hidden border border-purple-500/20"
        >
          <img
            src={meme.url}
            alt={meme.title}
            className="w-full h-64 object-cover"
            loading="lazy"
          />
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
                <button className="flex items-center gap-1 text-gray-400 hover:text-red-400 transition-colors">
                  <Heart size={20} />
                  <span>{meme.likes}</span>
                </button>
              </div>
              <button
                onClick={() => copyMemeUrl(meme.url)}
                className="flex items-center gap-1 text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Share2 size={20} />
                <span>Share</span>
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};