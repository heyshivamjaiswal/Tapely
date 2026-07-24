import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';
import SignOutButton from './sign-out-btn';

export default async function NavbarActions() {
  const session = await getSession();

  if (!session?.user) {
    return (
      <div className="flex items-center gap-3">
        <Link href="/sign-in">
          <Button variant="ghost">Log In</Button>
        </Link>
        <Link href="/sign-up">
          <Button>Start for free</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link href="/dashboard">
        <Button variant="ghost">Dashboard</Button>
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger
          nativeButton={false}
          render={
            <Avatar className="cursor-pointer">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {session.user.name[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          }
        />
        <DropdownMenuContent className="w-56">
          <div className="border-b border-border px-3 py-2">
            <p className="font-medium">{session.user.name}</p>
            <p className="text-sm text-muted-foreground">
              {session.user.email}
            </p>
          </div>
          <SignOutButton />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}