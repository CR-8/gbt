import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Mail } from 'lucide-react';



function Header() {
    return (
        <nav className="w-full m-2 p-4 flex items-center justify-between rounded-lg">
            {/*Logo */}
            <div className="flex items-center justify-center">
                <Link href="/" className="transform hover:scale-110 transition-transform">
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={70}
                        height={70}
                        className="rounded-full"
                    />
                </Link>
            </div>

            {/* Right Section: Social Links */}
            <div className="flex items-center space-x-4">
                <div className="relative group">
                    <a
                        href="mailto:grobotsclub@gmail.com"
                        className="text-text-light hover:text-text-brand-hover transition-colors"
                        aria-label="Email"
                    >
                        <Mail size={24} className="text-black dark:text-white mr-2" />
                    </a>
                    <div className="absolute top-full right-0 mt-2 hidden group-hover:block bg-tooltip-bg border border-tooltip-border rounded-lg shadow-xl p-4 z-10 max-w-[280px] transform transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2">
                        <div className="text-sm text-text-secondary">
                            <h4 className="font-bold text-text-primary mb-3 flex items-center">
                                <Mail size={16} className="mr-2 text-text-brand" />
                                Contact Us
                            </h4>
                            <p className="mb-2">
                                <strong>Email:</strong> 
                                <a href="mailto:grobotsclub@gmail.com" className="text-text-link hover:underline ml-1">
                                    grobotsclub@gmail.com
                                </a>
                            </p>
                            <p className="mb-3">Scan the QR code to open your mail app:</p>
                            <div className="flex justify-center">
                                <Image
                                    src="/qr-code.png"
                                    alt="QR Code for email"
                                    width={120}
                                    height={120}
                                    className="rounded-lg shadow-md border"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Header;
