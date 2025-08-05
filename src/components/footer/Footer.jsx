import React from 'react';
import { Link } from 'react-router';
import { 
  FaGithub, 
  FaLinkedin, 
  FaTwitter, 
  FaInstagram,
  FaFacebook,
  FaEnvelope,
  FaHeart,
  FaCode
} from 'react-icons/fa';
import { BiCoffee } from 'react-icons/bi';
import Logo from '../../layouts/Logo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

return (
  <footer className="bg-gradient-to-r relative z-[9999] from-blue-600 via-purple-600 to-blue-600 text-white">
    {/* Main Footer Content */}
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Brand & Developer Info */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FaCode className="text-xl text-white" />
            </div>
            <Logo/>
          </div>
          
          <p className="text-gray-300 mb-6 leading-relaxed">
            A modern real-time chat application built with passion and cutting-edge technology. 
            Connect, share, and communicate seamlessly with friends and family.
          </p>

          {/* Developer Info */}
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">MH</span>
              </div>
              <div>
                <h4 className="font-semibold text-white">Meheraj Hossain</h4>
                <p className="text-sm text-gray-400">Full Stack Developer</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <span>Made with</span>
              <FaHeart className="text-red-500 animate-pulse" />
              <span>and</span>
              <BiCoffee className="text-yellow-600" />
              <span>in Bangladesh</span>
            </div>
          </div>
        </div>

        {/* Connect & Support */}
        <div className="flex flex-col">
          <h4 className="text-lg font-semibold mb-4 text-white">Connect With Developer</h4>
          
          {/* Social Links */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            <a 
              href="https://github.com/meheraj786" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 bg-slate-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
            >
              <FaGithub className="text-lg" />
            </a>
            
            <a 
              href="https://linkedin.com/in/meheraj-hossain" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
            >
              <FaLinkedin className="text-lg" />
            </a>
            
            <a 
              href="https://twitter.com/meheraj786" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 bg-slate-800 hover:bg-sky-500 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
            >
              <FaTwitter className="text-lg" />
            </a>
            
            <a 
              href="mailto:meheraj.dev@gmail.com" 
              className="w-12 h-12 bg-slate-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
            >
              <FaEnvelope className="text-lg" />
            </a>
          </div>

          {/* Support */}
          <div className="text-sm text-gray-400 space-y-2">
            <p className="flex items-center gap-2">
              <span>🚀</span>
              <span>Built with React & Firebase</span>
            </p>
            <p className="flex items-center gap-2">
              <span>💡</span>
              <span>Open for collaborations</span>
            </p>
            <p className="flex items-center gap-2">
              <span>⭐</span>
              <span>Star on GitHub if you like it!</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Bottom Bar */}
    <div className="border-t border-slate-700 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Copyright */}
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-400">
              © {currentYear} ChatApp. Crafted by{' '}
              <a 
                href="https://github.com/meheraj786" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 font-semibold border-b border-transparent hover:border-blue-300 transition-all duration-200"
              >
                Meheraj Hossain
              </a>
              . All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  </footer>
);
};

export default Footer;