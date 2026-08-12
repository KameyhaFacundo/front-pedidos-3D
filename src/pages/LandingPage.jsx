import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RegistroModal from '../components/RegistroModal';

const WHATSAPP = '5493815069332';

const PALABRAS = ['menú digital', 'pedidos por WhatsApp', '3D en la mesa', 'QR por mesa', 'panel de gestión'];

const TICKER = [
  'Menú digital por QR', 'Pedidos en tiempo real', 'Platos en 3D', 'Panel de cocina',
  'Métricas de ventas', 'Gestión de mesas', 'Variantes y agregados', 'Promociones rápidas',
  'Seguimiento digital', 'Sin descargas',
];

const PASOS = [
  { num: '01', title: 'Digitalizá tu carta', desc: 'Subí tus platos, precios, variantes y agregados. Todo se administra desde un panel centralizado.', color: 'var(--ember)' },
  { num: '02', title: 'QR por mesa', desc: 'Generá un código único para cada mesa y dejá que el cliente pida desde su celular.', color: 'var(--gold)' },
  { num: '03', title: 'Atendé pedidos en vivo', desc: 'Recibí pedidos en WhatsApp y en tu panel de cocina, con estados claros y actualizaciones instantáneas.', color: 'var(--herb)' },
];

const FEATURES = [
  { icon: 'ti-qrcode', tag: 'QR inteligente', title: 'Menú digital por mesa', desc: 'Cada mesa tiene su propio QR para pedir sin descargas ni apps.', },
  { icon: 'ti-camera', tag: '3D experience', title: 'Presentación 3D', desc: 'Mostrá tus platos en 3D para que el cliente elija con más confianza.', },
  { icon: 'ti-brand-whatsapp', tag: 'WhatsApp', title: 'Pedidos al instante', desc: 'Recibí cada pedido estructurado en WhatsApp con cliente, items y total.', },
  { icon: 'ti-layout-board', tag: 'Panel operativo', title: 'Cocina y sala sincronizadas', desc: 'Monitoreá pedidos activos, tiempos y estados desde un tablero único.', },
  { icon: 'ti-chart-bar', tag: 'Métricas', title: 'Análisis de ventas', desc: 'Conocé qué platos venden más y cómo mejorar tu facturación.', },
  { icon: 'ti-tags', tag: 'Personalización', title: 'Menú configurable', desc: 'Configurá variantes, agregados y promociones sin límites.', },
  { icon: 'ti-layout-grid', tag: 'Plano profesional', title: 'Distribución de sala', desc: 'Armá tu plano con mesas, barra, cocina y muros para una sala más organizada.', },
];

const SALA_ITEMS = [
  { icon: 'ti-square-rounded-check', title: 'Mesas con QR', text: 'Cada mesa se transforma en una estación de pedido con QR único y estados claros para el equipo.', },
  { icon: 'ti-layout-grid', title: 'Muros y sectores', text: 'Añadí barreras y zonas de paso para reflejar el verdadero flujo de tu salón.', },
  { icon: 'ti-chef-hat', title: 'Cocina sincronizada', text: 'La cocina recibe los pedidos del salón en vivo para reducir tiempos y errores.', },
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
            <button className="landing-nav-cta" onClick={() => setShowRegistro(true)}>
              Solicitar demo
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
              Sistema de pedidos para restaurantes
            </div>
            <h1 className="landing-hero-title">
              El sistema de pedidos para<br />
              restaurantes modernos.
            </h1>
            <p className="landing-hero-desc">
              Digitalizá tu sala con <span className="landing-rotating">{PALABRAS[wordIdx]}</span>, QR por mesa, panel de cocina en vivo y pedidos que llegan directo a WhatsApp. Todo sin apps ni procesos complicados.
            </p>
            <div className="landing-hero-actions">
              <button className="landing-hero-cta" onClick={() => setShowRegistro(true)}>
                Solicitar demo →
              </button>
            </div>
            <div className="landing-hero-stats">
              {[['+70', 'Locales activos'], ['5 min', 'para empezar'], ['24/7', 'Pedidos en vivo']].map(([v, l]) => (
                <div key={l} className="landing-stat">
                  <div className="landing-stat-value">{v}</div>
                  <div className="landing-stat-label">{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="landing-hero-mock" aria-hidden="true">
            <div className="landing-mock-window" role="presentation">
              <div className="landing-mock-bar">
                <span></span><span></span><span></span>
                <div className="landing-mock-url">app.pidevo.com/menu</div>
              </div>
              <div className="landing-mock-body">
                <div className="landing-mock-item">
                  <img src="/hamburguesa.png" alt="Hamburguesa" className="landing-mock-thumb" />
                  <div>
                    <div className="landing-mock-name">Bunker Cranch Doble</div>
                    <div className="landing-mock-desc">Doble medallón, cheddar, panceta</div>
                    <div className="landing-mock-price">$13.500</div>
                  </div>
                </div>
                <div className="landing-mock-item">
                  <img src="/hamburguesa con papas.png" alt="Hamburguesa con papas" className="landing-mock-thumb" />
                  <div>
                    <div className="landing-mock-name">Papas con cheddar</div>
                    <div className="landing-mock-desc">+ cebolla caramelizada</div>
                    <div className="landing-mock-price">$9.500</div>
                  </div>
                </div>
                <div className="landing-mock-item">
                  <img src="/napolitana.png" alt="Napolitana" className="landing-mock-thumb" />
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

      <section className="landing-section landing-section-sala">
        <div className="landing-section-head">
          <div className="landing-eyebrow">Plano de sala</div>
          <h2>Diseñá el salón como lo piensa tu equipo.</h2>
          <p className="landing-section-sub">Armá mesas, barra, cocina y muros en un plano profesional que refleja tu sala real y mejora la gestión.</p>
        </div>
        <div className="landing-sala-grid">
          {SALA_ITEMS.map((item) => (
            <div key={item.title} className="landing-sala-card">
              <div className="landing-sala-card-icon"><i className={`ti ${item.icon}`}></i></div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
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
              <span><i className="ti ti-check"></i> Sin instalación ni descargas</span>
              <span><i className="ti ti-check"></i> Configurás tu menú en minutos</span>
              <span><i className="ti ti-check"></i> Sin contratos, sin costos ocultos</span>
            </div>
          </div>
          <button className="landing-final-cta" onClick={() => setShowRegistro(true)}>
            Solicitar demo →
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
