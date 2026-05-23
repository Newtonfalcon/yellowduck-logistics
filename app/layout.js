import Navbar from "@/components/nav/Navbar";
import "./globals.css";

export const metadata = {
  title: "Yellowduck Freight Systems",
  description: "Industrial Shipment Tracking Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        
      </body>
    </html>
  );
}