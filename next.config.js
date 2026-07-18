// ============================================================================
// next.config.js — Apiaí Serviços
// Configura o app como PWA instalável (funciona tanto no PC via navegador
// quanto no celular via "Adicionar à tela inicial" / instalação Android).
// ============================================================================

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

module.exports = withPWA(nextConfig);
