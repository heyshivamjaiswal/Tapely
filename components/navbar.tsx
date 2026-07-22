// components/navbar.tsx
import { Briefcase } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import NavbarActions from './navbar-actions';

export default function Navbar() {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="container mx-auto flex h-16 items-center px-4 justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-semibold text-primary"
        >
          <Briefcase />
          Job Tracker
        </Link>
        <Suspense fallback={<div className="h-9 w-40" />}>
          <NavbarActions />
        </Suspense>
      </div>
    </nav>
  );
}