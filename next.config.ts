import type { NextConfig } from "next";
import path from "path";
const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'picsum.photos',
            },
            {
                protocol: 'https',
                hostname: 'skillup-project-s3-bucket.s3.ap-northeast-2.amazonaws.com',
                port: '',
                pathname: '/**',
            },

        ],
    },
    sassOptions: {
        includePaths: [path.join(__dirname, "src" )],
    },

};

export default nextConfig;
