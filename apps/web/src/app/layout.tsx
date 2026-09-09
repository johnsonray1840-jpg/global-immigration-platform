import { Inter, DM_Serif_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import SocketProvider from "@/components/providers/socket-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { LanguageProvider } from "@/i18n/LanguageContext";
import type { Metadata, Viewport } from "next";


import dynamic from "next/dynamic";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif",
});

const AIChatWidget = dynamic(() => import("@/components/ai/AIChatWidget"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: 'Global Immigration & Visa Platform',
  description: 'AI-Powered Global Immigration, Visa Processing, and Citizenship by Investment Platform',
  other: {
    google: 'notranslate',
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B5D66",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="notranslate" suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={`${inter.variable} ${dmSerif.variable} font-body antialiased`}
        suppressHydrationWarning
      >
        {/* Strong cleanup script – runs before hydration and observes DOM changes */}
        <Script id="cleanup-ext-attrs" strategy="beforeInteractive">
          {`
            (function() {
              function removeExtAttrs(root) {
                var all = (root || document).querySelectorAll('*');
                for (var i = 0; i < all.length; i++) {
                  var el = all[i];
                  if (el.hasAttribute && el.hasAttribute('bis_skin_checked')) {
                    el.removeAttribute('bis_skin_checked');
                  }
                }
              }

              // Remove existing attributes immediately
              removeExtAttrs();

              // Set up a MutationObserver to catch future additions
              var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                  if (mutation.type === 'attributes' && mutation.attributeName === 'bis_skin_checked') {
                    var target = mutation.target;
                    if (target && target.removeAttribute) {
                      target.removeAttribute('bis_skin_checked');
                    }
                  } else if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                      if (node.nodeType === 1 && node.hasAttribute && node.hasAttribute('bis_skin_checked')) {
                        node.removeAttribute('bis_skin_checked');
                      }
                      // Also check descendants of added nodes
                      if (node.nodeType === 1) {
                        removeExtAttrs(node);
                      }
                    });
                  }
                });
              });

              observer.observe(document.documentElement, {
                attributes: true,
                childList: true,
                subtree: true,
                attributeFilter: ['bis_skin_checked']
              });

              // Disconnect after a short delay to avoid performance issues
              // This is long enough to cover hydration
              setTimeout(function() {
                observer.disconnect();
              }, 5000);
            })();
          `}
        </Script>

        <ThemeProvider>
          <LanguageProvider>
            <SocketProvider>
              {children}
              <AIChatWidget />
            </SocketProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}