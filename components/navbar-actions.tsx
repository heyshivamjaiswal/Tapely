
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
      <div className="flex items-center gap-2">
        <Link href="/sign-in">
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
            Log In
          </Button>
        </Link>
        <Link href="/sign-up">
          <Button className="shadow-sm">Start for free</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/dashboard">
        <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
          Dashboard
        </Button>
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger
          nativeButton={false}
          render={
            <Avatar className="h-9 w-9 cursor-pointer ring-1 ring-border ring-offset-2 ring-offset-background transition-shadow hover:ring-primary/40">
              <AvatarFallback className="bg-primary font-medium text-primary-foreground">
                {session.user.name[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          }
        />
        <DropdownMenuContent className="w-56 overflow-hidden p-0">
          <div className="border-b border-border bg-muted/40 px-4 py-3">
            <p className="truncate text-sm font-medium">{session.user.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {session.user.email}
            </p>
          </div>
          <div className="p-1">
            <SignOutButton />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}