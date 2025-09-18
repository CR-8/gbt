'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Dock from '@/components/ui/dock';
import { Home, Archive, Settings, FolderOpen, Users } from 'lucide-react';

export default function Nav() {
  const [isVisible, setIsVisible] = useState(true);
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let lastScrollY = window.scrollY;

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
      icon: <FolderOpen className="w-6 h-6 text-white" />, 
      label: 'Projects', 
      onClick: () => console.log('Projects clicked') 
    },
    { 
      icon: <Users className="w-6 h-6 text-white" />, 
      label: 'Team', 
      onClick: () => console.log('Team clicked') 
    },
    { 
      icon: <Archive className="w-6 h-6 text-white" />, 
      label: 'Archive', 
      onClick: () => console.log('Archive clicked') 
    },
    { 
      icon: <Settings className="w-6 h-6 text-white" />, 
      label: 'Settings', 
      onClick: () => console.log('Settings clicked') 
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