"use client";
import * as React from 'react';
import { getSupabase } from '@/lib/supabase';

export function AuthBar() {
  const sb = getSupabase();
  const [email, setEmail] = React.useState('');
  const [userEmail, setUserEmail] = React.useState<string | null>(null);
  const [sending, setSending] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);

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
    <div className="ml-2 flex items-center gap-2 relative">
      {userEmail ? (
        <div>
          <button
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="focus-ring inline-flex items-center gap-2 rounded-md border border-slate-300 px-2 py-1 text-xs"
            title={userEmail || 'Profile'}
          >
            <span className="hidden sm:inline">{userEmail}</span>
            <span aria-hidden>▾</span>
          </button>
          {menuOpen && (
            <ul role="menu" className="absolute right-0 mt-1 w-44 rounded-md border border-slate-200 bg-white p-1 text-sm shadow-xl">
              <li>
                <a href="/drafts" role="menuitem" className="block rounded px-2 py-1 hover:bg-slate-100">My drafts</a>
              </li>
              <li>
                <button role="menuitem" className="block w-full rounded px-2 py-1 text-left hover:bg-slate-100" onClick={() => sb.auth.signOut()}>Sign out</button>
              </li>
            </ul>
          )}
        </div>
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
          <div className="hidden sm:flex items-center gap-1 pl-1">
            <button
              type="button"
              className="focus-ring rounded-md border border-slate-300 px-2 py-1 text-xs"
              onClick={() => sb.auth.signInWithOAuth({ provider: 'github' })}
              aria-label="Sign in with GitHub"
              title="Sign in with GitHub"
            >GitHub</button>
            <button
              type="button"
              className="focus-ring rounded-md border border-slate-300 px-2 py-1 text-xs"
              onClick={() => sb.auth.signInWithOAuth({ provider: 'google' })}
              aria-label="Sign in with Google"
              title="Sign in with Google"
            >Google</button>
          </div>
        </form>
      )}
    </div>
  );
}
