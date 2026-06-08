import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Nunito } from 'next/font/google'
import './globals.css'
import { AppProvider } from '@/lib/contexts/app-context'
import { AuthProvider } from '@/lib/contexts/auth-context'
import { Toaster } from '@/components/ui/sonner'

const nunito = Nunito({ 
  subsets: ['latin'],
  variable: '--font-nunito',
})

export const metadata: Metadata = {
  title: '毛绒精灵 - 智能玩偶控制',
  description: '与你的毛绒玩偶对话、旅行、交友的智能APP',
  generator: 'v0.app',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '毛绒精灵',
  },
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/icon-192.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#FF9B8E',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" className={nunito.variable}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="font-sans antialiased bg-background">
        <AuthProvider>
          <AppProvider>
            <div className="mx-auto max-w-md min-h-screen bg-background">
              {children}
            </div>
            <Toaster />
          </AppProvider>
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
