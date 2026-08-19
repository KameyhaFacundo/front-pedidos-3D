import { useEffect, useRef } from 'react';

const getBase = () => {
  if (import.meta.env.PROD) {
    const url = import.meta.env.VITE_API_URL || '/api';
    return url.replace('/api', '');
  }
  return (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace('/api', '');
};

export function useSSE(onPedidosUpdate, onMessage, onReconnect) {
  const ref = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const url = `${getBase()}/api/sse?token=${token}`;

    const connect = () => {
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
        if (onReconnect) onReconnect();
        setTimeout(() => {
          if (ref.current !== source) return;
          connect();
        }, 5000);
      };

      ref.current = source;
      return source;
    };

    const source = connect();

    return () => {
      source.close();
    };
  }, [onPedidosUpdate, onMessage, onReconnect]);
}
