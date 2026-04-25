import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function ProfileFeedback({ error, success }) {
  return (
    <>
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-[#d8e7ea] border border-[#b8d0d5] text-[#00343a] rounded-2xl text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          {success}
        </div>
      )}
    </>
  );
}
