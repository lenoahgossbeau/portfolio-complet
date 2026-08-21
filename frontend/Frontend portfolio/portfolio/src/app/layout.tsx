import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/hooks/LanguageProvider";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "InchTechs - Plateforme de portfolios pour chercheurs",
    template: "%s | InchTechs",
  },
  description:
    "Plateforme de portfolios pour enseignants-chercheurs. Publiez vos travaux, projets et publications.",
  keywords: [
    "chercheur",
    "portfolio",
    "publications",
    "projets",
    "CV",
    "recherche",
  ],
  authors: [{ name: "Noumedem Chabifor Arnaud" }],
  openGraph: {
    title: "InchTechs",
    description: "Découvrez les portfolios des chercheurs et leurs travaux.",
    url: "https://inchtechs.com",
    siteName: "InchTechs",
    images: [
      {
        url: "https://inchtechs.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "InchTechs - Plateforme de chercheurs",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "InchTechs",
    description: "Portfolios pour chercheurs",
    images: ["https://inchtechs.com/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "votre-code-de-verification-google",
  },
  alternates: {
    canonical: "https://inchtechs.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.className} antialiased`}>
        <LanguageProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#363636",
                color: "#fff",
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: "#22c55e",
                  secondary: "#fff",
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#fff",
                },
              },
            }}
          />

          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}