/** @type {import('next').NextConfig} */
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
    }
}

module.exports = nextConfig
