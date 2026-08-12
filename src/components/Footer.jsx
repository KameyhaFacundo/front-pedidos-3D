import { Link } from 'react-router-dom';

const REDES = [
  { icon: 'ti-brand-instagram', label: 'Instagram', href: 'https://instagram.com/pidevo' },
  { icon: 'ti-brand-facebook', label: 'Facebook', href: 'https://facebook.com/pidevo' },
  { icon: 'ti-brand-tiktok', label: 'TikTok', href: 'https://tiktok.com/@pidevo' },
  { icon: 'ti-brand-whatsapp', label: 'WhatsApp', href: 'https://wa.me/5493815069332' },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <img src="/pidevo.png" alt="Pidevo" className="brand-logo" />
            <p className="footer-tagline">Pedí fácil desde tu celular.</p>
          </div>

          <div className="footer-socials">
            {REDES.map(({ icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social"
                aria-label={label}
              >
                <i className={`ti ${icon}`}></i>
              </a>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Pidevo · Hecho con ❤</span>
          <Link to="/landing" className="footer-made">
            ¿Querés tu propio sistema? <span>Conocé Pidevo</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
