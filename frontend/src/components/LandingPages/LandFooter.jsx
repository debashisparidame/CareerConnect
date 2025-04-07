import React from 'react';
import { useNavigate } from 'react-router-dom';

function LandFooter() {
  const navigate = useNavigate();

  const loginLinks = [
    { label: 'Login as TPO', path: '/tpo/login' },
    { label: 'Login as Management', path: '/management/login' },
    { label: 'Login as Super Admin', path: '/admin' },
  ];

  return (
    <footer className="py-10 mt-16 text-gray-800 border-t border-gray-300 bg-gradient-to-br from-white via-slate-100 to-gray-100">
      <div className="px-6 mx-auto max-w-7xl">
        {/* Admin Login Buttons */}
        <div className="flex flex-wrap items-center justify-center mb-8 max-md:gap-3 md:gap-6">
          {loginLinks.map((link, idx) => (
            <button
              key={idx}
              onClick={() => navigate(link.path)}
              className="px-5 py-2 text-sm font-medium text-white transition-all duration-300 bg-green-600 rounded-md shadow-md hover:bg-green-500"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Footer Text */}
        <div className="text-sm text-center text-gray-600">
          <p>© 2025 <span className="font-semibold text-green-600">CareerConnect</span>. All rights reserved.</p>
          <p className="mt-1 text-xs text-gray-500">Developed by <span className="font-semibold text-orange-700">Debashis & Team</span> of KIIT University</p>
        </div>
      </div>
    </footer>
  );
}

export default LandFooter;
