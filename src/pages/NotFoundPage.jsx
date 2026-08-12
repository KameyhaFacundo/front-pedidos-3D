import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="page-center" style={{ gap: 16, textAlign: 'center' }}>
      <div style={{ fontFamily: "'Fraunces', serif", fontSize: 72, color: 'var(--hair)', lineHeight: 1 }}>
        404
      </div>
      <h2 style={{ color: 'var(--cream)', fontSize: 20 }}>Página no encontrada</h2>
      <p style={{ color: 'var(--muted)', fontSize: 14, maxWidth: 280 }}>
        La página que buscás no existe o fue movida.
      </p>
      <Link to="/" className="btn btn-primary" style={{ marginTop: 8 }}>
        Volver al inicio
      </Link>
    </div>
  );
}
