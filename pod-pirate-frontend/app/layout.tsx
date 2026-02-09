import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/provider/theme-provider";
import { SessionProvider } from "@/components/provider/session-provider";
import { AudioPlayerProvider } from "@/components/provider/audio-player-provider";
import Header from "@/components/navigation/Header";
import Template from "./template";
import { Toaster } from "@/components/ui/sonner";
import Disclaimer from "@/components/layout/Disclaimer";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const APP_NAME = "Pod Pirate";
const APP_DEFAULT_TITLE = "Pod Pirate";
const APP_TITLE_TEMPLATE = "%s";
const APP_DESCRIPTION =
  "PodPirate is your ultimate destination for discovering, streaming, and managing your favorite podcasts. Set sail on an audio adventure with our intuitive platform, where you can explore a vast ocean of content, from the latest episodes to timeless classics.";

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#3d5a80" },
    { media: "(prefers-color-scheme: dark)", color: "#3d5a80" },
  ],
};
const baserUrl = process.env.NEXT_BACKEND_URL;
export const metadata: Metadata = {
  metadataBase: new URL(baserUrl as string),
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  authors: { name: "Berlin Bruno" },
  manifest: `${baserUrl}/manifest.ts`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="canonical" href={baserUrl} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AudioPlayerProvider>
              <Disclaimer />
              <Header />
              <Template>{children}</Template>
              <Toaster richColors={true} />
            </AudioPlayerProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
