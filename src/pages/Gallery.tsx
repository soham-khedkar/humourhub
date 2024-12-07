import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Toggle } from '../components/ui/Toggle';
import { MemeGrid } from '../components/MemeGrid';
import { getMemes } from '../lib/supabase';
import { Meme } from '../types';

type ContentType = 'memes' | 'templates' | 'all';

export const Gallery = () => {
  const [contentType, setContentType] = useState<ContentType>('all');
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemes = async () => {
      setLoading(true);
      try {
        const data = await getMemes(contentType === 'all' ? undefined : contentType.slice(0, -1) as 'meme' | 'template');
        setMemes(data);
      } catch (error) {
        console.error('Error fetching memes:', error);
      }
      setLoading(false);
    };

    fetchMemes();
  }, [contentType]);

  const toggleOptions = [
    { value: 'memes', label: 'Memes' },
    { value: 'templates', label: 'Templates' },
    { value: 'all', label: 'All' },
  ];

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

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
            />
          </div>
        ) : (
          <MemeGrid memes={memes} />
        )}
      </div>
    </div>
  );
};

