import React from 'react';
import { ShieldCheck, ShieldOff, QrCode, Loader2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import CodeInputGroup from '../../Auth/CodeInputGroup';
import { PROFILE_UI } from '../constants/profileText';

export default function MfaStatusCard({
  mfaEnabled,
  setupStep,
  setupSteps,
  qrUri,
  verifyCode,
  setVerifyCode,
  actionLoading,
  onCancelSetup,
  onVerifySetup,
  onEnableMfa,
  onDisableMfa
}) {
  return (
    <div className="bg-white border border-[#d7dce2] rounded-3xl p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl ${mfaEnabled ? 'bg-[#d8e7ea] text-[#00343a]' : 'bg-[#ececef] text-[#6a737d]'}`}>
            {mfaEnabled ? <ShieldCheck className="w-7 h-7" /> : <ShieldOff className="w-7 h-7" />}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#1f2328]">{PROFILE_UI.mfaTitle}</h3>
            <p className="text-sm text-gray-600">
              {mfaEnabled
                ? PROFILE_UI.mfaDescriptionEnabled
                : PROFILE_UI.mfaDescriptionDisabled}
            </p>
          </div>
        </div>

        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${mfaEnabled ? 'bg-[#d8e7ea] text-[#00343a]' : 'bg-[#ececef] text-[#6a737d]'}`}>
          {mfaEnabled ? PROFILE_UI.mfaStatusEnabled : PROFILE_UI.mfaStatusDisabled}
        </span>
      </div>

      {setupStep === setupSteps.QR && (
        <div className="border-t border-[#d7dce2] pt-6 mt-4">
          <div className="text-center">
            <div className="w-14 h-14 bg-[#e7eff1] text-[#00343a] rounded-full flex items-center justify-center mx-auto mb-4">
              <QrCode className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-semibold text-[#1f2328] mb-2">{PROFILE_UI.qrTitle}</h4>
            <p className="text-sm text-gray-600 mb-6">{PROFILE_UI.qrDescription}</p>

            {qrUri && (
              <div className="flex justify-center mb-6 p-4 bg-white rounded-xl mx-auto w-max shadow-sm border border-gray-100">
                <QRCodeSVG value={qrUri} size={180} />
              </div>
            )}

            <form onSubmit={(e) => { e.preventDefault(); onVerifySetup(); }} className="space-y-4">
              <CodeInputGroup
                value={verifyCode}
                onChange={setVerifyCode}
                length={6}
                idPrefix="profile-mfa"
                inputClassName="w-12 h-14 text-center text-xl font-bold bg-white border border-[#cfd5db] rounded-xl focus:ring-2 focus:ring-[#00343a]/20 focus:border-[#00343a]/40 outline-none transition-all"
              />
              <div className="flex gap-3 justify-center mt-6">
                <button
                  type="button"
                  onClick={onCancelSetup}
                  className="px-6 py-3 text-sm text-gray-600 hover:text-gray-800 border border-[#cfd5db] rounded-xl transition-colors"
                >
                  {PROFILE_UI.cancel}
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || verifyCode.some((c) => c === '')}
                  className="px-6 py-3 bg-[#00343a] hover:bg-[#00464d] disabled:opacity-70 text-white rounded-xl font-medium flex items-center gap-2 transition-colors"
                >
                  {actionLoading ? <Loader2 className="animate-spin h-4 w-4" /> : PROFILE_UI.verifyAndEnable}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {setupStep === setupSteps.IDLE && (
        <div className="border-t border-[#d7dce2] pt-6 mt-4">
          {mfaEnabled ? (
            <button
              onClick={onDisableMfa}
              disabled={actionLoading}
              className="w-full py-3 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
            >
              {actionLoading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                <>
                  <ShieldOff className="w-5 h-5" />
                  {PROFILE_UI.disableMfa}
                </>
              )}
            </button>
          ) : (
            <button
              onClick={onEnableMfa}
              disabled={actionLoading}
              className="w-full py-3 bg-[#00343a] hover:bg-[#00464d] disabled:opacity-70 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
            >
              {actionLoading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  {PROFILE_UI.enableMfa}
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
