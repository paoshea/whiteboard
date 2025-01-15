import React, { useState } from 'react';

const Tabs = ({ children }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div>
      <div className="flex border-b">
        {React.Children.map(children, (child, index) => (
          <button 
            className={`py-2 px-4 ${activeIndex === index ? 'border-b-2 border-blue-500' : ''}`} 
            onClick={() => setActiveIndex(index)}
          >
            {child.props.label}
          </button>
        ))}
      </div>
      <div className="py-4">
        {React.Children.toArray(children)[activeIndex]}
      </div>
    </div>
  );
};

const Tab = ({ children }) => (
  <div>{children}</div>
);

Tabs.Tab = Tab; // Allow using <Tabs.Tab> inside Tabs

export default Tabs;