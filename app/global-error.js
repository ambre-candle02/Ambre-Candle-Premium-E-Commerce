'use client';

export default function GlobalError({ error, reset }) {
    console.error("Global Error Caught:", error);

    return (
        <html>
            <body style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#1b1f1c',
                color: '#fff',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                textAlign: 'center',
                padding: '20px',
                margin: 0
            }}>
                <div style={{ maxWidth: '600px' }}>
                    <h1 style={{ fontSize: '3rem', color: '#d4af37', marginBottom: '10px' }}>Oops!</h1>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>A critical error occurred.</h2>
                    <p style={{ color: '#9ca3af', marginBottom: '40px' }}>
                        Something went wrong at the core of our artisan studio. We are working to restore the brilliance.
                    </p>
                    <button
                        onClick={() => reset()}
                        style={{
                            padding: '16px 40px',
                            background: '#d4af37',
                            color: '#000',
                            border: 'none',
                            borderRadius: '50px',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}
                    >
                        Re-Illuminate (Reset)
                    </button>
                    {error && (
                        <p style={{ marginTop: '20px', fontSize: '0.8rem', color: '#555' }}>
                            {error.message || "An unknown error occurred"}
                        </p>
                    )}
                </div>
            </body>
        </html>
    );
}
