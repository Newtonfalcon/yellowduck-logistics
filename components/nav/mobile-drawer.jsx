'use client';

import { useState } from 'react';
import { useLockBodyScroll } from './use-lock-body-scroll';

export default function MobileDrawer({ children, trigger }) {
  const [isOpen, setIsOpen] = useState(false);
  useLockBodyScroll(isOpen);

  return (
    <>
      <div onClick={() => setIsOpen(true)}>{trigger}</div>
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-white shadow-lg">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2"
            >
              ✕
            </button>
            <div className="pt-12 px-4">
              {typeof children === 'function' ? children(() => setIsOpen(false)) : children}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
