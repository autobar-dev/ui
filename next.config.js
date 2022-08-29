/** @type {import('next').NextConfig} */

const withGraphQL = require('next-plugin-graphql');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['browarpinta.pl'],
  },
};

module.exports = withGraphQL(nextConfig);