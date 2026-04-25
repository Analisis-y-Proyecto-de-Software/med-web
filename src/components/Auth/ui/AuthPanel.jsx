import React from 'react';

export default function AuthPanel({ children, className = '' }) {
  const baseClassName = 'bg-white border border-[#d7dce2] rounded-3xl p-8 shadow-[0_12px_34px_rgba(11,18,25,0.08)]';
  return <div className={`${baseClassName} ${className}`.trim()}>{children}</div>;
}
