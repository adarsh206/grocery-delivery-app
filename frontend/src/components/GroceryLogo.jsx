import React from 'react';

const GroceryLogo = () => {
  return (
    <svg
      width="50"
      height="40"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className='hover:scale-105'
    >
      {/* Basket Body */}
      <rect
        x="20"
        y="40"
        width="60"
        height="40"
        rx="10"
        fill="#28A745"
      />
      {/* Basket Handle */}
      <path
        d="M30 40 C30 20 70 20 70 40"
        stroke="#F28C38"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
      {/* Leaf Accent */}
      <path
        d="M60 30 C62 20 70 15 75 20 C80 25 78 35 70 40 L65 35"
        fill="#28A745"
        stroke="#F28C38"
        strokeWidth="2"
      />
      {/* Grocery Items (Simple Circles) */}
      <circle cx="35" cy="60" r="8" fill="#F28C38" />
      <circle cx="50" cy="65" r="6" fill="#FFFFFF" />
      <circle cx="65" cy="60" r="8" fill="#F28C38" />
    </svg>
  );
};

export default GroceryLogo;