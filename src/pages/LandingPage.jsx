import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

// PLACEHOLDER — reemplazar por reseñas reales de locales que ya usan Pidevo
// antes de publicar. Prueba social falsa no se sube a producción.
const TESTIMONIOS = [
  { texto: 'Bajaron los tiempos de toma de pedido y los errores de la cocina casi desaparecieron. El QR por mesa se pagó solo en la primera semana.', nombre: 'Nombre del dueño/a', local: 'Nombre del local · Rubro', rating: 5 },
  { texto: 'La vista en 3D cambia la decisión del cliente en el momento: pide más seguro y prueba platos nuevos que antes no elegía.', nombre: 'Nombre del dueño/a', local: 'Nombre del local · Rubro', rating: 5 },
  { texto: 'Lo configuré en una tarde sin ayuda de nadie. Los pedidos llegan directo a mi WhatsApp, no tuve que aprender ningún sistema nuevo.', nombre: 'Nombre del dueño/a', local: 'Nombre del local · Rubro', rating: 5 },
];

// true -> check (bueno), false -> cruz (malo), string -> texto tal cual.
// Filas redactadas en positivo para que true siempre signifique "bien".
const COMPARACION = {
  columnas: ['Pidevo', 'Apps de delivery con comisión', 'A mano (papel + WhatsApp)'],
  filas: [
    { label: 'Sin comisión por venta', valores: [true, false, true] },
    { label: 'Tus datos de clientes, tuyos', valores: [true, false, 'Sueltos, sin organizar'] },
    { label: 'Menú con fotos y 3D', valores: [true, false, false] },
    { label: 'Pedidos en un panel en vivo', valores: [true, 'Panel del app', false] },
    { label: 'Tu marca, no la del listado', valores: [true, false, true] },
    { label: 'Empezar a usarlo', valores: ['Minutos', 'Días de alta', 'Ya lo tenés, desordenado'] },
  ],
};

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

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Anima "+70" / "5 min" / "24/7" contando el tramo numérico y conservando
// el prefijo/sufijo tal cual (así no hay que separar el dato en piezas).
function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(prefersReducedMotion() ? target : 0);

  useEffect(() => {
    if (prefersReducedMotion()) { setValue(target); return; }
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}

function AnimatedStat({ value, label }) {
  const match = value.match(/^(\D*)(\d+)(.*)$/);
  const count = useCountUp(match ? parseInt(match[2], 10) : 0);
  const display = match ? `${match[1]}${count}${match[3]}` : value;
  return (
    <div className="landing-stat">
      <div className="landing-stat-value">{display}</div>
      <div className="landing-stat-label">{label}</div>
    </div>
  );
}

// Hace fade+slide-in a cualquier .reveal dentro de .landing cuando entra en
// viewport. Respeta prefers-reduced-motion mostrando todo ya visible.
function useScrollReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('.landing .reveal'));
    if (!('IntersectionObserver' in window) || prefersReducedMotion()) {
      els.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '200px 0px 0px 0px' });
    els.forEach((el) => io.observe(el));

    // Red de seguridad: un scroll muy rápido (flick de trackpad, "Fin") puede
    // mover un elemento fuera del viewport entre dos frames del observer sin
    // que llegue a reportar intersección, y queda con opacity:0 para siempre.
    // Si eso pasa, lo revelamos igual apenas detectamos que ya quedó arriba.
    let ticking = false;
    const sweep = () => {
      ticking = false;
      els.forEach((el) => {
        if (!el.classList.contains('is-visible') && el.getBoundingClientRect().bottom < 0) {
          el.classList.add('is-visible');
          io.unobserve(el);
        }
      });
    };
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(sweep); }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);
}

export default function LandingPage() {
  const [anual, setAnual] = useState(true);
  const [showRegistro, setShowRegistro] = useState(false);
  const [wordIdx, setWordIdx] = useState(0);
  const [expanded, setExpanded] = useState(null);
  const navigate = useNavigate();
  const heroPhotoRef = useRef(null);

  // Parallax sutil: la foto se mueve un poco más lento que el scroll,
  // solo en desktop (en mobile la imagen no tiene el margen extra para
  // esto y el efecto se nota menos en pantallas chicas de todas formas).
  useEffect(() => {
    const img = heroPhotoRef.current;
    if (!img || prefersReducedMotion() || window.innerWidth < 900) return;
    let ticking = false;
    const update = () => {
      ticking = false;
      const offset = Math.max(-28, Math.min(28, window.scrollY * 0.12));
      img.style.transform = `translateY(${offset}px)`;
    };
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // App.jsx muestra /demo/* como modal automáticamente en cuanto detecta
  // que había una página previa -- no hace falta pasar estado acá.
  const openDemo = () => navigate('/demo');

  useEffect(() => {
    const interval = setInterval(() => setWordIdx((i) => (i + 1) % PALABRAS.length), 2600);
    return () => clearInterval(interval);
  }, []);

  useScrollReveal();

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
              El sistema de pedidos para restaurantes <em>modernos</em>.
            </h1>
            <p className="landing-hero-desc">
              Digitalizá tu sala con <span className="landing-rotating">{PALABRAS[wordIdx]}</span>, QR por mesa, panel de cocina en vivo y pedidos que llegan directo a WhatsApp. Todo sin apps ni procesos complicados.
            </p>
            <div className="landing-hero-actions">
              <button className="landing-hero-cta" onClick={() => setShowRegistro(true)}>
                Solicitar demo →
              </button>
              <button type="button" className="landing-hero-demo" onClick={openDemo}>
                Probar demo interactiva
              </button>
            </div>
            <div className="landing-hero-risk">
              <i className="ti ti-shield-check"></i> Sin tarjeta · Configurás en minutos · Cancelás cuando quieras
            </div>
            <div className="landing-hero-stats">
              {[['+70', 'Locales activos'], ['5 min', 'para empezar'], ['24/7', 'Pedidos en vivo']].map(([v, l]) => (
                <AnimatedStat key={l} value={v} label={l} />
              ))}
            </div>
          </div>

          <div className="landing-hero-visual">
            <figure className="landing-hero-photo">
              <img ref={heroPhotoRef} src="/hamburguesa.png" alt="Bunker Cranch Doble, uno de los platos servidos con Pidevo" />
              <button type="button" className="landing-hero-photo-badge" onClick={openDemo}>
                <i className="ti ti-rotate-3d"></i> Ver en 3D
              </button>
              <figcaption>Bunker Cranch Doble — servido con Pidevo</figcaption>
            </figure>

            <div className="landing-hero-ticket" aria-hidden="true">
              <div className="landing-hero-ticket-head">
                <i className="ti ti-brand-whatsapp"></i> Pedido enviado
              </div>
              <div className="landing-hero-ticket-row"><span>1×</span> Bunker Cranch Doble</div>
              <div className="landing-hero-ticket-row"><span>1×</span> Papas con cheddar</div>
              <div className="landing-hero-ticket-total">Mesa 4 · $23.000</div>
            </div>

            <div className="landing-hero-float">
              <div className="landing-hero-float-icon"><i className="ti ti-bolt"></i></div>
              <div>
                <div className="landing-hero-float-title">Nuevo pedido · Mesa 4</div>
                <div className="landing-hero-float-sub">hace 8 segundos</div>
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
      <section id="como-funciona" className="landing-section reveal">
        <div className="landing-section-head">
          <div className="landing-eyebrow">Tres pasos</div>
          <h2>De cero a vender<br />en minutos.</h2>
        </div>
        <div className="landing-pasos">
          {PASOS.map((paso) => (
            <div key={paso.num} className="landing-paso">
              <div className="landing-paso-num" style={{ color: paso.color }}>{paso.num}</div>
              <div className="landing-paso-body">
                <h3>{paso.title}</h3>
                <p>{paso.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FUNCIONALIDADES */}
      <section id="funcionalidades" className="landing-section landing-section-alt reveal">
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

      <section className="landing-section landing-section-sala reveal">
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

      {/* TESTIMONIOS */}
      <section className="landing-section landing-section-alt reveal">
        <div className="landing-section-head">
          <div className="landing-eyebrow">Locales que ya lo usan</div>
          <h2>No lo decimos <em>nosotros</em>.</h2>
        </div>
        <div className="landing-testimonios">
          {TESTIMONIOS.map((t, i) => (
            <div key={i} className={`landing-testimonio${i % 2 === 1 ? ' is-alt' : ''}`}>
              <i className="ti ti-quote landing-testimonio-mark"></i>
              <p className="landing-testimonio-texto">{t.texto}</p>
              <div className="landing-testimonio-autor">
                <div className="landing-testimonio-avatar">{t.nombre.charAt(0)}</div>
                <div className="landing-testimonio-quien">
                  <div className="landing-testimonio-nombre">{t.nombre}</div>
                  <div className="landing-testimonio-local">{t.local}</div>
                </div>
                <div className="landing-testimonio-stars">
                  {Array.from({ length: t.rating }).map((_, s) => <i key={s} className="ti ti-star"></i>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* COMPARACIÓN */}
      <section className="landing-section reveal">
        <div className="landing-section-head">
          <div className="landing-eyebrow">La diferencia</div>
          <h2>Lo mismo de siempre, <em>pero mejor</em>.</h2>
        </div>
        <div className="landing-compare-scroll">
          <table className="landing-compare">
            <thead>
              <tr>
                <th></th>
                {COMPARACION.columnas.map((col, i) => (
                  <th key={col} className={i === 0 ? 'is-pidevo' : ''}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARACION.filas.map((fila) => (
                <tr key={fila.label}>
                  <th>{fila.label}</th>
                  {fila.valores.map((v, i) => (
                    <td key={i} className={i === 0 ? 'is-pidevo' : ''}>
                      {v === true ? <i className="ti ti-check landing-compare-yes"></i>
                        : v === false ? <i className="ti ti-x landing-compare-no"></i>
                        : v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* PRECIOS */}
      <section id="precios" className="landing-section reveal">
        <div className="landing-section-head">
          <div className="landing-eyebrow">Precios</div>
          <h2>Planes que tienen <em>sentido</em>.</h2>
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
      <section id="faq" className="landing-section landing-section-alt reveal">
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
      <section className="landing-final reveal">
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
