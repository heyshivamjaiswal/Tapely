
import { Briefcase } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import NavbarActions from './navbar-actions';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          href="/"
          className="group flex items-center gap-2.5 font-heading text-lg font-semibold text-foreground"
        >
          <span className="relative flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 transition-colors group-hover:bg-primary/15">
            <Briefcase className="h-4 w-4 text-primary" />
            <span
              className="absolute -right-1 -top-1.5 h-2.5 w-4 rounded-[1px] bg-tape-amber/90"
              style={{ transform: 'rotate(8deg)' }}
              aria-hidden="true"
            />
          </span>
          Job Tracker
        </Link>
        <Suspense fallback={<div className="h-9 w-40" />}>
          <NavbarActions />
        </Suspense>
      </div>
    </nav>
  );
}