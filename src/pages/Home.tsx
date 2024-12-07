import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { ImagePlus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Footer } from '../components/sections/Footer';
import { getMemes } from '../lib/supabase';
import { Meme } from '../types';
import { FeatureCard } from '../components/FeatureCard';
import WordRotate from '../components/ui/word-rotate';
import { AnimatedTestimonials } from '../components/ui/animated-testimonials';

export const Home = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const [mostLikedMemes, setMostLikedMemes] = useState<Meme[]>([]);

  useEffect(() => {
    const fetchMostLikedMemes = async () => {
      try {
        const memes = await getMemes();
        const sortedMemes = memes.sort((a, b) => b.likes - a.likes).slice(0, 6);
        setMostLikedMemes(sortedMemes);
      } catch (error) {
        console.error('Error fetching most liked memes:', error);
      }
    };

    fetchMostLikedMemes();
  }, []);

  const features = [
    {
      title: "Create Memes",
      description: "I see you looking for it we coming up with this feature soon bruv.",
      gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWJ5bDN0NzEzcnB1aWU5NXpsZW5keXoyOGg5YWNvcW8wYzc2YnpoMSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/UqZ4imFIoljlr5O2sM/giphy.gif"
    },
    {
      title: "Browse Templates",
      description: "Looking for some inspiration? Browse our collection of meme templates.",
      gifUrl: "https://media.giphy.com/media/Y1qTxzVXuJsIcLzJyV/giphy.gif?cid=790b7611o919rbz2mo9z3ushy0eiz4ef9sny1ouerujfl16j&ep=v1_gifs_search&rid=giphy.gif&ct=g"
    },
    {
      title: "Share & Spread joy",
      description: "Share your creativity with the world and spread joy with your memes.",
      gifUrl: "https://media.giphy.com/media/3o7aCTNjq3qiUbzrHi/giphy.gif"
    }
  ];

  const testimonials = [
    {
      quote: "This meme vault is lit! I've never laughed so hard in my life.",
      name: "Meme Lord",
      designation: "Professional Memer",
      src: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80"
    },
    {
      quote: "I've found my meme paradise. The templates are top-notch!",
      name: "Giggles McGee",
      designation: "Comedy Enthusiast",
      src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
    },
    {
      quote: "This site has revolutionized my meme game. I'm unstoppable now!",
      name: "Viral Victor",
      designation: "Social Media Influencer",
      src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHBvcnRyYWl0fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0F] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] text-white">
      <div className="pt-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center px-4 py-20"
        >
          <WordRotate
            className="text-6xl font-bold text-white dark:text-white"
            duration={500} 
            words={["BHAI", "WO" , "MEME", "DEKHA", "KYA"]}
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
                className="flex items-center gap-2 mt-8"
              >
                <ImagePlus size={24} />
                Get Started
              </Button>
            </motion.div>
          )}
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 pb-20">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">Look what we got!!</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>

          <h2 className="text-4xl font-bold text-white mb-12 text-center">Most Liked Memes</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {mostLikedMemes.map((meme, index) => (
              <motion.div
                key={meme.id}
                className="aspect-square bg-black/40 rounded-lg overflow-hidden border border-purple-500/20 group hover:border-purple-500/40 transition-colors"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="relative h-full">
                  <img
                    src={meme.url}
                    alt={meme.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white text-sm font-medium truncate">{meme.title}</p>
                      <p className="text-gray-300 text-xs">Likes: {meme.likes}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className=" py-20">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">What Our Memers Say</h2>
          <AnimatedTestimonials testimonials={testimonials} autoplay={true} />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

