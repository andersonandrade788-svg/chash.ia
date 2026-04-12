import { ImageResponse } from 'next/og'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 512,
          height: 512,
          borderRadius: 96,
          background: '#07050f',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 340,
            height: 340,
            borderRadius: 72,
            background: 'linear-gradient(135deg,#9333ea,#6366f1,#38bdf8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 210,
          }}
        >
          ⚡
        </div>
      </div>
    ),
    { width: 512, height: 512 }
  )
}
