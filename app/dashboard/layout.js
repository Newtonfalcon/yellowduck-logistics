import AuthorizationGate from "@/components/auth/AuthorizationGate";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthorizationGate>
          {children}
        </AuthorizationGate>
      </body>
    </html>
  );
}
