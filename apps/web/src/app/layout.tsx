import type { Metadata } from "next";
import './globals.css'

export const metadata: Metadata = {
  title: "Expense Tracker",
  description: "Track your personal expenses with ease",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Expense Tracker"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ExpenseItem Tracker" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
