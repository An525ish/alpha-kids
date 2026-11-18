import type { Metadata } from "next";
import { Bricolage_Grotesque, Figtree, Noto_Nastaliq_Urdu } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const sans = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  display: "swap",
});

const urdu = Noto_Nastaliq_Urdu({
  variable: "--font-noto-urdu",
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Alpha Kids",
  description:
    "Pin a parenting concern. Get a short plan and a kitchen-timer check-in. English or Urdu.",
  applicationName: "Alpha Kids",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
  },
  openGraph: {
    title: "Alpha Kids",
    description:
      "Pin a parenting concern. Get a short plan and a kitchen-timer check-in. English or Urdu.",
    siteName: "Alpha Kids",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Alpha Kids",
    description:
      "Pin a parenting concern. Get a short plan and a kitchen-timer check-in. English or Urdu.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${urdu.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
