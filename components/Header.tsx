'use client';

import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle from './ThemeToggle';
import ListaPedido from './ListaPedido';

export default function Header({ q = '' }: { q?: string }) {
  return (
    <header className="header-cat">
      <div className="wrap">
        <Link href="/" className="brand" aria-label="Logbelts — inicio">
          <Image
            src="/logo-logbelts.png"
            alt="Logbelts"
            width={140}
            height={40}
            priority
          />
        </Link>

        <form className="search" action="/buscar" method="get" role="search">
          <input
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Buscar por código, marca o modelo..."
            aria-label="Buscar productos"
          />
          <button type="submit" aria-label="Buscar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </button>
        </form>

        <ThemeToggle />
        <Link href="/manuales" className="hlink">Manuales</Link>
        <ListaPedido />
      </div>
    </header>
  );
}
