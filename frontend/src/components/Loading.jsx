import React from 'react';
import LogoImg from '../assets/CPMS.png';
import LogoVid from '../assets/CPMS.mp4';

function LoadingComponent() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-gradient-to-b from-white to-blue-50">
      <div className="relative flex flex-col items-center justify-between">
        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute w-24 h-24 bg-blue-100 rounded-full top-10 left-10 animate-pulse-slow"></div>
          <div className="absolute w-32 h-32 bg-blue-100 rounded-full bottom-10 right-10 animate-pulse-slow animation-delay-500"></div>
          <div className="absolute w-16 h-16 bg-blue-100 rounded-full top-1/4 right-10 animate-pulse-slow animation-delay-1000"></div>
          <div className="absolute w-20 h-20 bg-blue-100 rounded-full bottom-1/3 left-20 animate-pulse-slow animation-delay-1500"></div>
        </div>

        {/* Main content */}
        <div className="flex flex-col items-center p-8 border border-blue-100 shadow-xl bg-white/70 backdrop-blur-md rounded-2xl">
          {/* Logo with glow effect */}
          <div className="relative mb-6">
            <div className="absolute inset-0 scale-110 rounded-full bg-blue-500/20 blur-xl animate-pulse-slow"></div>
            <div className="relative">
              {/* Uncomment to use video instead of image */}
              {/* <video 
                width="300" 
                height="300" 
                autoPlay 
                loop 
                muted 
                className="transition-transform duration-700 transform shadow-lg rounded-xl hover:scale-105"
              >
                <source src={LogoVid} type="video/mp4" />
              </video> */}
              
              <img 
                src={LogoImg} 
                alt="CareerConnect Logo" 
                width="300" 
                height="300" 
                className="transition-transform duration-700 transform shadow-lg rounded-xl hover:scale-105"
              />
            </div>
          </div>

          {/* Loading indicator */}
          <div className="flex flex-col items-center gap-4">
            {/* Animated loading indicator */}
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-solid rounded-full"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 border-solid rounded-full border-t-transparent animate-spin"></div>
            </div>
            
            {/* Loading text with typing animation */}
            <div className="mt-2 text-center">
              <p className="overflow-hidden text-xl font-medium text-blue-800 border-r-4 border-blue-800 animate-typing whitespace-nowrap">
                Hold your seat tightly, we are coming...
              </p>
              
              <p className="mt-2 text-sm text-blue-600 animate-fade-in">
                Setting up your personalized career experience
              </p>
            </div>
          </div>
        </div>
        
        {/* Progress dots */}
        <div className="flex gap-2 mt-8">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className={`w-2 h-2 rounded-full bg-blue-600 opacity-30 animate-pulse-slow`}
              style={{ animationDelay: `${i * 200}ms` }}
            ></div>
          ))}
        </div>
      </div>
      
      {/* Custom animations */}
      <style jsx>{`
        @keyframes typing {
          from { width: 0 }
          to { width: 100% }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-typing {
          animation: typing 3s steps(40, end);
          width: fit-content;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        .animation-delay-500 {
          animation-delay: 500ms;
        }
        
        .animation-delay-1000 {
          animation-delay: 1000ms;
        }
        
        .animation-delay-1500 {
          animation-delay: 1500ms;
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-in-out forwards;
          animation-delay: 2s;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}

export default LoadingComponent;
