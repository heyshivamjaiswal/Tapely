
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

export default function SignIn() {
  const [formData, setFormData] = useState({ email: '', password: '' });
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
      const response = await authClient.signIn.email(formData);
      if (response.error) {
        setError(response.error.message ?? 'Failed to sign in');
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
      eyebrow="Welcome back"
      title="Sign in"
      description="Enter your credentials to access your board."
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link className="font-medium text-primary hover:underline" href="/sign-up">
            Sign Up
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
          <Label htmlFor="email" className="text-xs font-mono uppercase tracking-wide text-muted-foreground">
            Email
          </Label>
          <Input id="email" name="email" value={formData.email} onChange={handleChange} type="email" placeholder="example@gmail.com" required className="h-11" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-xs font-mono uppercase tracking-wide text-muted-foreground">
            Password
          </Label>
          <Input id="password" name="password" value={formData.password} onChange={handleChange} type="password" placeholder="Your password" required className="h-11" />
        </div>
        <Button className="w-full h-11 mt-2" type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
    </AuthShell>
  );
}