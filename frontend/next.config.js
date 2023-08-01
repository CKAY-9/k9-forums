/** @type {import('next').NextConfig} */
const nextConfig = {
    "images": {
        "remotePatterns": [
            {
                "hostname": "contrib.rocks"
            }
        ],
        "dangerouslyAllowSVG": true
    }
}

module.exports = nextConfig
