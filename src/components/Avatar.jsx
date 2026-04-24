import React, { useEffect, useState } from 'react';

function Avatar({ user, className }) {
  const [showFallback, setShowFallback] = useState(!user.avatar);

  useEffect(() => {
    setShowFallback(!user.avatar);
  }, [user.id, user.avatar]);

  return (
    <div className={className} style={{ background: user.color }}>
      {!showFallback && user.avatar ? (
        <img
          className="avatar-photo"
          src={user.avatar}
          alt={user.name}
          onError={() => setShowFallback(true)}
        />
      ) : (
        user.initials
      )}
    </div>
  );
}

export default Avatar;
