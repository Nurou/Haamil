import { Link } from 'react-router-dom';
import { LogIn, LogOut } from 'lucide-react';
import { supabaseClient } from '../../lib/supabase-client-';
import { useSession } from '@supabase/auth-helpers-react';
import { ReaderNavigationMenu } from './reader';
import { MenuIconWrapper } from './shared';
import { WithTooltip } from '../with-tooltip';

const SignOut = () => {
  return (
    <WithTooltip content={<p>Sign out</p>}>
      <MenuIconWrapper>
        <button onClick={() => supabaseClient.auth.signOut()}>
          <LogOut />
        </button>
      </MenuIconWrapper>
    </WithTooltip>
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
