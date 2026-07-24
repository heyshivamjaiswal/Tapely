
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authClient } from '@/lib/auth-client';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AuthShell } from '@/components/auth-shell';

export default function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await authClient.signUp.email(formData);
      if (response.error) {
        setError(response.error.message ?? 'Failed to sign up');
        return;
      }
      router.replace('/dashboard');
      router.refresh();
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="New account"
      title="Create your account"
      description="Start tracking every application in one place."
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link className="font-medium text-primary hover:underline" href="/sign-in">
            Sign In
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-md bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
            {error}
          </div>
        )}
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-xs font-mono uppercase tracking-wide text-muted-foreground">
            Name
          </Label>
          <Input id="name" name="name" type="text" placeholder="Enter your name" value={formData.name} onChange={handleChange} required className="h-11" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-mono uppercase tracking-wide text-muted-foreground">
            Email
          </Label>
          <Input id="email" name="email" type="email" placeholder="example@gmail.com" required value={formData.email} onChange={handleChange} className="h-11" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-xs font-mono uppercase tracking-wide text-muted-foreground">
            Password
          </Label>
          <Input id="password" name="password" type="password" placeholder="At least 6 characters" required value={formData.password} minLength={6} onChange={handleChange} className="h-11" />
        </div>
        <Button className="w-full h-11 mt-2" type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? 'Creating account...' : 'Sign up'}
        </Button>
      </form>
    </AuthShell>
  );
}