import React, { useEffect, useState } from 'react';
import Logo from '../../assets/CPMS.png';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

function LandingNavbar() {
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [buttonSize, setButtonSize] = useState('lg');
  const [logoText, setLogoText] = useState('CareerConnect');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 600) {
        setButtonSize('sm');
        setLogoText('CPMS');
      } else if (width <= 768) {
        setButtonSize('md');
        setLogoText('CareerConnect');
      } else {
        setButtonSize('lg');
        setLogoText('CareerConnect');
      }
    };

    handleResize();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <header
      className={`w-full z-50 transition-all duration-300 ease-in-out ${isScrolled ? 'backdrop-blur-md bg-white/60 shadow-md sticky top-0' : ''
        }`}
    >
      <div className="flex flex-wrap items-center justify-between px-4 py-3 mx-auto max-w-7xl">
        {/* Logo Section */}
        <div
          className="flex items-center transition-transform duration-150 cursor-pointer max-md:gap-2 md:gap-4 hover:scale-105"
          onClick={() => navigate('/')}
        >
          <img
            src={Logo}
            alt="CPMS Logo"
            className="w-16 h-16 border-white md:w-12 md:h-17"
          />
          <h1 className={`text-2xl md:text-4xl font-extrabold bg-gradient-to-r from-orange-700 to-orange-700 bg-clip-text text-transparent mt-3`}>
            {logoText}
          </h1>
        </div>

        {/* Button Section */}
        <div className="flex items-center max-md:gap-1 md:gap-3">
          <Button
            variant="outline-primary"
            size={buttonSize}
            className="px-3 transition-all hover:scale-105 hover:shadow-md md:w-32"
            onClick={() => navigate('/student/login')}
          >
            Login
          </Button>

          <Button
            variant="success"
            size={buttonSize}
            className="px-3 transition-all hover:scale-105 hover:shadow-md md:w-32"
            onClick={() => navigate('/student/signup')}
          >
            Sign Up
          </Button>
        </div>
      </div>
    </header>
  );
}

export default LandingNavbar;
