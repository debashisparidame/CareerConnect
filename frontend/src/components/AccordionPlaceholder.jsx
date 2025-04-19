import React from 'react';
import { Accordion, Placeholder } from 'react-bootstrap';

const AccordionPlaceholder = () => {
  // Custom loader component for a more attractive placeholder
  const CustomPlaceholder = ({ lines = 1, height = "12px", width = "100%" }) => (
    <div className="flex flex-col gap-2 animate-pulse">
      {[...Array(lines)].map((_, idx) => (
        <div 
          key={idx} 
          className="rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"
          style={{ 
            height, 
            width: typeof width === 'function' ? width(idx) : width 
          }}
        ></div>
      ))}
    </div>
  );

  // Year colors for visual distinction
  const yearColors = {
    fourth: {
      border: 'border-red-200',
      header: 'from-red-500 to-red-600',
      icon: 'text-red-500',
      shadow: 'shadow-red-200',
      accent: 'bg-red-100'
    },
    third: {
      border: 'border-amber-200',
      header: 'from-amber-500 to-amber-600',
      icon: 'text-amber-500',
      shadow: 'shadow-amber-200',
      accent: 'bg-amber-100'
    },
    second: {
      border: 'border-emerald-200',
      header: 'from-emerald-500 to-emerald-600',
      icon: 'text-emerald-500',
      shadow: 'shadow-emerald-200',
      accent: 'bg-emerald-100'
    },
    first: {
      border: 'border-blue-200',
      header: 'from-blue-500 to-blue-600',
      icon: 'text-blue-500',
      shadow: 'shadow-blue-200',
      accent: 'bg-blue-100'
    }
  };

  // Department options for visual variety
  const departments = ['Computer Science', 'Mechanical', 'Electrical', 'Civil', 'Information Technology'];

  return (
    <div className="space-y-4 accordion-container">
      {/* Fourth Year */}
      <div className={`overflow-hidden transition-all border rounded-xl ${yearColors.fourth.border} ${yearColors.fourth.shadow} backdrop-blur-lg bg-white/70`}>
        <Accordion defaultActiveKey={['1']} className="shadow-none">
          <Accordion.Item eventKey="1" className="border-0">
            <Accordion.Header className="accordion-header-custom">
              <div className="flex items-center w-full">
                <div className={`flex items-center justify-center w-10 h-10 mr-3 text-white rounded-lg bg-gradient-to-r ${yearColors.fourth.header}`}>
                  <i className="fas fa-user-graduate"></i>
                </div>
                <span className="text-lg font-bold text-gray-800">Fourth Year</span>
                <div className="flex items-center ml-auto">
                  <div className="mr-2 flex items-center px-2 py-0.5 bg-gray-100 rounded text-xs font-medium text-gray-600">
                    <div className="w-2 h-2 mr-1 bg-gray-300 rounded-full animate-pulse"></div>
                    Loading
                  </div>
                </div>
              </div>
            </Accordion.Header>
            
            <Accordion.Body className="p-0">
              <div className="px-4 py-2 border-t border-gray-100">
                <div className="space-y-4">
                  {departments.map((dept, idx) => (
                    <div key={idx} className="p-3 transition-all bg-white rounded-lg shadow-sm">
                      <div className="flex items-center mb-3">
                        <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md ${yearColors.fourth.accent} ${yearColors.fourth.icon}`}>
                          <i className="fas fa-laptop-code"></i>
                        </div>
                        <div className="w-full ml-3">
                          <div className="flex items-center justify-between">
                            <CustomPlaceholder height="18px" width="40%" />
                            <CustomPlaceholder height="16px" width="20%" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3 pl-11">
                        {[...Array(3)].map((_, lineIdx) => (
                          <div key={lineIdx} className="flex items-center justify-between">
                            <CustomPlaceholder 
                              height="14px" 
                              width={(i) => i % 2 === 0 ? '60%' : '70%'} 
                            />
                            <CustomPlaceholder height="14px" width="15%" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>

      {/* Third Year */}
      <div className={`overflow-hidden transition-all border rounded-xl ${yearColors.third.border} ${yearColors.third.shadow} backdrop-blur-lg bg-white/70`}>
        <Accordion className="shadow-none">
          <Accordion.Item eventKey="0" className="border-0">
            <Accordion.Header className="accordion-header-custom">
              <div className="flex items-center w-full">
                <div className={`flex items-center justify-center w-10 h-10 mr-3 text-white rounded-lg bg-gradient-to-r ${yearColors.third.header}`}>
                  <i className="fas fa-user-graduate"></i>
                </div>
                <span className="text-lg font-bold text-gray-800">Third Year</span>
                <div className="flex items-center ml-auto">
                  <div className="mr-2 flex items-center px-2 py-0.5 bg-gray-100 rounded text-xs font-medium text-gray-600">
                    <div className="w-2 h-2 mr-1 bg-gray-300 rounded-full animate-pulse"></div>
                    Loading
                  </div>
                </div>
              </div>
            </Accordion.Header>
          </Accordion.Item>
        </Accordion>
      </div>

      {/* Second Year */}
      <div className={`overflow-hidden transition-all border rounded-xl ${yearColors.second.border} ${yearColors.second.shadow} backdrop-blur-lg bg-white/70`}>
        <Accordion className="shadow-none">
          <Accordion.Item eventKey="0" className="border-0">
            <Accordion.Header className="accordion-header-custom">
              <div className="flex items-center w-full">
                <div className={`flex items-center justify-center w-10 h-10 mr-3 text-white rounded-lg bg-gradient-to-r ${yearColors.second.header}`}>
                  <i className="fas fa-user-graduate"></i>
                </div>
                <span className="text-lg font-bold text-gray-800">Second Year</span>
                <div className="flex items-center ml-auto">
                  <div className="mr-2 flex items-center px-2 py-0.5 bg-gray-100 rounded text-xs font-medium text-gray-600">
                    <div className="w-2 h-2 mr-1 bg-gray-300 rounded-full animate-pulse"></div>
                    Loading
                  </div>
                </div>
              </div>
            </Accordion.Header>
          </Accordion.Item>
        </Accordion>
      </div>

      {/* First Year */}
      <div className={`overflow-hidden transition-all border rounded-xl ${yearColors.first.border} ${yearColors.first.shadow} backdrop-blur-lg bg-white/70`}>
        <Accordion className="shadow-none">
          <Accordion.Item eventKey="0" className="border-0">
            <Accordion.Header className="accordion-header-custom">
              <div className="flex items-center w-full">
                <div className={`flex items-center justify-center w-10 h-10 mr-3 text-white rounded-lg bg-gradient-to-r ${yearColors.first.header}`}>
                  <i className="fas fa-user-graduate"></i>
                </div>
                <span className="text-lg font-bold text-gray-800">First Year</span>
                <div className="flex items-center ml-auto">
                  <div className="mr-2 flex items-center px-2 py-0.5 bg-gray-100 rounded text-xs font-medium text-gray-600">
                    <div className="w-2 h-2 mr-1 bg-gray-300 rounded-full animate-pulse"></div>
                    Loading
                  </div>
                </div>
              </div>
            </Accordion.Header>
          </Accordion.Item>
        </Accordion>
      </div>

      {/* Custom styles for accordion headers */}
      <style jsx>{`
        :global(.accordion-header-custom) {
          padding: 0.75rem 1rem;
        }
        :global(.accordion-header-custom button) {
          padding: 0 !important;
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          width: 100%;
        }
        :global(.accordion-header-custom button::after) {
          margin-left: 0;
          background-size: 1rem;
        }
      `}</style>
    </div>
  );
};

export default AccordionPlaceholder;
