/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // lib/schedules.ts で date-fns-tz を使用すると build でエラーが発生するので、回避するための暫定処置 (本当は、v4系に揃える方が望ましい)
    serverComponentsExternalPackages: ["date-fns-tz"],
  },
};

export default nextConfig;
