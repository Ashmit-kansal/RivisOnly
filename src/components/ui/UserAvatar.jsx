import React, { useState, useEffect } from 'react';
import defaultAvatar from '../../assets/default-avatar.svg';

export default function UserAvatar({
  src,
  name = 'Scholar',
  className = 'w-8 h-8 rounded-full',
  alt,
}) {
  const [imgFailed, setImgFailed] = useState(false);

  // Reset error state when src changes
  useEffect(() => {
    setImgFailed(false);
  }, [src]);

  const initial = name ? name.trim().charAt(0).toUpperCase() : 'S';
  const resolvedSrc = !imgFailed && src ? src : defaultAvatar;

  return (
    <div className={`relative shrink-0 overflow-hidden select-none ${className}`}>
      <img
        src={resolvedSrc}
        alt={alt || name}
        onError={() => setImgFailed(true)}
        className="w-full h-full object-cover rounded-inherit"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}

