import { Github, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 pixel-text">HumourHub</h3>
            <p className="text-gray-400 text-xl">Your one-stop destination for the dankest memes on the internet.You don't get memes made out of these dank thoughts 😁</p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-purple-400">Home</Link></li>
              <li><Link to="/upload" className="text-gray-400 hover:text-purple-400">Upload</Link></li>
              <li><Link to="/edit" className="text-gray-400 hover:text-purple-400">Edit memes/template</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-gray-400 hover:text-purple-400">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-purple-400">Terms of Service</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="https://twitter.com" className="text-gray-400 hover:text-purple-400">
                <Twitter size={24} />
              </a>
              <a href="https://github.com" className="text-gray-400 hover:text-purple-400">
                <Github size={24} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} HumourHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};