import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Logo from '../../assets/CPMS.png';
import Toast from '../../components/Toast';
import isAuthenticated from '../../utility/auth.utility';
import { BASE_URL } from '../../config/backend_url';

function Login() {
  document.title = 'CareerConnect | Student Login';
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState({});

  // if login user visit redirect to home page
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("../student/dashboard");
    }
  }, [navigate]);

  // useState for toast display
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'email') return setError({ ...error, email: '' });
    if (e.target.name === 'password') return setError({ ...error, password: '' });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData?.email && !formData?.password) return setError({ email: 'Email Required!', password: 'Password Required!' })
    if (!formData?.email) return setError({ email: 'Email Required!' })
    if (!formData?.password) return setError({ password: 'Password Required!' })

    setLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/student/login`, formData);
      localStorage.setItem('token', response.data.token);
      navigate('../student/dashboard');
    } catch (error) {
      if (error?.response?.data?.msg) {
        setToastMessage(error.response.data.msg);
        setShowToast(true);
      }
      console.log("Error in Student login.jsx => ", error);
      setLoading(false);
    }
  }

  // if user came from signup page then this toast appears
  const { showToastPass, toastMessagePass } = location.state || { showToastPass: false, toastMessagePass: '' };
  useEffect(() => {
    if (showToastPass) {
      setToastMessage(toastMessagePass);
      setShowToast(showToastPass);
      // Clear the state after the toast is shown
      navigate('.', { replace: true, state: {} });
    }
  }, []);

  // toggle eye
  const [isEyeOpen, setEyeOpen] = useState(false);

  const handleEye = () => {
    setEyeOpen(!isEyeOpen);
  }

  return (
    <>
      {/* Toast notification */}
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        delay={3000}
        position="bottom-end"
      />

      {/* Full height/width container with no scrolling */}
      <div className="fixed inset-0 w-screen h-screen overflow-hidden">
        <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-cyan-600 to-blue-800">
          {/* Background decorative elements - with contained positioning */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Smaller and better positioned decorative elements */}
            <div className="absolute w-40 h-40 rounded-full -top-20 -right-10 bg-cyan-500 opacity-20"></div>
            <div className="absolute bg-blue-500 rounded-full w-36 h-36 top-20 -left-5 opacity-10"></div>
            <div className="absolute rounded-full w-28 h-28 bottom-10 right-5 bg-sky-400 opacity-15"></div>
            <div className="absolute bg-blue-600 rounded-full -bottom-16 -left-5 w-44 h-44 opacity-10"></div>
            
            {/* Floating elements - smaller */}
            <div className="absolute hidden w-6 h-6 bg-white rounded-full md:block top-1/4 left-1/4 opacity-20 animate-float-slow"></div>
            <div className="absolute hidden w-5 h-5 bg-white rounded-full md:block bottom-1/3 right-1/4 opacity-15 animate-float-medium"></div>
            <div className="absolute hidden w-4 h-4 bg-white rounded-full md:block top-1/2 left-1/5 opacity-10 animate-float-fast"></div>
            
            {/* Wave pattern with strict overflow control */}
            <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden opacity-20">
              <div className="w-full overflow-hidden">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full" preserveAspectRatio="none">
                  <path fill="#ffffff" fillOpacity="1" d="M0,128L48,144C96,160,192,192,288,186.7C384,181,480,139,576,117.3C672,96,768,96,864,112C960,128,1056,160,1152,165.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Login card - SMALLER and more compact */}
          <div className="z-10 w-full max-w-xs mx-auto">
            <div className="overflow-hidden border rounded-lg shadow-xl border-white/20 bg-white/10 backdrop-blur-xl">
              <div className="relative">
                {/* Smaller header with reduced padding */}
                <div className="px-4 pt-4 pb-10 bg-gradient-to-r from-cyan-500 to-blue-600">
                  <div className="flex justify-center">
                    <div className="p-1.5 shadow-lg bg-white/20 backdrop-blur-sm rounded-lg">
                      <img 
                        className="object-contain w-auto h-10"
                        src={Logo} 
                        alt="CareerConnect Logo"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Wave separator with controlled overflow */}
                <div className="absolute left-0 right-0 overflow-hidden -bottom-1">
                  <div className="overflow-hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full" preserveAspectRatio="none">
                      <path fill="#ffffff" fillOpacity="0.15" d="M0,128L48,144C96,160,192,192,288,186.7C384,181,480,139,576,117.3C672,96,768,96,864,112C960,128,1056,160,1152,165.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* More compact form section with reduced padding */}
              <div className="px-4 py-4 bg-white/15">
                <h1 className="mb-3 text-lg font-bold text-center text-white">
                  Student Login
                </h1>
                
                <form onSubmit={handleSubmit} className="space-y-3">
                  {/* Email Field - more compact */}
                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                        <i className="text-sm fas fa-envelope text-white/60"></i>
                      </div>
                      <input
                        type="email"
                        id="inputEmail"
                        name="email"
                        value={email}
                        onChange={handleChange}
                        className={`w-full pl-8 pr-3 py-2 text-sm bg-white/10 border ${
                          error?.email ? 'border-red-400' : 'border-white/20'
                        } rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-cyan-400`}
                        placeholder="Email address"
                        autoComplete="email"
                        autoFocus
                      />
                    </div>
                    {error?.email && (
                      <p className="pl-1 mt-0.5 text-xs text-red-300">
                        {error.email}
                      </p>
                    )}
                  </div>

                  {/* Password Field - more compact */}
                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                        <i className="text-sm fas fa-lock text-white/60"></i>
                      </div>
                      <input
                        type={isEyeOpen ? "text" : "password"}
                        id="inputPassword"
                        name="password"
                        value={password}
                        onChange={handleChange}
                        className={`w-full pl-8 pr-8 py-2 text-sm bg-white/10 border ${
                          error?.password ? 'border-red-400' : 'border-white/20'
                        } rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-cyan-400`}
                        placeholder="Password"
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={handleEye}
                        className="absolute inset-y-0 right-0 flex items-center pr-2 transition-colors text-white/60 hover:text-white"
                      >
                        <i className={`${isEyeOpen ? "fa-solid fa-eye" : "fa-regular fa-eye-slash"} text-sm`}></i>
                      </button>
                    </div>
                    {error?.password && (
                      <p className="pl-1 mt-0.5 text-xs text-red-300">
                        {error.password}
                      </p>
                    )}
                  </div>

                  {/* Submit Button - smaller */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-2 mt-1 text-sm bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-md shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-cyan-500 ${
                      isLoading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <svg className="w-3 h-3 mr-2 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing in...
                      </div>
                    ) : (
                      <>
                        <i className="mr-1.5 fas fa-sign-in-alt text-xs"></i>
                        Sign In
                      </>
                    )}
                  </button>
                </form>

                {/* Sign up option - smaller */}
                <div className="mt-3 text-center">
                  <p className="text-xs text-white/80">
                    Don't have an account?{' '}
                    <button 
                      onClick={() => navigate('../student/signup')}
                      className="font-semibold transition-colors text-cyan-300 hover:text-white"
                    >
                      Create account
                    </button>
                  </p>
                </div>

                {/* Alternative login options - smaller */}
                <div className="pt-2 mt-3 border-t border-white/10">
                  <p className="mb-1.5 text-xs text-center text-white/70">Or log in as</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <button
                      onClick={() => navigate('../tpo/login')}
                      className="flex items-center px-2 py-1 text-xs text-white transition-colors rounded-md bg-white/20 hover:bg-white/30"
                    >
                      <i className="mr-1 text-xs fas fa-user-tie"></i>
                      TPO
                    </button>
                    <button
                      onClick={() => navigate('../management/login')}
                      className="flex items-center px-2 py-1 text-xs text-white transition-colors rounded-md bg-white/20 hover:bg-white/30"
                    >
                      <i className="mr-1 text-xs fas fa-building"></i>
                      Management
                    </button>
                  </div>
                </div>

                {/* Footer - smaller */}
                <div className="pt-2 mt-3 text-center border-t border-white/10">
                  <button 
                    onClick={() => navigate('/')}
                    className="flex items-center justify-center mx-auto text-xs transition-colors text-white/60 hover:text-white"
                  >
                    <i className="mr-0.5 fas fa-home text-xs"></i>
                    <span className="text-xs hover:underline">© CareerConnect {new Date().getFullYear()}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
