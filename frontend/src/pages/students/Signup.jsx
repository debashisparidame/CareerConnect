import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from "../../assets/CPMS.png";
import Toast from '../../components/Toast';
import isAuthenticated from '../../utility/auth.utility';
import { BASE_URL } from '../../config/backend_url';

function Signup() {
  document.title = 'CareerConnect | Student Sign Up';
  const navigate = useNavigate();
  const location = useLocation();

  const prefillEmail = location?.state?.prefillEmail || '';

  // if login user visit redirect to home page
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("../student/dashboard");
    }
  }, [navigate]);

  // useState for toast display
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // useState for from data 
  const [formData, setFormData] = useState({
    first_name: '',
    email: prefillEmail,
    number: '',
    password: '',
  });

  const { first_name, number, email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'first_name') setError({ ...error, first_name: '' })
    if (e.target.name === 'email') setError({ ...error, email: '' })
    if (e.target.name === 'number') setError({ ...error, number: '' })
    if (e.target.name === 'password') {
      setError({ ...error, password: '' })
      if (!validatePassword(e.target.value)) setError({ ...error, password: 'Password Must Contains: Minimum 8 Char with atleast 1 Special Char, 1 Number, 1 Uppercase, 1 Lowercase' })
    }
  }

  function validatePassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData?.email && !formData?.first_name && !formData?.number && !formData?.password)
      return setError({ email: 'Email Required!', first_name: 'Name Required!', number: 'Number Required!', password: 'Password Required!' })
    if (!formData?.email || !formData?.first_name || !formData?.number || !formData?.password) {
      let email, first_name, number, password;
      if (!formData?.email) email = 'Email Required!';
      if (!formData?.first_name) first_name = 'Name Required!';
      if (!formData?.number) number = 'Number Required!';
      if (!formData?.password) password = 'Password Required!';
      setError({ email: email, first_name: first_name, number: number, password: password })
      return;
    }

    if (!validatePassword(formData?.password)) return setError({ password: 'Password Must Contains: Minimum 8 Char with atleast 1 Special Char, 1 Number, 1 Uppercase, 1 Lowercase' })

    if (formData?.number?.length !== 10) return setError({ ...error, number: 'Number Length Should be 10 digital only!' })

    setIsLoading(true);
    
    try {
      const response = await axios.post(`${BASE_URL}/student/signup`, formData);
      setToastMessage("User Created Successfully! Now You Can Login.");
      setShowToast(true);

      const dataToPass = {
        showToastPass: true,
        toastMessagePass: "User Created Successfully! Now You Can Login."
      }
      navigate('../student/login', { state: dataToPass });
    } catch (error) {
      if (error.response?.data?.msg) {
        setToastMessage(error.response.data.msg);
        setShowToast(true);
      }
      console.log("Student Signup.jsx => ", error);
      setIsLoading(false);
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

          {/* Signup card - square shaped */}
          <div className="z-10 w-full max-w-[320px] mx-auto">
            <div className="overflow-hidden border rounded-md shadow-xl border-white/20 bg-white/10 backdrop-blur-xl">
              <div className="relative">
                {/* Header with adjusted padding for square proportion */}
                <div className="px-4 pt-4 pb-8 bg-gradient-to-r from-cyan-500 to-blue-600">
                  <div className="flex justify-center">
                    <div className="p-2 rounded-md shadow-lg bg-white/20 backdrop-blur-sm">
                      <img 
                        className="object-contain w-auto h-12" 
                        src={Logo} 
                        alt="CareerConnect Logo"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Wave separator */}
                <div className="absolute left-0 right-0 overflow-hidden -bottom-1">
                  <div className="overflow-hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full" preserveAspectRatio="none">
                      <path fill="#ffffff" fillOpacity="0.15" d="M0,128L48,144C96,160,192,192,288,186.7C384,181,480,139,576,117.3C672,96,768,96,864,112C960,128,1056,160,1152,165.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Form section with adjusted height to make the card more square */}
              <div className="px-5 py-4 bg-white/15">
                <h1 className="mb-3 text-base font-bold text-center text-white">
                  Student Registration
                </h1>
                
                <form onSubmit={handleSubmit} className="space-y-2.5">
                  {/* Name Field */}
                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <i className="text-xs fas fa-user text-white/60"></i>
                      </div>
                      <input
                        type="text"
                        id="inputName"
                        name="first_name"
                        value={first_name}
                        onChange={handleChange}
                        className={`w-full pl-9 pr-3 py-2 text-xs bg-white/10 border ${
                          error?.first_name ? 'border-red-400' : 'border-white/20'
                        } rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-cyan-400`}
                        placeholder="Full Name"
                        autoComplete="name"
                        autoFocus
                      />
                    </div>
                    {error?.first_name && (
                      <p className="pl-1 mt-0.5 text-[10px] text-red-300">
                        {error.first_name}
                      </p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <i className="text-xs fas fa-envelope text-white/60"></i>
                      </div>
                      <input
                        type="email"
                        id="inputEmail"
                        name="email"
                        value={email}
                        onChange={handleChange}
                        className={`w-full pl-9 pr-3 py-2 text-xs bg-white/10 border ${
                          error?.email ? 'border-red-400' : 'border-white/20'
                        } rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-cyan-400`}
                        placeholder="Email Address"
                        autoComplete="email"
                      />
                    </div>
                    {error?.email && (
                      <p className="pl-1 mt-0.5 text-[10px] text-red-300">
                        {error.email}
                      </p>
                    )}
                  </div>

                  {/* Phone Number Field */}
                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <i className="text-xs fas fa-phone text-white/60"></i>
                      </div>
                      <input
                        type="text"
                        id="inputNumber"
                        name="number"
                        value={number}
                        onChange={handleChange}
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                        }}
                        className={`w-full pl-9 pr-3 py-2 text-xs bg-white/10 border ${
                          error?.number ? 'border-red-400' : 'border-white/20'
                        } rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-cyan-400`}
                        placeholder="Phone Number (10 digits)"
                        autoComplete="tel"
                      />
                    </div>
                    {error?.number && (
                      <p className="pl-1 mt-0.5 text-[10px] text-red-300">
                        {error.number}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <i className="text-xs fas fa-lock text-white/60"></i>
                      </div>
                      <input
                        type={isEyeOpen ? "text" : "password"}
                        id="inputPassword"
                        name="password"
                        value={password}
                        onChange={handleChange}
                        className={`w-full pl-9 pr-8 py-2 text-xs bg-white/10 border ${
                          error?.password ? 'border-red-400' : 'border-white/20'
                        } rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-cyan-400`}
                        placeholder="Password"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={handleEye}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 transition-colors text-white/60 hover:text-white"
                      >
                        <i className={`${isEyeOpen ? "fa-solid fa-eye" : "fa-regular fa-eye-slash"} text-xs`}></i>
                      </button>
                    </div>
                    {error?.password && (
                      <p className="pl-1 mt-0.5 text-[10px] text-red-300">
                        {error.password}
                      </p>
                    )}
                  </div>

                  {/* Password requirements - more compact for better square ratio */}
                  <div className="p-2 text-[10px] rounded-md bg-white/5 text-white/70">
                    <p className="text-[10px] font-medium text-white/80">Password must include:</p>
                    <div className="grid grid-cols-2 gap-x-1 gap-y-0.5 mt-1 pl-2">
                      <div className={`flex items-center ${password.length >= 8 ? 'text-green-300' : ''}`}>
                        <span className="mr-0.5">•</span>8+ characters
                      </div>
                      <div className={`flex items-center ${/[A-Z]/.test(password) ? 'text-green-300' : ''}`}>
                        <span className="mr-0.5">•</span>Uppercase
                      </div>
                      <div className={`flex items-center ${/[a-z]/.test(password) ? 'text-green-300' : ''}`}>
                        <span className="mr-0.5">•</span>Lowercase
                      </div>
                      <div className={`flex items-center ${/\d/.test(password) ? 'text-green-300' : ''}`}>
                        <span className="mr-0.5">•</span>Number
                      </div>
                      <div className={`flex items-center col-span-2 ${/[@$!%*?&]/.test(password) ? 'text-green-300' : ''}`}>
                        <span className="mr-0.5">•</span>Special (@$!%*?&)
                      </div>
                    </div>
                  </div>

                  {/* Submit Button - adjusted for better square proportions */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-2.5 mt-2 text-xs bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-md shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-1 focus:ring-cyan-500 ${
                      isLoading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <svg className="w-3 h-3 mr-1.5 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating account...
                      </div>
                    ) : (
                      <>
                        <i className="mr-1.5 text-xs fas fa-user-plus"></i>
                        Sign Up
                      </>
                    )}
                  </button>
                </form>

                {/* Login option - with adjusted spacing for square proportions */}
                <div className="mt-3 text-center">
                  <p className="text-[11px] text-white/80">
                    Already have an account?{' '}
                    <button 
                      onClick={() => navigate('../student/login')}
                      className="font-semibold transition-colors text-cyan-300 hover:text-white"
                    >
                      Log In
                    </button>
                  </p>
                </div>

                {/* Footer - with adjusted spacing for square proportions */}
                <div className="pt-3 mt-3 text-center border-t border-white/10">
                  <button 
                    onClick={() => navigate('/')}
                    className="flex items-center justify-center mx-auto text-[11px] transition-colors text-white/60 hover:text-white"
                  >
                    <i className="mr-0.5 fas fa-home text-[11px]"></i>
                    <span className="text-[11px] hover:underline">© CareerConnect {new Date().getFullYear()}</span>
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

export default Signup;
