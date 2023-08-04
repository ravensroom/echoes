import React from 'react';

interface IconTipProps {
  content: string;
  children: React.ReactNode;
}

const IconTip: React.FC<IconTipProps> = ({ content, children }) => {
  const [showIconTip, setShowIconTip] = React.useState(false);

  const handleMouseEnter = () => {
    setShowIconTip(true);
  };

  const handleMouseLeave = () => {
    setShowIconTip(false);
  };

  return (
    <div className="">
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {children}
      </div>
      {showIconTip && (
        <div className="absolute z-10 px-2 py-1 text-white bg-gray-600 rounded-sm text-xs sm:text-sm">
          {content}
        </div>
      )}
    </div>
  );
};

export default IconTip;
