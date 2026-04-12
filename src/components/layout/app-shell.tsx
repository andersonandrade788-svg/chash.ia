'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Topbar } from '@/components/layout/topbar'
import { DemoBanner } from '@/components/layout/demo-banner'
import { VideoBackground } from '@/components/layout/video-background'
import type { Profile } from '@/types/database'

export function AppShell({ profile, children }: { profile: Profile | null; children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#03010a' }}>
      <VideoBackground />

      {/* Desktop sidebar */}
      <div className="hidden md:flex h-full relative z-10">
        <Sidebar plan={profile?.plan} userName={profile?.name ?? undefined} />
      </div>

      {/* Mobile sidebar drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 md:hidden flex h-full">
            <Sidebar
              plan={profile?.plan}
              userName={profile?.name ?? undefined}
              mobileOpen={mobileOpen}
              onMobileClose={() => setMobileOpen(false)}
            />
          </div>
        </>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative z-10">
        {process.env.NEXT_PUBLIC_DEMO_MODE === 'true' && <DemoBanner />}
        <Topbar profile={profile} onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
