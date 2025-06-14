/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    NEXTAUTH_SECRET: 'a_very_long_secret_value_at_least_32_chars',
    NEXTAUTH_URL: 'http://localhost:3002',
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'localhost:3002'],
    },
  },
}

module.exports = nextConfig 