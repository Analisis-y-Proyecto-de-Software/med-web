import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { PROFILE_UI } from '../constants/profileText';

export default function ProfileHeader({ onBack }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <button
        onClick={onBack}
        className="p-2 rounded-xl bg-[#d8d9dd] border border-[#c4c5ca] hover:bg-[#ececef] transition-colors"
      >
        <ArrowLeft className="w-5 h-5 text-[#212121]" />
      </button>
      <div>
        <h2 className="text-3xl font-semibold text-[#00343a]">
          {PROFILE_UI.title}
        </h2>
        <p className="text-gray-600 text-sm">{PROFILE_UI.subtitle}</p>
      </div>
    </div>
  );
}
