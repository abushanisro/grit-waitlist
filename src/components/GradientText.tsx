import React, { ReactNode } from 'react';
import './GradientText.css';

interface GradientTextProps {
  children: ReactNode;
  colors: string[];
  animationSpeed?: number;
  showBorder?: boolean;
  className?: string;
}

const GradientText: React.FC<GradientTextProps> = ({
  children,
  colors,
  animationSpeed = 3,
  showBorder = false,
  className = ''
}) => {
  const gradientColors = colors.join(', ');

  return (
    <span
      className={`gradient-text ${showBorder ? 'gradient-text--border' : ''} ${className}`}
      style={{
        backgroundImage: `linear-gradient(90deg, ${gradientColors})`,
        backgroundSize: '200% auto',
        animation: `gradient-animation ${animationSpeed}s ease infinite`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}
    >
      {children}
    </span>
  );
};

export default GradientText;
