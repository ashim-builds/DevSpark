'use client';

import { motion } from 'framer-motion';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Card = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'bg-dark-800/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-dark-700/60 text-white',
      className
    )}
    {...props}
  />
));
Card.displayName = 'Card';

const CardHeader = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('p-6 border-b border-dark-700/60', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardContent = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('p-6 border-t border-dark-700/60', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

function MotionCard({ children, delay = 0, className, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={cn('bg-dark-800/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-dark-700/60 text-white', className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export { Card, CardHeader, CardContent, CardFooter, MotionCard };
