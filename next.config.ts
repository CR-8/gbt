import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['images.pexels.com','example.com','images.unsplash.com','images.remotePatterns','picsum.photos','res.cloudinary.com'],
  },
  compiler: {
    styledComponents: true,
  },
};

export default nextConfig;
