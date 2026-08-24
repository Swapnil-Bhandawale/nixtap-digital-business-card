import React from 'react';

export function GradientAccent({ position = 'top-right', color = 'brand' }) {
  const positions = {
    'top-right': 'top-0 right-0 translate-x-1/3 -translate-y-1/3',
    'top-left': 'top-0 left-0 -translate-x-1/3 -translate-y-1/3',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  };
  
  const colors = {
    brand: 'from-brand-500/20 to-purple-500/20',
    emerald: 'from-emerald-500/20 to-teal-500/20',
    rose: 'from-rose-500/20 to-orange-500/20'
  };

  return (
    <div className={`absolute pointer-events-none z-0 w-96 h-96 rounded-full blur-[100px] bg-gradient-to-br ${colors[color]} ${positions[position]}`} />
  );
}