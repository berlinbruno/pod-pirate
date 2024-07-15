import Header from "@/components/navigation/Header";
import { ThemeProvider } from "@/components/theme-provider";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import Template from "./template";

const inter = Inter({ subsets: ["latin"] });

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

export const metadata = {
  metadataBase: new URL("https://podpirate.netlify.app"),
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
  authors: "Berlin Bruno",
  manifest: "https://podpirate.netlify.app/manifest.js",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="canonical" href="https://podpirate.netlify.app/" />
      </head>
      <body className={`${inter.className} select-none`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <Template>{children}</Template>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
