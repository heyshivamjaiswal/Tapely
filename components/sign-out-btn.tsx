'use client';

import { authClient } from '@/lib/auth-client';
import { DropdownMenuItem } from './ui/dropdown-menu';
import { useRouter } from 'next/navigation';

export default function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const { error } = await authClient.signOut();

    if (!error) {
      router.replace('/sign-in');
      router.refresh();
    }
  }

  return (
    <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
      Log Out
    </DropdownMenuItem>
  );
}
