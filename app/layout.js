import "./globals.css";

export const metadata = {
  title: {
    default: "Yellowduck Freight Systems",
    template: "%s | Yellowduck",
  },
  description:
    "Yellowduck powers global logistics with real-time tracking, customs automation, and seamless shipment management.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://yellowduck.io"),
  icons: {
    icon: "/file.svg",
    shortcut: "/file.svg",
    apple: "/file.svg",
  },
  openGraph: {
    title: "Yellowduck Freight Systems",
    description:
      "Yellowduck powers global logistics with real-time tracking, customs automation, and seamless shipment management.",
    type: "website",
    siteName: "Yellowduck",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://yellowduck.io",
    images: ["/file.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yellowduck Freight Systems",
    description:
      "Yellowduck powers global logistics with real-time tracking, customs automation, and seamless shipment management.",
    images: ["/file.svg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}