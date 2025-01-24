import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    output: 'export',
    async redirects() {
        return [
            // Basic redirect
            {
                source: '/',
                destination: '/uezdy',
                permanent: true,
            },
        ]
    },
};

export default nextConfig;
