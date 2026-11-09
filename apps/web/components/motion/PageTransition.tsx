'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ease } from '@/lib/motion/config';

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease }}
      className="w-full flex-1"
    >
      {children}
    </motion.div>
  );
}
