import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SocialSidebar from "@/components/SocialSidebar";
import { UserProvider } from "@/components/UserContext";
import { CartProvider } from "@/components/CartContext";
import EnquiryDrawer from "@/components/EnquiryDrawer";
import EnquirySuccessModal from "@/components/EnquirySuccessModal";
import FloatingEnquiryDock from "@/components/FloatingEnquiryDock";
import { getCurrentUserSnapshot } from "@/lib/supabase/auth";
import { NAP, SITE_URL, sameAsProfiles } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteDescription =
  "Commercial laundry machine sales, installation, service, and maintenance for businesses across Tamil Nadu and Kerala. Get expert support from SL Laundry Tech.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Commercial Laundry Machine Experts | SL Laundry Tech",
    template: "%s | SL Laundry Tech",
  },
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/SL-Logo.png",
  },
  openGraph: {
    title: "Commercial Laundry Machine Experts | SL Laundry Tech",
    description: siteDescription,
    url: `${SITE_URL}/`,
    siteName: "SL Laundry Tech",
    type: "website",
    images: [
      {
        url: "/SL-Laundary Banner.png",
        width: 1200,
        height: 630,
        alt: "SL Laundry Tech commercial laundry equipment specialists",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Commercial Laundry Machine Experts | SL Laundry Tech",
    description: siteDescription,
    images: ["/SL-Laundary Banner.png"],
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const initialUser = await getCurrentUserSnapshot();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#business`,
    name: "SL Laundry Tech",
    url: SITE_URL,
    logo: `${SITE_URL}/SL-Logo.png`,
    image: `${SITE_URL}/SL-Laundary Banner.png`,
    description: siteDescription,
    email: NAP.email,
    telephone: NAP.phone,
    priceRange: "$$",
    currenciesAccepted: "INR",
    address: {
      "@type": "PostalAddress",
      streetAddress: NAP.streetAddress,
      addressLocality: NAP.addressLocality,
      addressRegion: NAP.addressRegion,
      postalCode: NAP.postalCode,
      addressCountry: NAP.addressCountry,
    },
    areaServed: [
      { "@type": "State", name: "Tamil Nadu" },
      { "@type": "State", name: "Kerala" },
      { "@type": "Country", name: "India" },
    ],
    knowsAbout: [
      "Commercial laundry machines",
      "Washer extractors",
      "Commercial laundry installation",
      "Preventive maintenance",
      "Annual Maintenance Contracts",
      "Laundry spare parts",
      "Machine relocation",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: NAP.phone,
      email: NAP.email,
      contactType: "sales and support",
      areaServed: ["IN"],
      availableLanguage: ["English", "Tamil", "Malayalam"],
    },
    sameAs: sameAsProfiles,
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F8FAFC]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <UserProvider initialUser={initialUser}>
          <CartProvider>
            <div className="mx-auto w-full max-w-[1400px] px-3 sm:px-6">
              <Header />
              <main className="min-h-[calc(100vh-200px)]">{children}</main>
            </div>
            <Footer />
            <SocialSidebar />
            <EnquiryDrawer />
            <EnquirySuccessModal />
            <FloatingEnquiryDock />
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  );
}
