import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Share2, Download, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { Meme } from '../types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';

interface MemeGridProps {
  memes: Meme[];
  likedMemes: string[];
  onLike: (meme: Meme) => void;
  onDelete: (meme: Meme) => void;
  currentUserId?: string;
}

export const MemeGrid: React.FC<MemeGridProps> = ({ memes, likedMemes, onLike, onDelete, currentUserId }) => {
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
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
            className="w-full h-48 sm:h-64 object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onLike(meme)}
                className="text-white hover:text-red-500 transition-colors p-2"
              >
                <Heart size={24} fill={likedMemes.includes(meme.id) ? 'currentColor' : 'none'} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => copyMemeUrl(meme.url)}
                className="text-white hover:text-blue-500 transition-colors p-2"
              >
                <Share2 size={24} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => downloadMeme(meme.url, meme.title)}
                className="text-white hover:text-green-500 transition-colors p-2"
              >
                <Download size={24} />
              </motion.button>
              {meme.user_id === currentUserId && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-white hover:text-red-500 transition-colors p-2"
                    >
                      <Trash size={24} />
                    </motion.button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the meme.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDelete(meme)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2 text-white">{meme.title}</h3>
            <p className="text-sm text-gray-400 mb-2">Created by: {meme.username}</p>
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
            {/* <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart size={20} className="text-red-500" />
                <span>{likedMemes.includes(meme.id) ? (meme.likes ?? 0) + 1 : meme.likes ?? 0}</span>
              </div>
            </div> */}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default MemeGrid;

