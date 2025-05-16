import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 text-slate-300 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">© {new Date().getFullYear()} AudioFilter. All rights reserved.</p>
          </div>
          <div className="flex space-x-6">
            <a 
              href="#" 
              className="text-slate-300 hover:text-white transition-colors duration-200"
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              className="text-slate-300 hover:text-white transition-colors duration-200"
            >
              Terms of Service
            </a>
            <a 
              href="#" 
              className="text-slate-300 hover:text-white transition-colors duration-200"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;