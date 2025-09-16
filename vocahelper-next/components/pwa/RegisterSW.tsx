"use client";
import { useEffect } from 'react';

export function RegisterSW() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
    const register = async () => {
      try {
        await navigator.serviceWorker.register('/sw.js');
      } catch (e) {
        // no-op
      }
    };
    register();
  }, []);
  return null;
}

