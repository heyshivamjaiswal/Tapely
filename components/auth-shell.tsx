
'use client';

import Link from 'next/link';
import { AmbientBackground } from '@/components/ambient-background';
import { Logo } from './logo';

const PREVIEW_CARDS = [
  { company: 'Vercel', role: 'Frontend Engineer', tape: 'bg-tape-emerald', status: 'Interviewing' },
  { company: 'Linear', role: 'Product Engineer', tape: 'bg-tape-violet', status: 'Applied' },
  { company: 'Stripe', role: 'Platform Engineer', tape: 'bg-tape-amber', status: 'Offer' },
];

function Seam() {
  return (
    <div className="relative hidden w-6 shrink-0 lg:block bg-[#F2F1EC]">
      <div
        className="absolute left-1/2 top-6 bottom-6 w-px -translate-x-1/2 border-l border-dashed border-[#C7C4B6]"
        aria-hidden="true"
      />
      <div
        className="absolute -top-3 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full bg-[#15131F]"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-3 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full bg-[#15131F]"
        aria-hidden="true"
      />
    </div>
  );
}

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F2F1EC]">
      {/* Form panel — left, the only part that scrolls */}
      <div className="relative flex-1 h-full">
        <AmbientBackground variant="light" intensity="subtle" />

        <div className="relative h-full overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-6 sm:p-10">
            <div className="relative w-full max-w-[400px]">
              <div
                className="absolute -top-3 left-8 h-6 w-16 bg-tape-violet/90 rounded-[2px] shadow-sm z-10"
                style={{ transform: 'rotate(-4deg)' }}
                aria-hidden="true"
              />
              <div className="relative bg-white border border-border rounded-2xl shadow-xl px-8 py-9 sm:px-9 sm:py-10">
                <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase mb-3">
                  {eyebrow}
                </p>
                <h1 className="text-[26px] font-semibold tracking-tight text-foreground">
                  {title}
                </h1>
                <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>

                <div className="mt-7">{children}</div>

                <div className="mt-6 pt-6 border-t border-border">{footer}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Seam />

      {/* Brand panel — right, fixed, never scrolls */}
      <div className="hidden h-full lg:flex lg:w-[44%] relative flex-col justify-between bg-[#15131F] text-white p-12 overflow-hidden">
        <AmbientBackground variant="dark" />

      <Link href="/" className="relative flex items-center gap-2 text-sm font-medium">
       <Logo className="h-5 w-5" />
           Tapely
      </Link>

        <div className="relative space-y-10">
          <div className="space-y-3 max-w-sm">
            <p className="font-mono text-[11px] tracking-[0.18em] text-white/40 uppercase">
              Application tracking, sorted
            </p>
            <h2 className="text-3xl font-semibold leading-tight tracking-tight">
              Every application,
              <br />
              one board.
            </h2>
          </div>

          <div className="space-y-3 max-w-xs">
            {PREVIEW_CARDS.map((c, i) => (
              <div
                key={c.company}
                className="relative bg-[#1D1A29] border border-white/10 rounded-lg px-4 py-3 shadow-lg"
                style={{ transform: `rotate(${i % 2 === 0 ? '-0.6deg' : '0.5deg'})` }}
              >
                <span
                  className={`absolute -top-2 left-5 h-4 w-10 ${c.tape} rounded-[2px] opacity-90`}
                  style={{ transform: 'rotate(-3deg)' }}
                  aria-hidden="true"
                />
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{c.role}</p>
                    <p className="text-xs text-white/45 truncate">{c.company}</p>
                  </div>
                  <span className="shrink-0 font-mono text-[10px] tracking-wide text-white/50 uppercase">
                    {c.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

     <p className="relative font-mono text-[11px] text-white/30">
       © {new Date().getFullYear()} Tapely
    </p>
      </div>
    </div>
  );
}