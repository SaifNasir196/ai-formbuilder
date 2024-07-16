/** @type {import('next').NextConfig} */


const nextConfig = {
  env: {
    DATABASE_URL_CONFIG: process.env.DATABASE_URL_CONFIG,
  },
}


export default nextConfig;
