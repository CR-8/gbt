'use client';

import { useState, useEffect } from 'react';
import Dock from '@/components/ui/Dock';
import { Home, Archive, Users, Book } from 'lucide-react';

export default function Nav() {
  const [isVisible, setIsVisible] = useState(true);
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Hide navbar immediately when scrolling starts
      setIsVisible(false);

      // Clear existing timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      // Set new timeout to show navbar after scrolling stops
      const timeout = setTimeout(() => {
        setIsVisible(true);
      }, 150); // Show after 150ms of no scrolling

      setScrollTimeout(timeout);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [scrollTimeout]);

  const items = [
    { 
      icon: <Home className="w-6 h-6 text-white" />, 
      label: 'Home', 
      onClick: () => window.location.href = '/' 
    },
    { 
      icon: <Users className="w-6 h-6 text-white" />, 
      label: 'Team', 
      onClick: () => window.location.href = '/team' 
    },
    { 
      icon: <Archive className="w-6 h-6 text-white" />, 
      label: 'Events', 
      onClick: () => window.location.href = '/events' 
    },
    { 
      icon: <Book className="w-6 h-6 text-white" />, 
      label: 'Blogs', 
      onClick: () => window.location.href = '/blogs' 
    }
  ];

  return (
    <div className={`fixed bottom-0 left-0 right-0 w-full flex justify-center z-50 pb-4 transition-opacity duration-300 ${
      isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}>
      <Dock 
        items={items}
        panelHeight={68}
        baseItemSize={50}
        magnification={70}
        className="bg-neutral-900 "
      />
    </div>    
  );
}