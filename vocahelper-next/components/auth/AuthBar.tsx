"use client";
import * as React from 'react';
import { getSupabase } from '@/lib/supabase';

export function AuthBar() {
  const sb = getSupabase();
  const [email, setEmail] = React.useState('');
  const [userEmail, setUserEmail] = React.useState<string | null>(null);
  const [sending, setSending] = React.useState(false);

  React.useEffect(() => {
    if (!sb) return;
    sb.auth.getUser().then(({ data }) => setUserEmail(data.user?.email ?? null));
    const { data: sub } = sb.auth.onAuthStateChange((_e, session) => {
      setUserEmail(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, [sb]);

  if (!sb) return null;

  return (
    <div className="ml-2 flex items-center gap-2">
      {userEmail ? (
        <>
          <span className="hidden sm:inline text-xs text-slate-600">{userEmail}</span>
          <button
            className="focus-ring rounded-md border border-slate-300 px-2 py-1 text-xs"
            onClick={() => sb.auth.signOut()}
          >
            Sign out
          </button>
        </>
      ) : (
        <form
          className="flex items-center gap-2"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!email) return;
            setSending(true);
            await sb.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } });
            setSending(false);
            setEmail('');
            alert('Check your email for the magic link.');
          }}
        >
          <label htmlFor="auth-email" className="sr-only">Email</label>
          <input
            id="auth-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-40 rounded-md border border-slate-300 px-2 py-1 text-xs focus-ring"
          />
          <button className="focus-ring rounded-md bg-brand px-2 py-1 text-xs font-semibold text-white" disabled={sending}>
            {sending ? 'Sending…' : 'Sign in'}
          </button>
        </form>
      )}
    </div>
  );
}

