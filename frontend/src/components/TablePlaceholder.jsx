import React from 'react';

function TablePlaceholder({ columns = 6, rows = 5 }) {
  // Generate random widths for more natural-looking placeholders
  const getRandomWidth = () => {
    const widths = ['60%', '70%', '80%', '90%', '100%'];
    return widths[Math.floor(Math.random() * widths.length)];
  };
  
  return (
    <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Table Header with Shimmer Effect */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="grid grid-cols-6 gap-4 px-6 py-4">
          {[...Array(columns)].map((_, idx) => (
            <div 
              key={`header-${idx}`} 
              className={`h-6 rounded-md bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer ${idx === 0 ? 'col-span-1' : ''}`}
              style={{ 
                backgroundSize: '200% 100%',
                animationDuration: '1.5s',
                animationDelay: `${idx * 0.1}s` 
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-200">
        {[...Array(rows)].map((_, rowIdx) => (
          <div 
            key={`row-${rowIdx}`} 
            className="grid grid-cols-6 gap-4 px-6 py-4 transition-colors hover:bg-gray-50"
          >
            {/* First column with circle for avatar or checkbox */}
            <div className="flex items-center">
              <div 
                className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer"
                style={{ 
                  backgroundSize: '200% 100%',
                  animationDuration: '1.5s',
                  animationDelay: `${rowIdx * 0.05}s` 
                }}
              ></div>
            </div>
            
            {/* Other columns with varied widths */}
            {[...Array(columns - 1)].map((_, colIdx) => (
              <div 
                key={`cell-${rowIdx}-${colIdx}`}
                className="flex items-center"
              >
                <div 
                  className="h-4 rounded-md bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer"
                  style={{ 
                    width: getRandomWidth(),
                    backgroundSize: '200% 100%',
                    animationDuration: '1.5s',
                    animationDelay: `${(rowIdx * 0.1) + (colIdx * 0.05)}s` 
                  }}
                ></div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Add animation keyframes */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite linear;
        }
      `}</style>
    </div>
  );
}

export default TablePlaceholder;
