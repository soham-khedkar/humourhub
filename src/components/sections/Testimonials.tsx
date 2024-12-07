import { motion } from 'framer-motion';

const testimonials = [
  {
    content: "Best meme collection I've ever seen! The sharing feature is amazing.",
    author: "Sarah J.",
    role: "Meme Enthusiast"
  },
  {
    content: "Finally, a place to store all my rare Pepes safely!",
    author: "Mike R.",
    role: "Digital Collector"
  },
  {
    content: "The UI is so clean and the animations are butter smooth.",
    author: "Alex K.",
    role: "Web Developer"
  }
];

export const Testimonials = () => {
  return (
    <section className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold text-center text-white mb-12 pixel-text"
        >
          What Memers Say
        </motion.h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-purple-900/20 backdrop-blur-sm p-6 rounded-xl border border-purple-500/20"
            >
              <p className="text-gray-300 mb-4">{testimonial.content}</p>
              <div>
                <p className="text-purple-400 font-semibold">{testimonial.author}</p>
                <p className="text-gray-500 text-sm">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};