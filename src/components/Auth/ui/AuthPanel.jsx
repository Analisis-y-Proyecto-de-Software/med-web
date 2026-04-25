import React from 'react';

export default function AuthPanel({ children, className = '' }) {
  const baseClassName = 'bg-white border border-[#d7dce2] rounded-3xl p-8';
  return <div className={`${baseClassName} ${className}`.trim()}>{children}</div>;
}
