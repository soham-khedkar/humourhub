import React from 'react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  title: string;
  description: string;
  gifUrl: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, gifUrl }) => {
  return (
    <motion.div
      className="bg-black/40 backdrop-blur-lg rounded-lg overflow-hidden border border-purple-500/20 p-6 lg:p-8 flex flex-col h-full"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="mb-4 lg:mb-6 flex-grow">
        <img
          src={gifUrl}
          alt={title}
          className="w-full h-48 lg:h-64 object-cover rounded-lg"
        />
      </div>
      <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2 lg:mb-4">{title}</h3>
      <p className="text-gray-300 text-lg lg:text-xl">{description}</p>
    </motion.div>
  );
};

