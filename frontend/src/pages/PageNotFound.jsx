import React from 'react';
import { Link } from 'react-router-dom';
import Img from '../assets/404Img.jpg';

function PageNotFound() {
  document.title = 'CareerConnect | Page Not Found';
  
  return (
    <div className="flex items-center justify-center min-h-screen px-6 py-8 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-5xl overflow-hidden bg-white shadow-2xl rounded-2xl">
        <div className="flex flex-col items-center md:flex-row">
          {/* Image Section */}
          <div className="w-full p-8 transition-transform duration-500 transform md:w-1/2 hover:scale-105">
            <img 
              src={Img} 
              alt="404 Error Illustration" 
              className="object-cover w-full h-auto rounded-lg shadow-md"
            />
          </div>

          {/* Content Section */}
          <div className="w-full p-8 space-y-6 text-center md:w-1/2 md:text-left">
            <h1 className="font-extrabold tracking-widest text-blue-600 text-9xl animate-pulse">
              404
            </h1>
            
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-gray-800">
                <span className="block mb-2 text-5xl text-red-500 animate-bounce">
                  Oops!
                </span>
                Page Not Found
              </h2>
              
              <p className="text-lg text-gray-600">
                The page you're looking for seems to have taken a coffee break.
              </p>
            </div>

            <Link 
              to='/' 
              className="inline-flex items-center px-6 py-3 text-lg font-semibold text-white transition-colors duration-300 bg-blue-600 rounded-lg shadow-lg hover:bg-blue-500 group"
            >
              <span className="mr-2 transition-transform transform group-hover:translate-x-1">
                <i className="fa-solid fa-house" />
              </span>
              Back to Home
            </Link>

            {/* Additional Help */}
            <div className="pt-6 mt-8 border-t border-gray-200">
              <p className="text-gray-600">
                Need help? 
                <Link to="/contact" className="ml-2 text-blue-600 hover:underline">
                  Contact Support
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageNotFound;
