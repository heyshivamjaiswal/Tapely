import { Briefcase } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import NavbarActions from './navbar-actions';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground"
        >
          <Briefcase className="h-5 w-5 text-primary" />
          Job Tracker
        </Link>
        <Suspense fallback={<div className="h-9 w-40" />}>
          <NavbarActions />
        </Suspense>
      </div>
    </nav>
  );
}