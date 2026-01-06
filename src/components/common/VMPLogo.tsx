import React from 'react';

interface VMPLogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const VMPLogo: React.FC<VMPLogoProps> = ({ size = 'medium', className = '' }) => {
  const sizes = {
    small: 60,
    medium: 100,
    large: 150,
  };

  const dimension = sizes[size];
  const pinkColor = '#E91E8C'; // Magenta/Pink color from logo

  return (
    <div className={`vmp-logo ${className}`} style={{ width: dimension, height: dimension }}>
      <svg
        width={dimension}
        height={dimension}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer circular border */}
        <circle
          cx="100"
          cy="100"
          r="95"
          stroke={pinkColor}
          strokeWidth="4"
          fill="white"
        />

        {/* Inner circular border */}
        <circle
          cx="100"
          cy="100"
          r="85"
          stroke={pinkColor}
          strokeWidth="3"
          fill="white"
        />

        {/* House roof */}
        <path
          d="M 70 70 L 100 50 L 130 70"
          stroke={pinkColor}
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Bed icon */}
        <g transform="translate(60, 70)">
          {/* Bed frame/headboard left */}
          <rect x="5" y="0" width="6" height="25" fill={pinkColor} rx="2" />

          {/* Bed frame/headboard right */}
          <rect x="69" y="0" width="6" height="25" fill={pinkColor} rx="2" />

          {/* Mattress */}
          <rect x="10" y="15" width="60" height="15" fill={pinkColor} rx="3" />

          {/* Pillow */}
          <ellipse cx="25" cy="20" rx="10" ry="6" fill={pinkColor} opacity="0.7" />

          {/* Person head */}
          <circle cx="25" cy="12" r="5" fill={pinkColor} />
        </g>

        {/* VMP Text */}
        <text
          x="100"
          y="125"
          fontSize="36"
          fontWeight="bold"
          fill={pinkColor}
          textAnchor="middle"
          fontFamily="Arial, sans-serif"
          letterSpacing="2"
        >
          VMP
        </text>

        {/* VILLA Text */}
        <text
          x="100"
          y="150"
          fontSize="28"
          fontWeight="600"
          fill={pinkColor}
          textAnchor="middle"
          fontFamily="Arial, sans-serif"
          letterSpacing="4"
        >
          VILLA
        </text>

        {/* Divider line */}
        <line
          x1="75"
          y1="157"
          x2="125"
          y2="157"
          stroke={pinkColor}
          strokeWidth="1.5"
        />

        {/* Tagline */}
        <text
          x="100"
          y="172"
          fontSize="9"
          fill={pinkColor}
          textAnchor="middle"
          fontFamily="Arial, sans-serif"
          letterSpacing="1"
        >
          you feel comfortable
        </text>
      </svg>
    </div>
  );
};

// Alternative: If you want to use an actual image logo
export const VMPLogoImage: React.FC<VMPLogoProps> = ({ size = 'medium', className = '' }) => {
  const sizes = {
    small: 60,
    medium: 100,
    large: 150,
  };

  return (
    <img
      src="/images/logo.png"
      alt="VMP Villa Home Stay"
      width={sizes[size]}
      height={sizes[size]}
      className={`vmp-logo ${className}`}
    />
  );
};
