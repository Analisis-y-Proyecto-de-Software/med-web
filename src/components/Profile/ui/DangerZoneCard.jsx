import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { PROFILE_UI } from '../constants/profileText';

export default function DangerZoneCard({ actionLoading, onGlobalSignOut }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-3xl p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-red-100 rounded-2xl text-red-700">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[#1f2328]">{PROFILE_UI.dangerZoneTitle}</h3>
          <p className="text-sm text-gray-600">{PROFILE_UI.dangerZoneDescription}</p>
        </div>
      </div>
      <p className="text-sm text-gray-700 mb-6 border-t border-red-200 pt-4">
        {PROFILE_UI.dangerZoneBody}
      </p>
      <button
        onClick={onGlobalSignOut}
        disabled={actionLoading}
        className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:opacity-70 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
      >
        {actionLoading ? <Loader2 className="animate-spin h-5 w-5" /> : (
          <>
            <AlertTriangle className="w-5 h-5" />
            {PROFILE_UI.closeAllSessions}
          </>
        )}
      </button>
    </div>
  );
}
