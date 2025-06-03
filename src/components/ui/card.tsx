// src/ui/card.tsx

import React from 'react';

// Define the props for the Card component
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  // You can add more specific props here if needed
}

// Card Component
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={className} // You would typically add your styling classes here
      {...props}
    >
      {children}
    </div>
  )
);
Card.displayName = 'Card';

// Define the props for the CardContent component
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  // You can add more specific props here if needed
}

// CardContent Component
const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={className} // You would typically add your styling classes here
      {...props}
    >
      {children}
    </div>
  )
);
CardContent.displayName = 'CardContent';

export { Card, CardContent };