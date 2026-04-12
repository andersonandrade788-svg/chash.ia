import Image from 'next/image'
import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen cosmic-bg flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-center h-20 shrink-0">
        <Link href="/" className="relative group">
          <div className="absolute inset-0 blur-xl opacity-30 group-hover:opacity-50 transition-opacity"
            style={{ background: 'radial-gradient(ellipse, rgba(168,85,247,0.8), transparent)' }} />
          <Image
            src="/logo.jpg"
            alt="Cash.IA"
            width={180}
            height={54}
            className="relative object-contain h-14 w-auto"
            priority
          />
        </Link>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        {children}
      </div>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-muted-foreground">
        © {new Date().getFullYear()} Cash.IA — Crie produtos digitais que geram dinheiro
      </footer>
    </div>
  )
}
