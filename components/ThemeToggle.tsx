'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [tema, setTema] = useState<'claro' | 'oscuro'>('claro');
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    const actual = (document.documentElement.getAttribute('data-theme') as 'claro' | 'oscuro') || 'claro';
    setTema(actual);
    setMontado(true);
  }, []);

  function toggle() {
    const nuevo = tema === 'claro' ? 'oscuro' : 'claro';
    setTema(nuevo);
    document.documentElement.setAttribute('data-theme', nuevo);
    localStorage.setItem('tema', nuevo);
  }

  if (!montado) {
    return <button className="theme-toggle" aria-label="Cambiar tema">🌙</button>;
  }

  return (
    <button className="theme-toggle" onClick={toggle} aria-label="Cambiar tema" title="Cambiar tema">
      {tema === 'claro' ? '🌙' : '☀️'}
    </button>
  );
}
