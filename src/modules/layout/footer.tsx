import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, MapPin, Linkedin, Instagram, Phone } from 'lucide-react'

function Footer() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className='w-[98vw] h-[96vh] bg-neutral-900 rounded-3xl overflow-hidden relative shadow-2xl'>
        <Image src='/footer.svg' fill alt='Footer background' className='object-cover object-bottom' />
        {/* Main content */}
        <div className="relative z-10 h-full flex flex-col text-white p-8 md:p-12">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Looking for opportunities section */}
            <div className="space-y-6">
              <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
                looking for opportunities?
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold leading-tight">
                  experienced developers/<br />
                  <span className="text-orange-300">innovators</span>
                </h3>
              </div>
              <Link 
                href="/careers" 
                className="inline-block bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 hover:scale-105"
              >
                View Opportunities →
              </Link>
            </div>

            {/* Office/Location section */}
            <div className="space-y-6">
              <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
                office
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold">
                  tech hub india<br />
                  mumbai, maharashtra
                </h3>
                <p className="text-white/80 mt-2 text-sm">
                  Innovation Center, Bandra-Kurla Complex
                </p>
              </div>
              <Link 
                href="https://maps.google.com" 
                target="_blank"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 hover:scale-105"
              >
                <MapPin size={16} />
                Google Maps
              </Link>
            </div>

            {/* Contact section */}
            <div className="space-y-6">
              <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
                contact
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold">
                  hello@grobots.tech<br />
                  <span className="text-green-300">send us a message*</span>
                </h3>
                <p className="text-white/60 text-xs mt-2">
                  *we're millennials and gen-z: please do not call us.
                </p>
              </div>
              
              {/* Social links */}
              <div className="flex gap-3">
                <Link 
                  href="https://linkedin.com/company/grobots" 
                  target="_blank"
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={18} />
                </Link>
                <Link 
                  href="https://instagram.com/grobots.tech" 
                  target="_blank"
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  aria-label="Instagram"
                >
                  <Instagram size={18} />
                </Link>
                <Link 
                  href="mailto:hello@grobots.tech" 
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  aria-label="Email"
                >
                  <Mail size={18} />
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom section */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-white/60 text-sm">
                © 2025 GRobots. Building the future with innovative robotics.
              </div>
              <div className="flex gap-6 text-sm">
                <Link href="/privacy" className="text-white/60 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-white/60 hover:text-white transition-colors">
                  Terms of Service
                </Link>
                <Link href="/about" className="text-white/60 hover:text-white transition-colors">
                  About Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer