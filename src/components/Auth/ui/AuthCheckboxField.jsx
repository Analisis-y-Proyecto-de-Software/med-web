import React from 'react';

export default function AuthCheckboxField({ id, checked, onChange, label }) {
  return (
    <div className="flex items-center gap-2 mt-4 ml-1 mb-2">
      <input
        type="checkbox"
        id={id}
        className="w-4 h-4 text-[#005a64] border-gray-300 rounded focus:ring-[#005a64]/40 cursor-pointer"
        checked={checked}
        onChange={onChange}
      />
      <label htmlFor={id} className="text-sm text-gray-600 cursor-pointer select-none">
        {label}
      </label>
    </div>
  );
}
