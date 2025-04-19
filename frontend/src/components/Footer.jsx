import React from 'react';
import { FaBriefcase, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaCode } from 'react-icons/fa';

function Footer({ isSidebarVisible }) {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={`transition-all duration-300 ${
      isSidebarVisible ? 'md:ml-60 md:w-[calc(100%-15rem)]' : 'ml-0 w-full'
    }`}>
      <div className="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="container px-4 py-3 mx-auto">
          <div className="flex flex-col items-center justify-between sm:flex-row">
            {/* Logo and copyright */}
            <div className="flex items-center mb-2 sm:mb-0">
              <div className="flex items-center justify-center mr-2 text-white rounded-md shadow-sm w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600">
                <FaBriefcase className="text-xs" />
              </div>
              <span className="text-sm font-bold tracking-wide text-gray-800">CareerConnect</span>
              <span className="mx-2 text-xs text-gray-400">|</span>
              <span className="text-xs text-gray-500">
                © {currentYear} All rights reserved
              </span>
            </div>
            
            {/* Right section with social links and version */}
            <div className="flex items-center space-x-4">
              {/* Social icons */}
              <div className="flex space-x-2">
                <a href="#" className="flex items-center justify-center w-6 h-6 text-gray-600 transition-all bg-gray-100 rounded-full hover:bg-blue-600 hover:text-white hover:shadow-sm">
                  <FaFacebookF className="text-xs" />
                </a>
                <a href="#" className="flex items-center justify-center w-6 h-6 text-gray-600 transition-all bg-gray-100 rounded-full hover:bg-blue-400 hover:text-white hover:shadow-sm">
                  <FaTwitter className="text-xs" />
                </a>
                <a href="#" className="flex items-center justify-center w-6 h-6 text-gray-600 transition-all bg-gray-100 rounded-full hover:bg-pink-600 hover:text-white hover:shadow-sm">
                  <FaInstagram className="text-xs" />
                </a>
                <a href="#" className="flex items-center justify-center w-6 h-6 text-gray-600 transition-all bg-gray-100 rounded-full hover:bg-blue-700 hover:text-white hover:shadow-sm">
                  <FaLinkedinIn className="text-xs" />
                </a>
              </div>
              
              {/* Divider */}
              <span className="hidden w-px h-4 bg-gray-300 sm:inline-block"></span>
              
              {/* Created by */}
              <div className="items-center hidden text-xs text-gray-500 sm:flex">
                <span className="flex items-center">
                  <FaCode className="w-3 h-3 mr-1 text-gray-400" />
                  Developed by
                </span>
                <a href="#" className="ml-1 font-medium text-blue-600 transition-colors hover:text-blue-800 hover:underline">Debashis</a>
                <span className="mx-1">&</span>
                <a href="#" className="font-medium text-blue-600 transition-colors hover:text-blue-800 hover:underline">Team</a>
              </div>
              
              {/* Version */}
              <div className="flex items-center px-2 py-0.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full border border-blue-100 shadow-sm">
                <span className="text-xs font-medium text-blue-600">v</span>
                <span className="text-xs font-bold text-indigo-700">1.0.1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
