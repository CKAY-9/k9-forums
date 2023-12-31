/** @type {import('next').NextConfig} */
const removeImports = require('next-remove-imports')();

const nextConfig = {
    "images": {
        "remotePatterns": [
            {
                "hostname": "contrib.rocks"
            },
            {
                "hostname": "127.0.0.1"
            }
        ],
        "dangerouslyAllowSVG": true
    },
    "output": "standalone",
    "typescript": {
        "ignoreBuildErrors": true
    }
}

module.exports = nextConfig, removeImports
