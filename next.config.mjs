/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['cdn.sanity.io'],
      remotePatterns:[
        {
          protocol:'https',
          hostname:'lh3.googleusercontent.com'

        }
      ]
    },
  };
  
  export default nextConfig;
  