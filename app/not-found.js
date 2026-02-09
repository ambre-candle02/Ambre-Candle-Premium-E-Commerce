import Link from 'next/link';

export default function NotFound() {
    return (
        <div style={{
            height: '80vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '20px',
            background: '#fff'
        }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '4rem', marginBottom: '10px', color: '#1a1a1a' }}>404</h2>
            <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '30px' }}>The page you are looking for has vanished into thin air.</p>
            <Link href="/">
                <button style={{
                    padding: '14px 35px',
                    background: '#1a1a1a',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '0',
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    letterSpacing: '2px'
                }}>
                    Return Home
                </button>
            </Link>
        </div>
    );
}
