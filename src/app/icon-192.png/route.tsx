import { ImageResponse } from 'next/og'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 192,
          height: 192,
          borderRadius: 40,
          background: '#07050f',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 128,
            height: 128,
            borderRadius: 28,
            background: 'linear-gradient(135deg,#9333ea,#6366f1,#38bdf8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 80,
          }}
        >
          ⚡
        </div>
      </div>
    ),
    { width: 192, height: 192 }
  )
}
