'use client';

export function NavSection({ title, children }) {
  return (
    <div className="py-4">
      {title && (
        <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {title}
        </h3>
      )}
      <nav className="space-y-1">
        {children}
      </nav>
    </div>
  );
}
