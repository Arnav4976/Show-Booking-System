import React, { useRef, useState, useEffect } from 'react';

const StarRatingInput = ({ value, onChange }) => {
  const [hoverValue, setHoverValue] = useState(null);
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const calculatedValue = (percentage * 5).toFixed(1);
    setHoverValue(parseFloat(calculatedValue));
  };

  const handleMouseLeave = () => {
    setHoverValue(null);
  };

  const handleClick = () => {
    if (hoverValue !== null) {
      onChange(hoverValue);
    }
  };

  const displayValue = hoverValue !== null ? hoverValue : value;
  const percentage = (displayValue / 5) * 100;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        style={{ 
          position: 'relative', 
          display: 'inline-block', 
          cursor: 'pointer',
          width: '125px', // 5 stars * 25px
          height: '25px'
        }}
      >
        {/* Background empty stars */}
        <div style={{ position: 'absolute', top: 0, left: 0, display: 'flex' }}>
          {[1,2,3,4,5].map(i => (
            <svg key={i} width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          ))}
        </div>
        
        {/* Foreground filled stars */}
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          display: 'flex', 
          width: `${percentage}%`, 
          overflow: 'hidden',
          pointerEvents: 'none'
        }}>
          {[1,2,3,4,5].map(i => (
            <svg key={i} style={{flexShrink: 0}} width="25" height="25" viewBox="0 0 24 24" fill="var(--ink)" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          ))}
        </div>
      </div>
      <span className="mono" style={{ fontWeight: 700, width: '40px' }}>{displayValue.toFixed(1)}</span>
    </div>
  );
};

export default StarRatingInput;
