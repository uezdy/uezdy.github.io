import type {NextConfig} from "next";

const nextConfig: NextConfig = {
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
