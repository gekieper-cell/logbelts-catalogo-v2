import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Catálogo Logbelts — repuestos para bosque y jardín',
    template: '%s · Catálogo Logbelts',
  },
  description:
    'Repuestos Logbelts para motosierras, desmalezadoras, cortadoras de césped y motores.',
  applicationName: 'Catálogo Logbelts',
};

const temaScript = `(function(){try{var t=localStorage.getItem('tema');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'oscuro':'claro';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: temaScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
