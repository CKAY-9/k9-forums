import Head from "next/head"
import "./globals.scss"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "K9 Forums",
    description: "Free and Open-source Forum Software"
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body>
				<div className="notifications" id="notifications"></div>
				{children}
			</body>
		</html>
	)
}
