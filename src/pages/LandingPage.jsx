import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RegistroModal from '../components/RegistroModal';

const WHATSAPP = '5493815069332';

const PALABRAS = ['menú digital', 'pedidos por WhatsApp', 'realidad aumentada 3D', 'mesas con QR', 'reportes en vivo'];

const TICKER = [
  'Menú digital con QR', 'Pedidos por WhatsApp', 'Realidad aumentada 3D', 'Panel de pedidos en vivo',
  'Métricas de ventas', 'Gestión de mesas', 'Variantes y agregados', 'Cupones de descuento',
  'Seguimiento de pedido', 'Cocina en tiempo real',
];

const PASOS = [
  { num: '01', title: 'Cargá tu menú', desc: 'Subí tus platos con foto, precio, variantes y agregados. Todo desde el panel del dueño.', color: 'var(--ember)' },
  { num: '02', title: 'Pegá el QR en tu local', desc: 'Generá el QR de cada mesa. El cliente lo escanea, elige y personaliza su pedido.', color: 'var(--gold)' },
  { num: '03', title: 'Recibí el pedido por WhatsApp', desc: 'Cada pedido te llega por WhatsApp y a tu panel en vivo. Cambiá el estado con un toque.', color: 'var(--herb)' },
];

const FEATURES = [
  { icon: 'ti-qrcode', tag: 'Menú QR', title: 'Menú digital por mesa', desc: 'Cada mesa tiene su QR. El cliente ve el menú, elige y pide sin descargar nada.', },
  { icon: 'ti-camera', tag: 'Realidad aumentada', title: 'Platos en 3D', desc: 'Los clientes ven el plato en realidad aumentada antes de pedir. Más ventas, menos dudas.', },
  { icon: 'ti-brand-whatsapp', tag: 'WhatsApp', title: 'Pedidos directo a tu WhatsApp', desc: 'El pedido te llega formateado a tu WhatsApp con nombre, teléfono, items y total.', },
  { icon: 'ti-layout-board', tag: 'Panel en vivo', title: 'Pedidos en tiempo real', desc: 'Kanban con estados: nuevo, en preparación, listo y entregado. Todo se actualiza solo.', },
  { icon: 'ti-chart-bar', tag: 'Métricas', title: 'Sabé qué se vende', desc: 'Facturación por día, platos más pedidos, ticket promedio y pedidos por hora.', },
  { icon: 'ti-tags', tag: 'Personalización', title: 'Variantes y agregados', desc: 'Presentaciones (doble/triple), agregados con precio y observaciones por plato.', },
];

const PLANS = [
  {
    id: 'basico', nombre: 'Básico', desc: 'Para arrancar', precioMes: 0, precioAnual: 0,
    badge: null, highlight: false,
    features: ['Menú digital con QR', 'Pedidos por WhatsApp', 'Hasta 30 platos', '1 local'],
  },
  {
    id: 'pro', nombre: 'Pro', desc: 'El más elegido', precioMes: 9990, precioAnual: 7990,
    badge: 'Recomendado', highlight: true,
    features: ['Todo lo de Básico', 'Platos ilimitados', 'Realidad aumentada 3D', 'Panel de pedidos en vivo', 'Métricas de ventas', 'Variantes y agregados'],
  },
  {
    id: 'premium', nombre: 'Premium', desc: 'Para locales grandes', precioMes: 19990, precioAnual: 15990,
    badge: null, highlight: false,
    features: ['Todo lo de Pro', 'Múltiples usuarios', 'Cocina en vivo', 'Cupones de descuento', 'Soporte prioritario'],
  },
];

const FAQS = [
  { q: '¿Necesito instalar algo?', a: 'No. Funciona 100% desde el navegador. Vos cargás el menú y generás los QR en minutos.' },
  { q: '¿Cómo me llegan los pedidos?', a: 'Cada pedido te llega formateado a tu WhatsApp, y también aparece en tu panel de pedidos en tiempo real.' },
  { q: '¿Qué es la realidad aumentada 3D?', a: 'Es la vista del plato en 3D que el cliente puede abrir desde el menú para verlo antes de pedir, como si estuviera en la mesa.' },
  { q: '¿Puedo cambiar de plan?', a: 'Sí, en cualquier momento. Los cambios se aplican al inicio del próximo período, sin cargos ocultos.' },
  { q: '¿Puedo cancelar cuando quiera?', a: 'Por supuesto. Sin contratos ni penalidades. Cancelás cuando quieras.' },
];

const fmt = (n) => n.toLocaleString('es-AR');

export default function LandingPage() {
  const [anual, setAnual] = useState(true);
  const [showRegistro, setShowRegistro] = useState(false);
  const [wordIdx, setWordIdx] = useState(0);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => setWordIdx((i) => (i + 1) % PALABRAS.length), 2600);
    return () => clearInterval(interval);
  }, []);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="landing">

      {/* NAVBAR */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <img src="/pidevo.png" alt="Pidevo" className="landing-nav-logo" />
          <div className="landing-nav-links">
            {[['Funcionalidades', 'funcionalidades'], ['Cómo funciona', 'como-funciona'], ['Precios', 'precios'], ['FAQ', 'faq']].map(([l, id]) => (
              <button key={id} className="landing-nav-link" onClick={() => scrollTo(id)}>{l}</button>
            ))}
          </div>
          <div className="landing-nav-actions">
            <Link to="/login" className="landing-nav-login">Iniciar sesión</Link>
            <Link to="/tuhambur" className="landing-nav-login">Probar demo</Link>
            <button className="landing-nav-cta" onClick={() => setShowRegistro(true)}>
              Empezar gratis
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="landing-hero">
        <div className="landing-hero-inner">
          <div className="landing-hero-copy">
            <div className="landing-badge">
              <span className="landing-badge-dot"></span>
              Sistema de pedidos para gastronómicos
            </div>
            <h1 className="landing-hero-title">
              Tu local con<br />
              <span className="landing-rotating" key={wordIdx}>{PALABRAS[wordIdx]}</span>
            </h1>
            <p className="landing-hero-desc">
              Pidevo transforma tu menú en una experiencia digital: QR en la mesa, platos en 3D y pedidos que llegan directo a tu WhatsApp.
            </p>
            <div className="landing-hero-actions">
              <button className="landing-hero-cta" onClick={() => setShowRegistro(true)}>
                Empezar gratis →
              </button>
              <Link to="/tuhambur" className="landing-hero-demo">Ver demo del menú</Link>
            </div>
            <div className="landing-hero-stats">
              {[['+50', 'Locales activos'], ['2 min', 'Para cargar el menú'], ['24/7', 'Pedidos en vivo']].map(([v, l]) => (
                <div key={l} className="landing-stat">
                  <div className="landing-stat-value">{v}</div>
                  <div className="landing-stat-label">{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="landing-hero-mock">
            <div className="landing-mock-window">
              <div className="landing-mock-bar">
                <span></span><span></span><span></span>
                <div className="landing-mock-url">pidevo.com/menu</div>
              </div>
              <div className="landing-mock-body">
                <div className="landing-mock-item">
                  <div className="landing-mock-thumb"></div>
                  <div>
                    <div className="landing-mock-name">Bunker Cranch Doble</div>
                    <div className="landing-mock-desc">Doble medallón, cheddar, panceta</div>
                    <div className="landing-mock-price">$13.500</div>
                  </div>
                </div>
                <div className="landing-mock-item">
                  <div className="landing-mock-thumb"></div>
                  <div>
                    <div className="landing-mock-name">Papas con cheddar</div>
                    <div className="landing-mock-desc">+ cebolla caramelizada</div>
                    <div className="landing-mock-price">$9.500</div>
                  </div>
                </div>
                <div className="landing-mock-item">
                  <div className="landing-mock-thumb"></div>
                  <div>
                    <div className="landing-mock-name">Napolitana</div>
                    <div className="landing-mock-desc">Muzzarella, jamón, tomate</div>
                    <div className="landing-mock-price">$11.000</div>
                  </div>
                </div>
                <div className="landing-mock-wa">
                  <i className="ti ti-brand-whatsapp"></i>
                  <span>Pedido enviado a tu WhatsApp</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="landing-ticker">
        <div className="landing-ticker-track">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="landing-ticker-item"><i className="ti ti-point"></i> {t}</span>
          ))}
        </div>
      </div>

      {/* CÓMO FUNCIONA */}
      <section id="como-funciona" className="landing-section">
        <div className="landing-section-head">
          <div className="landing-eyebrow">Tres pasos</div>
          <h2>De cero a vender<br />en minutos.</h2>
        </div>
        <div className="landing-pasos">
          {PASOS.map((paso) => (
            <div key={paso.num} className="landing-paso">
              <div className="landing-paso-num" style={{ background: paso.color }}>{paso.num}</div>
              <h3>{paso.title}</h3>
              <p>{paso.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FUNCIONALIDADES */}
      <section id="funcionalidades" className="landing-section landing-section-alt">
        <div className="landing-section-head">
          <div className="landing-eyebrow">Funcionalidades</div>
          <h2>Todo lo que necesitás,<br />en un solo lugar.</h2>
        </div>
        <div className="landing-features">
          {FEATURES.map((f) => (
            <div key={f.title} className="landing-feature">
              <div className="landing-feature-icon"><i className={`ti ${f.icon}`}></i></div>
              <div className="landing-feature-tag">{f.tag}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRECIOS */}
      <section id="precios" className="landing-section">
        <div className="landing-section-head">
          <div className="landing-eyebrow">Precios</div>
          <h2>Planes que tienen sentido.</h2>
          <p className="landing-section-sub">Sin costos ocultos. Cambiás de plan cuando quieras.</p>
        </div>

        <div className="landing-toggle">
          <span className={!anual ? 'active' : ''} onClick={() => setAnual(false)}>Mensual</span>
          <div className={`landing-switch ${anual ? 'on' : ''}`} onClick={() => setAnual(!anual)}></div>
          <span className={anual ? 'active' : ''} onClick={() => setAnual(true)}>Anual</span>
          {anual && <span className="landing-toggle-disc">−20%</span>}
        </div>

        <div className="landing-plans">
          {PLANS.map((plan) => {
            const precio = anual ? plan.precioAnual : plan.precioMes;
            return (
              <div key={plan.id} className={`landing-plan ${plan.highlight ? 'highlight' : ''}`}>
                {plan.badge && <div className="landing-plan-badge">{plan.badge}</div>}
                <div className="landing-plan-desc">{plan.desc}</div>
                <div className="landing-plan-name">{plan.nombre}</div>
                <div className="landing-plan-price">
                  <span className="currency">$</span>
                  <span className="amount">{precio === 0 ? '0' : fmt(precio)}</span>
                </div>
                <div className="landing-plan-per">por mes{anual && precio > 0 ? ` · $${fmt(precio * 12)}/año` : ''}</div>
                <button
                  className="landing-plan-cta"
                  onClick={() => setShowRegistro(true)}
                >
                  Empezar con {plan.nombre} →
                </button>
                <ul className="landing-plan-features">
                  {plan.features.map((f) => (
                    <li key={f}><i className="ti ti-check"></i> {f}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="landing-section landing-section-alt">
        <div className="landing-section-head">
          <div className="landing-eyebrow">FAQ</div>
          <h2>Preguntas frecuentes.</h2>
          <p className="landing-section-sub">¿No encontrás lo que buscás? Escribinos por WhatsApp.</p>
        </div>
        <div className="landing-faqs">
          {FAQS.map((faq, i) => (
            <div key={faq.q} className={`landing-faq ${expanded === i ? 'open' : ''}`}>
              <button className="landing-faq-q" onClick={() => setExpanded(expanded === i ? null : i)}>
                {faq.q}
                <i className="ti ti-chevron-down"></i>
              </button>
              {expanded === i && <div className="landing-faq-a">{faq.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="landing-final">
        <div className="landing-final-inner">
          <div>
            <h2>Tu local, listo para<br />recibir pedidos.</h2>
            <div className="landing-final-points">
              <span><i className="ti ti-check"></i> Sin instalación</span>
              <span><i className="ti ti-check"></i> Empezá gratis</span>
              <span><i className="ti ti-check"></i> Cancelás cuando quieras</span>
            </div>
          </div>
          <button className="landing-final-cta" onClick={() => setShowRegistro(true)}>
            Empezar gratis →
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <img src="/pidevo.png" alt="Pidevo" className="landing-footer-logo" />
          <div className="landing-footer-links">
            {[['Funcionalidades', 'funcionalidades'], ['Precios', 'precios'], ['FAQ', 'faq']].map(([l, id]) => (
              <button key={id} onClick={() => scrollTo(id)}>{l}</button>
            ))}
          </div>
          <div className="landing-footer-copy">
            © {new Date().getFullYear()} Pidevo · Todos los derechos reservados
          </div>
        </div>
      </footer>

      {/* WHATSAPP FLOAT */}
      <a
        href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('¡Hola! Me interesa Pidevo para mi local.')}`}
        target="_blank" rel="noopener noreferrer"
        className="landing-wa-float"
        aria-label="WhatsApp"
      >
        <i className="ti ti-brand-whatsapp"></i>
      </a>

      {showRegistro && <RegistroModal onClose={() => setShowRegistro(false)} />}
    </div>
  );
}
