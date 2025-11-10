'use client';

export default function SegmentPlaceholder({ title }: { title: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px',
        minHeight: '400px',
      }}
    >
      <div
        style={{
          fontFamily: "'Satoshi', sans-serif",
          fontSize: '16px',
          fontWeight: 500,
          color: '#717680',
        }}
      >
        {title} segment coming soon...
      </div>
    </div>
  );
}
