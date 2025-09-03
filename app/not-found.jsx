'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BrainBackground } from '@/components/ui/brain-background';
import { SparklesCore } from '@/components/ui/sparkles'; // Optional animation, custom or placeholder
import { BrainCircuit } from 'lucide-react';

const NotFoundPage = () => {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch((prev) => !prev);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center px-6 relative overflow-hidden">

      {/* Optional Floating Animation or Neural Background */}
      <div className="absolute inset-0 z-0 opacity-5">
        <BrainBackground />
      </div>

      <main className="z-10 text-center max-w-2xl w-full">
        {/* Glitch-style 404 */}
        <h1 className={`text-[120px] sm:text-[160px] font-extrabold tracking-widest select-none ${glitch ? 'animate-glitch' : ''}`}>
          404
        </h1>

        {/* Headline */}
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Lost in Thought?</h2>

        {/* Subtext */}
        <p className="text-gray-600 mb-8">
          The page you’re looking for doesn’t exist—or hasn’t been discovered yet.
        </p>

        {/* CTA Button */}
        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(0,0,0,0.2)' }}
            className="px-6 py-3 bg-black text-white rounded-full transition-all duration-300 hover:bg-gray-900"
          >
            Return to Safety
          </motion.button>
        </Link>

        {/* Easter Egg */}
        <p className="text-xs text-gray-400 mt-8">Error code: <code className="font-mono">404.NEURO.DEVIATION</code></p>
      </main>
    </div>
  );
};

export default NotFoundPage;
