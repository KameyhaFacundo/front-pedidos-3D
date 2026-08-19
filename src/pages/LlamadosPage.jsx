import { useState, useEffect, useCallback, useRef } from 'react';
import { getLlamados, atenderLlamado } from '../api/client';
import { useSSE } from '../api/useSSE';
import { playNewOrderSound, soundEnabled } from '../components/adminUtils';

export default function LlamadosPage() {
  const [llamados, setLlamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attending, setAttending] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const seenIdsRef = useRef(new Set());
  const primeraCargaRef = useRef(true);

  const fetchLlamados = useCallback(() => {
    getLlamados()
      .then((data) => {
        if (primeraCargaRef.current) {
          primeraCargaRef.current = false;
          data.forEach((l) => seenIdsRef.current.add(l.id));
        } else {
          const nuevas = data.filter((l) => !seenIdsRef.current.has(l.id));
          nuevas.forEach((l) => seenIdsRef.current.add(l.id));
          if (nuevas.length > 0 && soundEnabled()) playNewOrderSound();
        }
        setLlamados(data);
        setLoading(false);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchLlamados();
  }, [fetchLlamados]);

  useSSE(null, fetchLlamados);

  const baseTitle = 'Pidevo Llamados';
  useEffect(() => {
    document.title = llamados.length > 0 ? `(${llamados.length}) ${baseTitle}` : baseTitle;
  }, [llamados]);

  const handleAtender = async (llamadoId, mesaNumero) => {
    setAttending(llamadoId);
    try {
      await atenderLlamado(llamadoId);
      setSuccessMsg(`Mesa ${mesaNumero} atendida correctamente`);
      await fetchLlamados();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setAttending(null);
    }
  };

  if (loading) {
    return (
      <div className="page-center">
        <div className="spinner" />
        <p>Cargando llamados...</p>
      </div>
    );
  }

  return (
    <div className="llamados-page">
      <header className="cocina-header llamados-header">
        <h1>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
          </svg>
          Llamados
        </h1>
      </header>

      {error && (
        <div className="alert alert-error">
          <p>{error}</p>
          <button onClick={() => setError(null)}>&times;</button>
        </div>
      )}

      {successMsg && (
        <div className="alert alert-success">
          <p>{successMsg}</p>
        </div>
      )}

      {llamados.length === 0 ? (
        <div className="page-center">
          <p>No hay llamados pendientes.</p>
        </div>
      ) : (
        <div className="mesas-grid">
          {llamados.map((llamado) => (
            <div key={llamado.id} className="mesa-card activa-card">
              <div className="mesa-card-header">
                <span className="mesa-numero">
                  Mesa {llamado.mesa?.numero ?? llamado.mesa_id}
                </span>
                <span className="mesa-estado activa">
                  Solicitando atención
                </span>
              </div>
              <button
                className="btn btn-primary btn-block"
                onClick={() => handleAtender(llamado.id, llamado.mesa?.numero ?? llamado.mesa_id)}
                disabled={attending === llamado.id}
              >
                {attending === llamado.id ? 'Atendiendo...' : 'Marcar como atendido'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
