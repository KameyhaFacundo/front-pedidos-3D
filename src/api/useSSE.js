import { useEffect, useRef } from 'react';

const getBase = () => {
  if (import.meta.env.PROD) {
    const url = import.meta.env.VITE_API_URL || '/api';
    return url.replace('/api', '');
  }
  return (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace('/api', '');
};

export function useSSE(onPedidosUpdate, onMessage) {
  const ref = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const url = `${getBase()}/api/sse?token=${token}`;
    const source = new EventSource(url);

    source.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.pedidos && onPedidosUpdate) {
          onPedidosUpdate(data.pedidos);
        }
        if (onMessage) onMessage();
      } catch {}
    };

    source.onerror = () => {
      source.close();
      setTimeout(() => {
        if (ref.current !== source) return;
        const newSource = new EventSource(url);
        newSource.onmessage = source.onmessage;
        ref.current = newSource;
      }, 5000);
    };

    ref.current = source;

    return () => {
      source.close();
    };
  }, [onPedidosUpdate, onMessage]);
}
