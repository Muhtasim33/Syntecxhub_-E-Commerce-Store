'use client';

import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { stagger } from '@/lib/motion/config';

interface StaggerGroupProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
}

export function StaggerGroup({ children, className = '', ...props }: StaggerGroupProps) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
