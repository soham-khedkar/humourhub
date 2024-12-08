import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { ChevronRight } from 'lucide-react';
import { getMemes } from '../lib/supabase';
import { Meme } from '../types';
import { FeatureCard } from '../components/FeatureCard';
import WordRotate from '../components/ui/word-rotate';
import { AnimatedTestimonials } from '../components/ui/animated-testimonials';
import { Footer } from '../components/sections/Footer';
import AnimatedGradientText from '../components/ui/animated-gradient-text';
import { cn } from '../lib/utils';
import GridPattern from '../components/ui/grid-pattern';

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
      description: "We got a good collection of templates for you to choose from full of dank humor you might like 🌚",
      gifUrl: "https://media.giphy.com/media/Y1qTxzVXuJsIcLzJyV/giphy.gif?cid=790b7611o919rbz2mo9z3ushy0eiz4ef9sny1ouerujfl16j&ep=v1_gifs_search&rid=giphy.gif&ct=g"
    },
    {
      title: "Share & Spread joy",
      description: "Share your creativity with the world and spread joy with your memes.",
      gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbHl4ajFjODdsM3E2dDg5aDE0dWRxdW84cDlrdWRmZmNla3JhdXQ2byZlcD12MV9naWZzX3NlYXJjaCZjdD1n/l2Je2TSWnlJB96UDK/giphy.gif"
    }
  ];

  const testimonials = [
    {
      quote: "I'm gonna cum to this website again and again and again.",
      name: "Donad Trump",
      designation: "OG President of the United States",
      src: "https://images.unsplash.com/photo-1580128660010-fd027e1e587a?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      quote: "Shut up Meg! This site is awesome.",
      name: "Peter Griffin",
      designation: "Family Guy",
      src: "https://ai.flux-image.com/flux/934a4c9d-c101-4f01-b7b9-dc88f53fb57a.jpg"
    },
    {
      quote: "Let's go to the moon with this website.",
      name: "Elon Musk",
      designation: "CEO, SpaceX",
      src: "https://i.pinimg.com/736x/08/21/17/0821177432c8d7d70644febfdde912dd.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <GridPattern
        width={40}
        height={40}
        className="absolute inset-0 z-0 opacity-50"
      />
      <div className="relative z-10 pt-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center px-4 py-20"
        >
          <WordRotate
            className="text-6xl font-bold text-white"
            duration={500} 
            words={["BHAI", "WO" , "MEME", "DEKHA", "KYA"]}
          />

          {!session && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-8 flex justify-center"
            >
              <div
                onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}
                className="cursor-pointer"
              >
                <AnimatedGradientText className="text-lg sm:text-xl md:text-2xl py-3 px-6">
                  🎉 <hr className="mx-2 h-6 w-px shrink-0 bg-gray-300" />{" "}
                  <span
                    className={cn(
                      `inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`,
                    )}
                  >
                    Get Started!!
                  </span>
                  <ChevronRight className="ml-2 inline-block size-5 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
                </AnimatedGradientText>
              </div>
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
                className="aspect-square bg-gray-800 rounded-lg overflow-hidden border border-gray-700 group hover:border-purple-500 transition-colors"
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

        <div className="bg-transparent py-20">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">What Our Users Say</h2>
          <AnimatedTestimonials testimonials={testimonials} autoplay={true} />
        </div>
      </div>
      
      <div>
      <Footer />
      </div>
    </div>
  );
};

export default Home;

