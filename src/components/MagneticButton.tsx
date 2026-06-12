import React, { useRef, useState, useCallback } from 'react';

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  intensity?: number;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  onClick,
  href,
  className = '',
  intensity = 0.4,
}) => {
  const buttonRef = useRef<HTMLAnchorElement | HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const button = buttonRef.current;
      if (!button) return;

      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const x = (e.clientX - centerX) * intensity;
      const y = (e.clientY - centerY) * intensity;

      setPosition({ x, y });
    },
    [intensity]
  );

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 });
    setIsHovered(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const sharedProps = {
    ref: buttonRef as React.Ref<HTMLButtonElement & HTMLAnchorElement>,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    onMouseEnter: handleMouseEnter,
    className: `magnetic-btn inline-flex items-center justify-center ${className}`,
    style: {
      transform: isHovered
        ? `translate(${position.x}px, ${position.y}px) perspective(600px) translateZ(8px)`
        : 'translate(0, 0)',
    },
  };

  if (href) {
    return (
      <a href={href} {...sharedProps} onClick={onClick}>
        <span className="magnetic-btn-shadow" />
        {children}
      </a>
    );
  }

  return (
    <button {...sharedProps} onClick={onClick}>
      <span className="magnetic-btn-shadow" />
      {children}
    </button>
  );
};
