'use client';

import { useEffect } from 'react';

export function useLockBodyScroll(isLocked) {
  useEffect(() => {
    if (isLocked) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isLocked]);
}
