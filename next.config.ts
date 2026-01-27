import type { NextConfig } from "next";
import path from "path";
const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'picsum.photos',
            },
        ],
    },
    sassOptions: {
        includePaths: [path.join(process.cwd(), "src")],
    },
};

export default nextConfig;
