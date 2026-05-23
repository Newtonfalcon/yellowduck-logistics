'use client';

import Link from 'next/link';

export function NavItem({ href, label, icon, onClick, isActive }) {
  const baseStyles = 'flex items-center gap-2 px-3 py-2 rounded-md transition-colors';
  const styles = isActive
    ? 'bg-primary text-white'
    : 'text-gray-700 hover:bg-gray-100';

  if (onClick) {
    return (
      <button onClick={onClick} className={`${baseStyles} ${styles} w-full text-left`}>
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span>{label}</span>
      </button>
    );
  }

  return (
    <Link href={href || '#'} className={`${baseStyles} ${styles}`}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{label}</span>
    </Link>
  );
}
