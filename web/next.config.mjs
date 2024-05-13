/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export', // Add this line
    webpack: (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            sharp$: false,
            'onnxruntime-node$': false,
        };
        return config;
    },
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
        ],
    }
};

export default nextConfig;
