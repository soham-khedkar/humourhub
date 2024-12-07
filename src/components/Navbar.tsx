import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react';
import { ImagePlus, LogOut, User, Menu, X, Grid, Edit3 } from 'lucide-react';
import { RainbowButton } from './ui/RainbowButton';

export const Navbar = () => {
  const supabase = useSupabaseClient();
  const session = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const menuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const NavItems = () => (
    <>
      {session ? (
        <div className="md:flex md:items-center md:gap-4 flex flex-col md:flex-row w-full">
          <Link 
            to="/gallery" 
            onClick={() => setIsMenuOpen(false)}
            className={`px-4 py-3 md:py-2 rounded-lg transition-all duration-300 flex items-center gap-2 w-full md:w-auto ${
              location.pathname === '/gallery' 
                ? 'bg-purple-500/20 text-purple-300' 
                : 'hover:bg-purple-500/20 text-white'
            }`}
          >
            <Grid size={20} />
            <span>Gallery</span>
          </Link>

          <Link 
            to="/upload" 
            onClick={() => setIsMenuOpen(false)}
            className={`px-4 py-3 md:py-2 rounded-lg transition-all duration-300 flex items-center gap-2 w-full md:w-auto ${
              location.pathname === '/upload' 
                ? 'bg-purple-500/20 text-purple-300' 
                : 'hover:bg-purple-500/20 text-white'
            }`}
          >
            <ImagePlus size={20} />
            <span>Upload</span>
          </Link>

          <Link 
            to="/edit" 
            onClick={() => setIsMenuOpen(false)}
            className={`px-4 py-3 md:py-2 rounded-lg transition-all duration-300 flex items-center gap-2 w-full md:w-auto ${
              location.pathname === '/edit' 
                ? 'bg-purple-500/20 text-purple-300' 
                : 'hover:bg-purple-500/20 text-white'
            }`}
          >
            <Edit3 size={20} />
            <span>Edit Your Meme</span>
          </Link>
          
          <div className="h-px md:h-6 w-full md:w-px bg-purple-500/20 my-2 md:my-0" />
          
          <Link
            to="/profile"
            onClick={() => setIsMenuOpen(false)}
            className={`flex items-center gap-2 px-4 py-3 md:py-2 rounded-lg transition-all duration-300 w-full md:w-auto ${
              location.pathname === '/profile'
                ? 'bg-purple-500/20 text-purple-300'
                : 'hover:bg-purple-500/20 text-white/80'
            }`}
          >
            <User size={20} />
            <span>{session.user.email?.split('@')[0]}</span>
          </Link>
          
          <button
            onClick={() => {
              supabase.auth.signOut();
              setIsMenuOpen(false);
            }}
            className="flex items-center gap-2 text-white/80 hover:text-red-400 transition-colors px-4 py-3 md:py-2 w-full md:w-auto justify-start"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      ) : (
        <div className="px-4 py-2 w-full md:w-auto">
          <RainbowButton
            onClick={() => {
              supabase.auth.signInWithOAuth({ provider: 'google' });
              setIsMenuOpen(false);
            }}
            className="w-full md:w-auto"
          >
            Login
          </RainbowButton>
        </div>
      )}
    </>
  );

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-black/20 backdrop-filter backdrop-blur-lg border-b border-purple-500/20 text-white p-4 fixed w-full top-0 z-50"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-bold flex items-center gap-2 pixel-text">
          <span className="text-white">Humour</span>
          <span className="bg-[#f90] text-black px-2 rounded">Hub</span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center">
          <NavItems />
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="md:hidden bg-black/60 backdrop-blur-lg mt-4 rounded-lg border border-purple-500/20"
          >
            <div className="flex flex-col py-2">
              <NavItems />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

