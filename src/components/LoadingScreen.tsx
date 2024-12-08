import { motion } from 'framer-motion';
export const LoadingScreen = () => {
  const meteorVariants = {
    initial: { x: -100, y: -100, opacity: 0 },
    animate: { 
      x: 800, 
      y: 800, 
      opacity: [0, 1, 0],
      transition: { 
        duration: 2,
        repeat: Infinity,
        repeatType: 'loop' as 'loop',
        ease: "linear"
      }
    }
  };
  const textVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };
  const loadingPhrases = [
    "Loading dank memes...",
    "Generating humor...",
    "Stealing memes from Reddit...",
    "Consulting the meme lords...",
    "Searching for original content...",
    "Calculating humor quotient...",
  ];
  return (
    <div className="fixed inset-0 bg-[#0A0A0F] flex items-center justify-center overflow-hidden">
      <div className="relative w-full h-full">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-500 rounded-full"
            variants={meteorVariants}
            initial="initial"
            animate="animate"
            style={{ 
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
        
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center"
          initial="initial"
          animate="animate"
        >
          <motion.div
            className="w-50 h-50 mb-8"
            animate={{ 
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <img
              src="https://media1.tenor.com/m/C4__0sQ_-4wAAAAd/hold-up-let-him-cook.gif"
              alt="Loading"
              className="w-full h-full object-contain"
            />
          </motion.div>
          
          <motion.p
            variants={textVariants}
            className="text-xl text-purple-400 font-bold"
          >
            {loadingPhrases[Math.floor(Math.random() * loadingPhrases.length)]}
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};