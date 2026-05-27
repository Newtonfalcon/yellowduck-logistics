import AuthorizationGate from "@/components/auth/AuthorizationGate";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthorizationGate requireAdmin>
          {children}
        </AuthorizationGate>
      </body>
    </html>
  );
}
