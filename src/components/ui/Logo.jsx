import React from 'react';

export default function Logo({ className = 'w-8 h-8', ...props }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      {...props}
    >
      <rect width="40" height="40" rx="10" fill="#18181B" />
      <path
        d="M12 14C12 12.8954 12.8954 12 14 12H23C25.7614 12 28 14.2386 28 17C28 19.7614 25.7614 22 23 22H14V14Z"
        stroke="#E06D53"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 22L27 30"
        stroke="#F4F4F5"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="14" cy="22" r="1.5" fill="#E06D53" />
      <path
        d="M28 12L31 9"
        stroke="#E06D53"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
