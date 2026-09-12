import { Inter, DM_Serif_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import SocketProvider from "@/components/providers/socket-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { LanguageProvider } from "@/i18n/LanguageContext";
import GlobalAIChat from "@/components/ai/GlobalAIChat";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import type { Metadata, Viewport } from "next";


const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif",
});


export const metadata: Metadata = {
  title: 'Global Citizens Solution | Immigration & Mobility Platform',
  description: 'Global Citizens Solution - AI-Powered Global Immigration, Citizenship by Investment, Visa Processing, and Residency Solutions',
  other: {
    google: 'notranslate',
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#071A2B",
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Global Citizens Solution',
  description: 'AI-Powered Global Immigration, Citizenship by Investment, Visa Processing, and Residency Solutions.',
  url: 'https://global-immigration-platform.vercel.app',
  email: 'support@gcsworldwide.org',
  priceRange: '$$$$',
  areaServed: 'Worldwide',
  serviceType: [
    'Immigration Consulting',
    'Citizenship by Investment',
    'Residency by Investment',
    'Work Permits',
    'Student Visas',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="notranslate" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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

              // Auto-recover from deployment chunk mismatches
              window.addEventListener('error', function(e) {
                if (e && e.message && /Loading chunk [\d]+ failed/i.test(e.message)) {
                  var chunkKey = 'gcs_reload_' + (e.filename || 'general');
                  if (!sessionStorage.getItem(chunkKey)) {
                    sessionStorage.setItem(chunkKey, '1');
                    window.location.reload();
                  }
                }
              });

              window.addEventListener('unhandledrejection', function(e) {
                if (e && e.reason && (e.reason.name === 'ChunkLoadError' || (e.reason.message && /Loading chunk/i.test(e.reason.message)))) {
                  var rejectKey = 'gcs_rejection_reload';
                  if (!sessionStorage.getItem(rejectKey)) {
                    sessionStorage.setItem(rejectKey, '1');
                    window.location.reload();
                  }
                }
              });
            })();
          `}
        </Script>

        <ThemeProvider>
          <LanguageProvider>
            <SocketProvider>
              {children}
              <GlobalAIChat />
              <WhatsAppButton />
            </SocketProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}