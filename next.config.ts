import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    output: 'export',
    async redirects() {
        return [
            {
                source: '/',
                destination: '/uezdy',
                permanent: true,
            },
        ]
    },
};

export default nextConfig;
