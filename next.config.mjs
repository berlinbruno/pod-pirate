/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "localhost",
      },
      {
        hostname: process.env.NEXT_IMAGES_REMOTE_PATTERN_1,
      },
      {
        hostname: process.env.NEXT_IMAGES_REMOTE_PATTERN_2,
      },
    ],
  },
};


const nextConfigFunction = async () => {
  const withPWA = (await import("@ducanh2912/next-pwa")).default({
    dest: "public",
    cacheOnFrontEndNav: true,
    scope: "/",
    reloadOnOnline: true,
    workboxOptions: {
      runtimeCaching: [
        {
          urlPattern: new RegExp(
            `^https:\/\/${process.env.NEXT_IMAGES_REMOTE_PATTERN_1}\/.*`
          ),
          handler: "CacheFirst",
          options: {
            cacheName: "remote-pattern-1-assets",
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
            },
          },
        },
        {
          urlPattern: new RegExp(
            `^https:\/\/${process.env.NEXT_IMAGES_REMOTE_PATTERN_2}\/.*`
          ),
          handler: "CacheFirst",
          options: {
            cacheName: "remote-pattern-2-assets",
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
            },
          },
        },
      ],
    },
  });
  return withPWA(nextConfig);
};

export default nextConfigFunction;
