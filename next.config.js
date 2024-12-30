/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: [
    '@radix-ui/react-select',
    '@radix-ui/react-dialog',
    '@radix-ui/react-avatar',
    '@radix-ui/react-label',
    '@radix-ui/react-slider',
    '@radix-ui/react-slot'
  ]
}

module.exports = nextConfig