import React, { useState, useEffect } from 'react';
import HeroImg from '../../assets/heroImg.jpg';
import { useNavigate } from 'react-router-dom';
import './styles/animations.css';
import axios from 'axios'; // Make sure axios is imported

function LandingHeroPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [mockupActive, setMockupActive] = useState(false);
  const [currentTime, setCurrentTime] = useState(''); // New state for current time
  
  // New states for mobile login form
  const [mobileEmail, setMobileEmail] = useState('');
  const [mobilePassword, setMobilePassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Animation on load
  useEffect(() => {
    setIsVisible(true);
    document.body.style.overflow = 'hidden';
    
    // Trigger mockup animation after initial load
    setTimeout(() => {
      setMockupActive(true);
    }, 1000);
    
    return () => {
      document.body.style.overflow = '';
    };
  }, []);
  
  // Current time update effect
  useEffect(() => {
    // Function to update the time
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12; // Convert to 12-hour format
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      setCurrentTime(`${formattedHours}:${formattedMinutes} ${ampm}`);
    };
    
    // Update time immediately and then every minute
    updateTime();
    const intervalId = setInterval(updateTime, 60000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleCreateAccount = () => {
    if (email.trim()) {
      navigate('/student/signup', { state: { prefillEmail: email } });
    } else {
      navigate('/student/signup');
    }
  }
  
  // Update this function to redirect to student login page instead of API login
  const handleMobileLogin = () => {
    // Navigate directly to student login page
    navigate('/student/login');
  }

  // Update this function to navigate to signup page
  const handleMobileCreateAccount = () => {
    navigate('/student/signup');
  }

  const features = [
    { icon: "fa-solid fa-briefcase", text: "Job Opportunities" },
    { icon: "fa-solid fa-building", text: "Top Companies" },
    { icon: "fa-solid fa-chart-line", text: "Career Growth" }
  ];

  return (
    <>
      <section
        id="home"
        className="fixed inset-0 flex items-center justify-center overflow-hidden bg-center bg-no-repeat bg-cover"
        style={{ backgroundImage: `url(${HeroImg})` }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="absolute w-20 h-20 rounded-full top-10 left-10 bg-blue-500/20 animate-float-slow"></div>
          <div className="absolute w-32 h-32 rounded-full bottom-20 right-10 bg-indigo-500/20 animate-float-medium"></div>
          <div className="absolute w-16 h-16 rounded-full top-1/3 right-1/4 bg-purple-500/20 animate-float-fast"></div>
        </div>

        {/* Dark glass overlay with gradient */}
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-black/70 via-black/60 to-black/70 backdrop-blur-sm"></div>

        {/* Main Content Container - Split Layout */}
        <div className="relative z-20 flex flex-col items-center w-full h-full px-4 py-8 mx-auto max-w-7xl md:flex-row">
        
          {/* LEFT SIDE - Content */}
          <div className={`w-full md:w-1/2 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="p-6 text-left">
              <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-3xl md:text-4xl lg:text-5xl drop-shadow-lg">
                <span className="block mb-4">Launch Your Professional Journey with</span>
                <span className="block text-2xl text-transparent sm:text-3xl md:text-4xl lg:text-5xl hover:scale-105 bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                  {'CareerConnect'.split('').map((letter, index) => (
                    <span 
                      key={index} 
                      style={{ 
                        animationDelay: `${index * 0.15}s`,
                        transition: 'color 0.3s ease'
                      }}
                      className="inline-block transition-all hover:text-blue-400 hover:scale-110"
                    >
                      {letter}
                    </span>
                  ))}
                </span>
              </h1>

              <p className="max-w-xl mt-6 text-lg font-light text-gray-200 sm:text-xl md:text-2xl">
                Navigate Your Career Path with Ease—Discover, Track, Connect.
              </p>

              {/* Feature Icons */}
              <div className="flex flex-wrap gap-6 mt-8 md:gap-8">
                {features.map((feature, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-3"
                    style={{ 
                      animationDelay: `${index * 0.2}s`,
                      animation: 'fadeInUp 0.8s ease-out forwards' 
                    }}
                  >
                    <div className="flex items-center justify-center w-12 h-12 transition-transform rounded-full shadow-lg bg-gradient-to-br from-blue-600 to-blue-800 hover:scale-110">
                      <i className={`${feature.icon} text-white text-xl`}></i>
                    </div>
                    <span className="font-medium text-white">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* Email Input & Button */}
              <div className="flex flex-col items-start gap-4 mt-10 mb-8 sm:flex-row">
                <div className="relative w-full max-w-sm sm:max-w-none group sm:w-auto">
                  <input
                    type="email"
                    className="w-full px-5 py-3 text-black transition duration-300 shadow-xl bg-white/90 sm:w-72 md:w-80 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-400 group-hover:shadow-blue-500/30"
                    placeholder="Enter your email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="absolute inset-0 transition-opacity opacity-0 rounded-xl bg-gradient-to-r from-blue-400 to-purple-500 -z-10 blur-lg group-hover:opacity-70"></div>
                </div>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 px-8 py-3 font-semibold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-blue-500 to-blue-700 hover:shadow-blue-500/50 rounded-xl hover:scale-105"
                  onClick={handleCreateAccount}
                >
                  <span>Create Account</span>
                  <i className="transition-transform fa-solid fa-arrow-right group-hover:translate-x-1"></i>
                </button>
              </div>

              {/* Social Proof */}
              <div className="mt-10">
                <p className="mb-3 text-sm text-white/80">Trusted by thousands of students from top universities</p>
                <div className="flex flex-wrap items-center gap-4 md:gap-6">
                  <div className="px-4 py-2 rounded-xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm">
                    <span className="font-bold text-white">5000+</span>
                    <span className="ml-2 text-white/70">Placements</span>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm">
                    <span className="font-bold text-white">200+</span>
                    <span className="ml-2 text-white/70">Companies</span>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm">
                    <span className="font-bold text-white">98%</span>
                    <span className="ml-2 text-white/70">Success Rate</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* RIGHT SIDE - iPhone Device Mockup with functional login */}
          <div className={`w-full md:w-1/2 flex justify-center items-center mt-24 md:mt-10 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="relative">
              {/* iPhone Frame */}
              <div className="w-[240px] h-[480px] bg-black rounded-[40px] border-[6px] border-gray-800 shadow-2xl relative overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-500">
                {/* iPhone Notch/Dynamic Island */}
                <div className="absolute top-0 z-30 left-1/2 transform -translate-x-1/2 w-[80px] h-[25px] bg-black rounded-b-xl"></div>
                
                {/* iPhone Camera & Sensors */}
                <div className="absolute top-[8px] z-30 right-[94px] w-[6px] h-[6px] bg-gray-700 rounded-full"></div>
                <div className="absolute top-[8px] z-30 right-[82px] w-[8px] h-[8px] bg-gray-600 rounded-full ring-1 ring-gray-500/30"></div>
                
                {/* iPhone Screen - iOS Interface */}
                <div className="w-full h-full overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
                  {/* iOS Status Bar */}
                  <div className={`w-full px-6 pt-7 pb-1 flex justify-between items-center transition-all duration-500 ${mockupActive ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '300ms' }}>
                    <div className="text-[10px] font-medium text-white">{currentTime}</div>
                    <div className="flex items-center space-x-1">
                      <i className="text-[10px] text-white fas fa-signal"></i>
                      <i className="text-[10px] text-white fas fa-wifi"></i>
                      <i className="text-[10px] text-white fas fa-battery-full"></i>
                    </div>
                  </div>
                  
                  {/* App Content */}
                  <div className="p-4">
                    {/* App Logo Animation */}
                    <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 transition-all duration-700 shadow-lg shadow-blue-500/30 ${mockupActive ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} style={{ transitionDelay: '600ms' }}>
                      <i className="text-2xl text-white fas fa-briefcase"></i>
                    </div>
                    
                    {/* App Welcome Text */}
                    <h2 className={`text-white text-lg font-medium text-center mb-1 transition-all duration-500 ${mockupActive ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '700ms' }}>
                      Welcome Back!
                    </h2>
                    <p className={`text-gray-300 text-xs text-center mb-6 transition-all duration-500 ${mockupActive ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '800ms' }}>
                      Access your career dashboard
                    </p>
                    
                    {/* Login Error Message */}
                    {loginError && (
                      <div className="mb-3 text-[10px] text-red-300 text-center bg-red-500/20 py-1 px-2 rounded-xl">
                        {loginError}
                      </div>
                    )}
                    
                    {/* Login Form - iOS Style */}
                    <div className={`space-y-3 transition-all duration-500 ${mockupActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '900ms' }}>
                      <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md">
                        <input 
                          type="email" 
                          className="w-full text-xs text-white bg-transparent border-none outline-none placeholder:text-gray-300" 
                          placeholder="Email" 
                          value={mobileEmail}
                          onChange={(e) => setMobileEmail(e.target.value)}
                        />
                      </div>
                      
                      <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md">
                        <input 
                          type="password" 
                          className="w-full text-xs text-white bg-transparent border-none outline-none placeholder:text-gray-300" 
                          placeholder="Password" 
                          value={mobilePassword}
                          onChange={(e) => setMobilePassword(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    {/* Login Button - iOS Style */}
                    <div className={`mt-4 transition-all duration-500 ${mockupActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '1000ms' }}>
                      <button 
                        className="w-full py-2 text-xs font-medium text-white transition-all duration-300 bg-blue-500 rounded-xl hover:bg-blue-600"
                        onClick={handleMobileLogin}
                      >
                        Login
                      </button>
                      
                      <button 
                        className="w-full py-2 mt-2 text-xs text-blue-400 transition-all duration-300 border rounded-xl border-blue-400/30 hover:bg-white/5"
                        onClick={handleMobileCreateAccount}
                      >
                        Create Account
                      </button>
                      
                      <div className="mt-3 text-center">
                        <a href="#" className="text-[10px] text-blue-400 transition-colors hover:text-blue-300">Forgot Password?</a>
                      </div>
                    </div>
                    
                    {/* App Stats Preview - iOS Style */}
                    <div className={`mt-4 transition-all duration-500 ${mockupActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '1100ms' }}>
                      <div className="flex items-center justify-between">
                        <div className="bg-white/10 rounded-xl p-2 w-[48%] backdrop-blur-md border border-white/5">
                          <div className="text-[10px] text-gray-300">Companies</div>
                          <div className="text-xs font-bold text-white">200+</div>
                        </div>
                        <div className="bg-white/10 rounded-xl p-2 w-[48%] backdrop-blur-md border border-white/5">
                          <div className="text-[10px] text-gray-300">Jobs</div>
                          <div className="text-xs font-bold text-white">1,500+</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Home Indicator */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-[90px] h-[4px] bg-white/70 rounded-full"></div>
                
                {/* iPhone Side Buttons */}
                <div className="absolute top-28 right-[-6px] w-[2px] h-12 bg-gray-700 rounded-l-sm"></div>
                <div className="absolute top-28 left-[-6px] w-[2px] h-8 bg-gray-700 rounded-r-sm"></div>
                <div className="absolute top-40 left-[-6px] w-[2px] h-8 bg-gray-700 rounded-r-sm"></div>
                <div className="absolute top-52 left-[-6px] w-[2px] h-12 bg-gray-700 rounded-r-sm"></div>
              </div>
              
              {/* Enhanced Decorative Elements */}
              <div className="absolute w-16 h-16 rounded-full -top-8 -right-8 bg-blue-500/20 animate-float-slow"></div>
              <div className="absolute w-12 h-12 rounded-full -bottom-6 -left-6 bg-purple-500/20 animate-float-medium"></div>
              
              {/* iPhone Shadow */}
              <div className="absolute w-40 h-4 rounded-full bottom-[-16px] left-[50%] transform -translate-x-1/2 bg-black/50 blur-lg"></div>
              
              {/* Notification Bubbles - iOS Style */}
              <div className="absolute flex items-center justify-center w-8 h-8 text-xs text-white bg-blue-500 rounded-full shadow-lg -right-4 top-1/4 animate-bounce-slow shadow-blue-500/30">
                <i className="fas fa-bell"></i>
              </div>
              <div className="absolute flex items-center justify-center w-6 h-6 text-xs text-white bg-green-500 rounded-full shadow-lg -left-3 top-1/3 animate-bounce-delayed shadow-green-500/30">
                <i className="fas fa-check"></i>
              </div>
              
              {/* iOS Screen Reflection */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full opacity-50 bg-gradient-to-br from-white/5 to-transparent"></div>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* Copyright Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 py-2 text-xs text-center text-white border-t border-gray-200 bg-gray-900/90 backdrop-blur-md">
        © 2025 <span className="font-bold text-blue-400">CareerConnect</span> by
        <span class="mx-1 font-medium text-orange-400">Debashis & Team</span> of
        <span className="font-bold text-blue-400"> KIIT University</span>
      </div>
    </>
  );
}

export default LandingHeroPage;
