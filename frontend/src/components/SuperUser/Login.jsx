import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../../assets/CPMS.png';
import isAuthenticated from '../../utility/auth.utility';
import Toast from '../../components/Toast';
import { BASE_URL } from '../../config/backend_url';

function LoginSuperUser() {
  document.title = 'CareerConnect | Admin Login';
  const navigate = useNavigate();

  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState({});

  // if login user visit redirect to home page
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("../admin/dashboard");
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
    if (e.target.name === 'email') return setError({ ...error, email: '' })
    if (e.target.name === 'password') return setError({ ...error, password: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData?.email && !formData?.password) return setError({ email: "Email Required!", password: "Password Required!" });
    if (!formData?.email) return setError({ email: "Email Required!" });
    if (!formData?.password) return setError({ password: "Password Required!" });

    setLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/admin/login`, formData);
      localStorage.setItem('token', response.data.token);
      navigate('../admin/dashboard');
    } catch (error) {
      if (error.response?.data?.msg) {
        setToastMessage(error.response.data.msg);
        setShowToast(true);
      }
      console.log("Error in admin login.jsx => ", error);
      setLoading(false);
    }
  }

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

      {/* Fixed height/width container with no scrolling */}
      <div className="fixed inset-0 w-screen h-screen overflow-hidden">
        <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-violet-800 to-indigo-900">
          {/* Background decorative elements - contained positioning */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Smaller and better positioned decorative elements */}
            <div className="absolute rounded-full -top-40 -right-40 w-60 h-60 bg-violet-600 opacity-20"></div>
            <div className="absolute w-40 h-40 bg-indigo-500 rounded-full top-20 -left-20 opacity-10"></div>
            <div className="absolute bg-pink-400 rounded-full w-28 h-28 bottom-10 right-10 opacity-10"></div>
            <div className="absolute bg-indigo-600 rounded-full -bottom-20 -left-20 w-60 h-60 opacity-10"></div>
            
            {/* Subtle grid pattern - reduced opacity */}
            <div className="absolute inset-0 opacity-3">
              <div className="absolute inset-0 bg-repeat" 
                style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/svg%3E')", 
                backgroundSize: "40px 40px" }}></div>
            </div>
          </div>

          {/* Login card - smaller and more compact */}
          <div className="z-10 w-full max-w-xs mx-auto">
            <div className="overflow-hidden border rounded-lg shadow-xl border-white/20 bg-white/10 backdrop-blur-xl">
              <div className="relative">
                {/* Header with wave design - smaller */}
                <div className="px-4 pt-4 pb-10 bg-gradient-to-r from-violet-600 to-indigo-600">
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
              
              {/* Compact form section */}
              <div className="px-4 py-4 bg-white/15">
                <h1 className="mb-2 text-lg font-bold text-center text-white">
                  Administrator Login
                  <div className="flex justify-center mt-1">
                    <span className="px-2 py-0.5 text-[10px] font-normal rounded-full text-white/60 bg-white/10">
                      <i className="mr-1 fas fa-shield-alt text-[10px]"></i>
                      Restricted Access
                    </span>
                  </div>
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
                        } rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-violet-400`}
                        placeholder="Admin Email"
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
                        } rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-violet-400`}
                        placeholder="Admin Password"
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

                  {/* Security notice - more compact */}
                  <div className="p-2 border rounded-md bg-white/5 border-white/10">
                    <div className="flex items-start">
                      <i className="text-[10px] fas fa-exclamation-triangle text-amber-400 mt-0.5 mr-1.5"></i>
                      <p className="text-[10px] text-white/70">
                        This access point is reserved for system administrators only. 
                        Unauthorized access attempts will be logged.
                      </p>
                    </div>
                  </div>

                  {/* Submit Button - smaller */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-2 mt-1 text-sm bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-medium rounded-md shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-1 focus:ring-violet-500 ${
                      isLoading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <svg className="w-3 h-3 mr-2 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Authenticating...
                      </div>
                    ) : (
                      <>
                        <i className="mr-1.5 text-xs fas fa-key"></i>
                        Access System
                      </>
                    )}
                  </button>
                </form>

                {/* Return to main site - more compact */}
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
  )
}

export default LoginSuperUser;
