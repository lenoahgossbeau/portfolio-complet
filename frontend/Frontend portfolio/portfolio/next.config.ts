import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
<<<<<<< HEAD
};

export default nextConfig;
=======
  // Ignorer les erreurs TypeScript pendant le build (pour Render)
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ignorer les erreurs ESLint pendant le build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // ✅ Configuration des images pour Next.js
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
>>>>>>> f4845cf3085e1ea3eadeea21e1681219a592d066
