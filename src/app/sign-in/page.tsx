'use client';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Auth } from '@supabase/auth-ui-react';
import { supabaseClient } from '../../lib/supabase-client';

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Auth
        appearance={{ theme: ThemeSupa }}
        providers={['google']}
        supabaseClient={supabaseClient}
        redirectTo={window.location.origin}
      />
    </div>
  );
}
