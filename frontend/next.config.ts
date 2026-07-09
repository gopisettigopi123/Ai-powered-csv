import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Add this line to allow requests from your backend
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { 
            key: 'Access-Control-Allow-Origin', 
            value: '*' // Or specify your backend URL like 'http://backend:5000' if you have CORS issues
          },
          {
            key: 'Access-Control-Allow-Methods', 
            value: 'GET,POST,PUT,DELETE,OPTIONS' 
          },
          {
            key: 'Access-Control-Allow-Headers',     
            value: 'Content-Type, Authorization' 
          },
        ],
      },
    ];
  },
};

export default nextConfig;
