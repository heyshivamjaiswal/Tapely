import { Button } from '@/components/ui/button';
import { AmbientBackground } from '@/components/ambient-background';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const TAPE_CARDS = [
  {
    company: 'Stripe',
    role: 'Frontend Engineer',
    tape: 'bg-tape-cyan',
    rotate: 'tape-float-a -rotate-3',
  },
  {
    company: 'Notion',
    role: 'Product Designer',
    tape: 'bg-tape-violet',
    rotate: 'tape-float-b rotate-2',
  },
  {
    company: 'Vercel',
    role: 'Full-stack Developer',
    tape: 'bg-tape-emerald',
    rotate: 'tape-float-c -rotate-1',
  },
];

const STAGES = [
  {
    label: 'Save it',
    tape: 'bg-tape-cyan',
    body: 'Bookmark a role the moment you find it, before it disappears into fifteen open tabs.',
  },
  {
    label: 'Track it',
    tape: 'bg-tape-amber',
    body: "Every stage — applied, interviewing, waiting to hear back — lives on one board, so you don't have to hold it in your head.",
  },
  {
    label: 'Land it',
    tape: 'bg-tape-emerald',
    body: 'See the whole pipeline at a glance and know exactly which conversations need a follow-up.',
  },
];

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
            <AmbientBackground />

      <main className="relative z-10 flex-1">
        <section className="container mx-auto px-4 pt-24 pb-20 md:pt-32">
          <div className="grid gap-16 md:grid-cols-2 md:items-center">
            <div>
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                For the actively job hunting
              </p>
              <h1 className="mb-6 text-5xl font-semibold leading-[1.05] md:text-6xl">
                Your job search,
                <br />
                actually organized.
              </h1>
              <p className="mb-10 max-w-md text-lg text-muted-foreground">
                Track saved roles, active applications, and interviews on one
                board — instead of six browser tabs and a spreadsheet you stopped
                updating two weeks ago.
              </p>
              <div className="flex flex-col items-start gap-3">
                <Link href="/sign-up">
                  <Button size="lg" className="h-12 px-8 text-base font-medium">
                    Start tracking <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <p className="text-sm text-muted-foreground">
                  Free. No credit card required.
                </p>
              </div>
            </div>

            <div className="relative hidden h-[380px] md:block" aria-hidden="true">
              {TAPE_CARDS.map((card, i) => (
                <div
                  key={card.company}
                  className={`absolute w-56 rounded-lg border border-border bg-card p-4 shadow-lg ${card.rotate}`}
                  style={{
                    top: `${i * 90}px`,
                    left: `${i * 60}px`,
                  }}
                >
                  <div className={`mb-3 h-1.5 w-10 rounded-full ${card.tape}`} />
                  <p className="font-heading text-sm font-semibold">
                    {card.role}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {card.company}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border py-24">
          <div className="container mx-auto px-4">
            <div className="mb-14 max-w-lg">
              <h2 className="mb-3 text-3xl font-semibold">
                Three moments, one board
              </h2>
              <p className="text-muted-foreground">
                A job hunt isn't a to-do list — it's a pipeline. Here's how it
                moves.
              </p>
            </div>

            <div className="grid gap-10 md:grid-cols-3">
              {STAGES.map((stage) => (
                <div key={stage.label}>
                  <div className={`mb-4 h-1.5 w-12 rounded-full ${stage.tape}`} />
                  <h3 className="mb-2 text-xl font-semibold">{stage.label}</h3>
                  <p className="text-muted-foreground">{stage.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-3xl font-semibold">
              Stop losing track of where you applied.
            </h2>
            <Link href="/sign-up">
              <Button size="lg" className="h-12 px-8 text-base font-medium">
                Start tracking <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}