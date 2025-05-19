import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-8 mt-16 text-center">
      <div className="flex items-center justify-center text-pink-600">
        <p className="text-sm">Made with</p>
        <Heart className="h-4 w-4 mx-1" fill="#FCA5A5" />
        <p className="text-sm">for you</p>
      </div>
      
      <p className="text-purple-700 mt-2 text-sm">
        Happy Birthday, my love! Today and always.
      </p>
    </footer>
  );
};

export default Footer;