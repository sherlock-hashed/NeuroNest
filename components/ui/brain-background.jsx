'use client';

import { motion } from 'framer-motion';

export const BrainBackground = () => {
  const nodes = [
    { x: 20, y: 10, size: 10 },
    { x: 60, y: 20, size: 8 },
    { x: 30, y: 50, size: 6 },
    { x: 80, y: 40, size: 7 },
    { x: 50, y: 70, size: 5 },
  ];

  return (
    <svg
      className="absolute w-full h-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {nodes.map((node, idx) => (
        <motion.circle
          key={idx}
          cx={node.x}
          cy={node.y}
          r={node.size}
          fill="black"
          fillOpacity={0.08}
          animate={{
            cx: [node.x, node.x + Math.random() * 5 - 2.5, node.x],
            cy: [node.y, node.y + Math.random() * 5 - 2.5, node.y],
          }}
          transition={{
            duration: 6 + Math.random() * 2,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
          }}
        />
      ))}
    </svg>
  );
};
