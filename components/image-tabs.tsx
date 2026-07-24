'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useState } from 'react';

const TABS = [
  { id: 'organize', label: 'Organize Applications' },
  { id: 'hired', label: 'Get Hired' },
  { id: 'boards', label: 'Manage Boards' },
];

export default function ImageTabs() {
  const [activeTab, setActiveTab] = useState('organize');

  return (
    <section className="border-t border-border py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex justify-center gap-1 rounded-full border border-border bg-muted/50 p-1 w-fit mx-auto">
            {TABS.map((tab) => (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                variant="ghost"
                className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-sm hover:bg-primary hover:text-primary-foreground'
                    : 'text-muted-foreground hover:bg-transparent hover:text-foreground'
                }`}
              >
                {tab.label}
              </Button>
            ))}
          </div>

          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-xl border border-border shadow-2xl">
            {activeTab === 'organize' && (
              <Image
                src="/hero-images/hero1.png"
                alt="Organize Applications"
                width={1200}
                height={800}
              />
            )}

            {activeTab === 'hired' && (
              <Image
                src="/hero-images/hero2.png"
                alt="Get Hired"
                width={1200}
                height={800}
              />
            )}

            {activeTab === 'boards' && (
              <Image
                src="/hero-images/hero3.png"
                alt="Manage Boards"
                width={1200}
                height={800}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}