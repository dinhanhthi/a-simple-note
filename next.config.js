/** @type {import('next').NextConfig} */
module.exports = {
  trailingSlash: true, // use "/about/" instead of "/about"
  poweredByHeader: false, // remove "Powered by Next.js" from the header
  transpilePackages: ['react-syntax-highlighter'],
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true,
  },
  experimental: {
    scrollRestoration: true,
  },
}
