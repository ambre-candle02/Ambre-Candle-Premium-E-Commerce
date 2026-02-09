
const Logo = () => {
    return (
        <div className="ambre-logo-container" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div className="logo-text-group" style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '1.8rem',
                    fontWeight: '700',
                    color: 'var(--color-text-primary)',
                    lineHeight: '1',
                    marginBottom: '2px'
                }}>
                    Ambre candle
                </span>
                <span style={{
                    fontFamily: "'Lato', sans-serif",
                    fontSize: '0.7rem',
                    fontWeight: '700',
                    letterSpacing: '3px',
                    textTransform: 'uppercase',
                    color: 'var(--color-accent)',
                    marginLeft: '2px'
                }}>
                    Product Catalog
                </span>
            </div>
        </div>
    );
};

export default Logo;
