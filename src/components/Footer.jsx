const LANDING_URL = import.meta.env.VITE_LANDING_URL || 'https://pidevo.com';

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

        <div className="footer-cta">
          <div className="footer-cta-text">¿Querés un sistema como este para tu local?</div>
          <a
            href={LANDING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-cta-link"
          >
            Conocé Pidevo
            <i className="ti ti-arrow-right"></i>
          </a>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Pidevo</span>
          <span className="footer-dot">·</span>
          <span>Hecho con ❤</span>
        </div>
      </div>
    </footer>
  );
}
