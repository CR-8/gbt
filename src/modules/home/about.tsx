'use client'

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

function About() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const svgRefs = useRef<(SVGSVGElement | null)[]>([]);

  useEffect(() => {
    // Animate heading
    if (headingRef.current) {
      gsap.from(headingRef.current, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: "power2.out"
      });
    }

    // Animate text
    if (textRef.current) {
      gsap.from(textRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        delay: 0.3,
        ease: "power2.out"
      });
    }

    // Animate SVGs with stagger
    svgRefs.current.forEach((svg, index) => {
      if (svg) {
        gsap.from(svg, {
          opacity: 0,
          scale: 0.8,
          duration: 0.5,
          delay: 0.5 + index * 0.1,
          ease: "back.out(1.7)"
        });
      }
    });
  }, []);

  const handleSvgHover = (index: number) => {
    const svg = svgRefs.current[index];
    if (svg) {
      gsap.to(svg, {
        scale: 1.1,
        rotation: index === 0 ? 5 : index === 1 ? -5 : 10,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  const handleSvgLeave = (index: number) => {
    const svg = svgRefs.current[index];
    if (svg) {
      gsap.to(svg, {
        scale: 1,
        rotation: 0,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };
  const svgs = [
    <svg 
      ref={(el) => { svgRefs.current[0] = el; }} 
      onMouseEnter={() => handleSvgHover(0)} 
      onMouseLeave={() => handleSvgLeave(0)} 
      viewBox="0 0 137 135" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      xmlnsXlink="http://www.w3.org/1999/xlink" 
      aria-hidden="true" 
      key="svg-1" 
      className="inline-block w-8 h-8 mx-2 cursor-pointer"
    >
      <path d="M84.1148 67.3453H136.194C136.637 67.3453 137 67.7028 137 68.1397V134.043C137 134.484 136.633 134.845 136.186 134.841C99.0222 134.416 68.9737 104.827 68.502 68.2191V134.206C68.502 134.643 68.1392 135 67.6958 135H0.814284C0.366822 135 -2.06673e-05 134.639 0.00401052 134.198C0.439379 97.2879 30.9354 67.5042 68.498 67.5002H0.806238C0.362807 67.5002 0 67.1427 0 66.7057V0.802561C0 0.361644 0.366822 0.000171863 0.814284 0.00414409C37.9778 0.429172 68.0263 30.0183 68.498 66.6263V0.794617C68.498 0.357672 68.8608 0.000171819 69.3042 0.000171819H136.186C136.633 0.000171819 137 0.361644 136.996 0.802561C136.621 32.4969 114.079 58.94 83.9334 65.7802C83.0022 65.9907 83.1594 67.3453 84.1189 67.3453H84.1148Z" fill="url(#paint0_linear_1655_45397)"></path>
      <defs>
        <linearGradient id="paint0_linear_1655_45397" x1="-76.6791" y1="-15.6157" x2="165.682" y2="81.0082" gradientUnits="userSpaceOnUse">
          <stop offset="0.427083" stopColor="#FF8709"></stop>
          <stop offset="0.791667" stopColor="#F7BDF8"></stop>
        </linearGradient>
      </defs>
    </svg>,
    <svg 
      ref={(el) => { svgRefs.current[1] = el; }} 
      onMouseEnter={() => handleSvgHover(1)} 
      onMouseLeave={() => handleSvgLeave(1)} 
      xmlns="http://www.w3.org/2000/svg" 
      xmlnsXlink="http://www.w3.org/1999/xlink" 
      fill="none" 
      viewBox="0 0 62 62" 
      className="inline-block w-8 h-8 mx-2 cursor-pointer" 
      aria-hidden="true" 
      key="svg-2"
    >
      <path fill="url(#home-animate-anything-flower-mobile-a)" fillRule="evenodd" d="M18.256 30.33c-1.001.211-2.038.322-3.1.322C6.786 30.651 0 23.79 0 15.325S6.785 0 15.155 0s15.156 6.862 15.156 15.326c0 .709-.048 1.406-.14 2.09h1.657c-.092-.684-.14-1.381-.14-2.09C31.689 6.862 38.475 0 46.845 0 55.214 0 62 6.862 62 15.326S55.214 30.65 46.844 30.65c-.94 0-1.862-.086-2.755-.252V31.6a15.083 15.083 0 0 1 2.755-.252C55.214 31.349 62 38.21 62 46.674 62 55.138 55.214 62 46.844 62c-8.37 0-15.155-6.862-15.155-15.326 0-1.074.11-2.123.317-3.135h-1.945c.164.904.25 1.835.25 2.787 0 8.464-6.785 15.326-15.155 15.326S0 54.79 0 46.326 6.785 31 15.155 31c1.063 0 2.1.11 3.1.321v-.99Z" clipRule="evenodd"></path>
      <defs>
        <linearGradient id="home-animate-anything-flower-mobile-a" x1="50.449" x2=".172" y1="74.75" y2="20.03" gradientUnits="userSpaceOnUse">
          <stop offset=".144" stopColor="#FFE9FE"></stop>
          <stop offset="1" stopColor="#FF96F9"></stop>
        </linearGradient>
      </defs>
    </svg>,
    <svg 
      ref={(el) => { svgRefs.current[2] = el; }} 
      onMouseEnter={() => handleSvgHover(2)} 
      onMouseLeave={() => handleSvgLeave(2)} 
      width="32" 
      height="32" 
      viewBox="0 0 372 370" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      xmlnsXlink="http://www.w3.org/1999/xlink" 
      aria-hidden="true" 
      key="svg-3" 
      className="inline-block w-8 h-8 mx-2 cursor-pointer"
    >
      <g filter="url(#goo)">
        <g fill="url(#paint0_radial_1655_45341)">
          <path d="M190 275C190 327.467 147.467 370 95 370C42.5329 370 0 327.467 0 275C0 222.533 42.5329 180 95 180C147.467 180 190 222.533 190 275Z"></path>
          <path d="M85 7.99999C85 3.58172 88.5817 0 93 0H363.884C368.302 0 371.884 3.58172 371.884 8V277C371.884 281.418 368.302 285 363.884 285H93C88.5817 285 85 281.418 85 277V7.99999Z"></path>
        </g>
      </g>
      <defs>
        <radialGradient id="paint0_radial_1655_45341" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(-4.01487e-06 268.924) rotate(-48.1016) scale(361.295 241.508)">
          <stop stopColor="#FFD9B0"></stop>
          <stop offset="0.807292" stopColor="#FD9F3B"></stop>
          <stop offset="1" stopColor="#FF8709"></stop>
        </radialGradient>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur"></feGaussianBlur>
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo"></feColorMatrix>
          <feComposite in="SourceGraphic" in2="goo" operator="atop"></feComposite>
        </filter>
      </defs>
    </svg>
  ];

  return (
    <div className="p-8 min-h-screen flex items-center justify-center">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center mt-16 mb-12">
          <h1 ref={headingRef} className="text-6xl md:text-8xl flex items-start justify-center lg:text-[10vw] font-bold text-black dark:text-text-white">
            About Us
          </h1>
        </div>
        <div ref={textRef} className="text-center max-w-6xl mx-auto text-text-secondary dark:text-text-muted text-[4vh] leading-relaxed">
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. {svgs[0]} Distinctio omnis fugiat repudiandae at earum adipisci consequatur odit, repellendus, dolores pariatur praesentium animi voluptatum debitis aspernatur dolorem vitae. Fugit temporibus error possimus expedita quibusdam explicabo adipisci, {svgs[1]} dolores numquam tenetur architecto accusantium reprehenderit perferendis aperiam enim laudantium! Ullam consequuntur voluptate sed quisquam expedita incidunt, repellendus nobis debitis nulla laudantium, {svgs[2]} architecto minima odio nesciunt. Commodi qui excepturi consectetur tempore vel earum numquam recusandae blanditiis, nesciunt eveniet veniam! Officiis labore eius quae recusandae! Dolor!
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;