// components/navbar-actions.tsx
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
      <div className="flex items-center gap-4">
        <Link href="/sign-in">
          <Button variant="ghost" className="text-gray-700 hover:text-black">
            Log In
          </Button>
        </Link>
        <Link href="/sign-up">
          <Button className="bg-primary hover:bg-black/90">
            Start for free
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link href="/dashboard">
        <Button variant="ghost" className="text-gray-700 hover:text-black">
          Dashboard
        </Button>
      </Link>
      <DropdownMenu>
<DropdownMenuTrigger
  nativeButton={false}
  render={
    <Avatar className="cursor-pointer">
      <AvatarFallback className="bg-primary text-white">
        {session.user.name[0].toUpperCase()}
      </AvatarFallback>
    </Avatar>
  }
/>
        <DropdownMenuContent className="w-56">
          <div className="border-b px-3 py-2">
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