import { Link } from 'react-router-dom';
import { LogIn, LogOut } from 'lucide-react';
import { supabaseClient } from '../../lib/supabase-client-';
import { useSession } from '@supabase/auth-helpers-react';
import { ReaderNavigationMenu } from './reader';
import { MenuIconWrapper } from './shared';
import { WithTooltip } from '../with-tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';

const SignOut = () => {
  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger>
          <WithTooltip content={<p>Sign out</p>}>
            <MenuIconWrapper>
              <button>
                <LogOut />
              </button>
            </MenuIconWrapper>
          </WithTooltip>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to sign out?</AlertDialogTitle>
            <AlertDialogDescription>
              You can still use the reader without being signed out, but you won't be able to save your progress.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => supabaseClient.auth.signOut()}>Sign out</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

const SignIn = () => {
  return (
    <WithTooltip content={<p>Sign in</p>}>
      <MenuIconWrapper>
        <Link to='/sign-in'>
          <LogIn />
        </Link>
      </MenuIconWrapper>
    </WithTooltip>
  );
};

export const Menu = () => {
  const session = useSession();

  return (
    <div className='flex items-center justify-center gap-4 h-[50px]'>
      {session ? <SignOut /> : <SignIn />}
      <ReaderNavigationMenu />
    </div>
  );
};
