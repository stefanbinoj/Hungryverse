import type { Metadata } from "next";
import "../index.css";
import Providers from "@/components/providers";
import {ClerkProvider} from "@clerk/nextjs";


export const metadata: Metadata = {
	title: "feedbacl",
	description: "feedbacl",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`antialiased`}
			>
    <ClerkProvider>

				<Providers>
					<div className="h-svh">
						{children}
					</div>
				</Providers>
    </ClerkProvider>

			</body>
		</html>
	);
}
