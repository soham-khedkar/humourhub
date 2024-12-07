import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { ImagePlus, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Testimonials } from '../components/sections/Testimonials';
import { Footer } from '../components/sections/Footer';
import { getMemes } from '../lib/supabase';
import { Meme } from '../types';
import { Link } from 'react-router-dom';
import HyperText from '../components/ui/hyper-text';

export const Home = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const [recentContent, setRecentContent] = useState<{
    memes: Meme[];
    templates: Meme[];
  }>({
    memes: [],
    templates: [],
  });

  useEffect(() => {
    const fetchRecentContent = async () => {
      try {
        const [memes, templates] = await Promise.all([
          getMemes('meme'),
          getMemes('template')
        ]);
        setRecentContent({
          memes: memes.slice(0, 4),
          templates: templates.slice(0, 4)
        });
      } catch (error) {
        console.error('Error fetching recent content:', error);
      }
    };

    fetchRecentContent();
  }, []);

  const PreviewSection = ({ title, items }: { title: string; items: Meme[] }) => (
    <div className="mb-20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white pixel-text flex items-center gap-2">
          <Sparkles className="text-purple-400" />
          {title}
        </h2>
        <Link 
          to="/gallery" 
          className="text-purple-400 hover:text-purple-300 transition-colors pixel-text text-sm"
        >
          View All →
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            className="aspect-square bg-black/40 rounded-lg overflow-hidden border border-purple-500/20 group hover:border-purple-500/40 transition-colors"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="relative h-full">
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white text-sm font-medium truncate">{item.title}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-[#0A0A0F] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] text-white pt-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center px-4 py-20"
        >
          <HyperText
            text="SUP MY BOII"
            className="text-5xl md:text-7xl font-bold mb-6 pixel-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 text-transparent bg-clip-text"
          />
          
          <HyperText
            text="Your one-stop destination for the dankest memes and templates"
            className="text-xl md:text-2xl text-gray-400 mb-12"
          />

          {!session && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                variant="gradient"
                size="lg"
                onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}
                className="flex items-center gap-2"
              >
                <ImagePlus size={24} />
                Get Started
              </Button>
            </motion.div>
          )}
        </motion.div>

        <div className="max-w-6xl mx-auto px-4 pb-20">
          <PreviewSection 
            title="Recent Memes" 
            items={recentContent.memes}
          />
          <PreviewSection 
            title="Recent Templates" 
            items={recentContent.templates}
          />
        </div>
      </div>
      
      <Testimonials />
      <Footer />
    </>
  );
};

