import Link from 'next/link';
import { Suspense } from 'react';
import { Logo } from './logo';
import NavbarActions from './navbar-actions';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          href="/"
          className="group flex items-center gap-2.5 font-heading text-lg font-semibold text-foreground"
        >
          <Logo className="h-8 w-8 transition-transform group-hover:scale-105" />
          Tapely
        </Link>
        <Suspense fallback={<div className="h-9 w-40" />}>
          <NavbarActions />
        </Suspense>
      </div>
    </nav>
  );
}