import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

export const Terms = () => {
  const terms = [
    {
      title: "No Bad Memes",
      description: "If you post bad memes, we reserve the right to roast you publicly.",
    },
    {
      title: "Privacy",
      description: "We promise not to sell your data... unless someone offers us a really good meme in exchange.",
    },
    {
      title: "No Spam",
      description: "Don't spam the site with the same meme. We get it, you think it's funny. We don't.",
    },
    {
      title: "Respect",
      description: "Treat others with respect. Unless their memes are trash, then all bets are off.",
    },
    {
      title: "Content Ownership",
      description: "You own your memes, but by posting them here, you give us the right to laugh at them.",
    },
    {
      title: "Changes to Terms",
      description: "We can change these terms whenever we want. But let's be real, we probably won't.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8 pixel-text">Terms and Conditions</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {terms.map((term, index) => (
          <motion.div
            key={index}
            className="bg-black/20 p-6 rounded-lg shadow-lg border border-purple-500/20"
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-4 pixel-text">{term.title}</h2>
            <p className="pixel-text">{term.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Terms;