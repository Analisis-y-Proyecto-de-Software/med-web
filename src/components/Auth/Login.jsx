import React from 'react';
import { Mail, Lock, ArrowRight, Loader2, ShieldCheck, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import CodeInputGroup from './CodeInputGroup';
import useLoginFlow from '../../hooks/useLoginFlow';
import AuthPanel from './ui/AuthPanel';
import AuthErrorMessage from './ui/AuthErrorMessage';
import AuthTextField from './ui/AuthTextField';
import AuthCheckboxField from './ui/AuthCheckboxField';
import { LOGIN_UI } from './constants/authText';
import { AUTH_METHODS, LOGIN_STEPS } from './constants/authState';

export default function Login({ onNavigate, onLoginSuccess }) {
  const {
    step,
    setStep,
    email,
    setEmail,
    password,
    setPassword,
    mfaCode,
    setMfaCode,
    qrUri,
    rememberDeviceChecked,
    setRememberDeviceChecked,
    loading,
    error,
    handleSignIn,
    handleConfirmMFA
  } = useLoginFlow({ onLoginSuccess });

  const visibleError = error;

  // Vistas secundarias
  if (step === LOGIN_STEPS.SETUP_TOTP || step === LOGIN_STEPS.CONFIRM_TOTP || step === LOGIN_STEPS.CONFIRM_EMAIL_OTP) {
    return (
      <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        <AuthPanel className="text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
            {step === LOGIN_STEPS.SETUP_TOTP ? <QrCode className="w-8 h-8" /> : (step === LOGIN_STEPS.CONFIRM_EMAIL_OTP ? <Mail className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />)}
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {step === LOGIN_STEPS.SETUP_TOTP ? LOGIN_UI.setupTotpTitle : (step === LOGIN_STEPS.CONFIRM_EMAIL_OTP ? LOGIN_UI.confirmEmailOtpTitle : LOGIN_UI.confirmTotpTitle)}
          </h2>
          
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
            {step === LOGIN_STEPS.SETUP_TOTP 
              ? LOGIN_UI.setupTotpDescription
              : (step === LOGIN_STEPS.CONFIRM_EMAIL_OTP 
                  ? LOGIN_UI.confirmEmailOtpDescription(email)
                  : LOGIN_UI.confirmTotpDescription)}
          </p>

          {step === LOGIN_STEPS.SETUP_TOTP && qrUri && (
            <div className="flex justify-center mb-6 p-4 bg-white rounded-xl mx-auto w-max shadow-sm border border-gray-100">
              <QRCodeSVG value={qrUri} size={150} />
            </div>
          )}

          <AuthErrorMessage message={visibleError} className="text-left" />
          
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleConfirmMFA(); }}>
            <CodeInputGroup
              value={mfaCode}
              onChange={setMfaCode}
              length={step === LOGIN_STEPS.CONFIRM_EMAIL_OTP ? 8 : 6}
              idPrefix="mfa"
              inputClassName={`text-center font-bold bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-500/30 outline-none transition-all ${
                step === LOGIN_STEPS.CONFIRM_EMAIL_OTP ? 'w-10 h-12 text-lg' : 'w-12 h-14 text-xl'
              }`}
            />

            <button 
              disabled={loading || mfaCode.slice(0, step === LOGIN_STEPS.CONFIRM_EMAIL_OTP ? 8 : 6).some(c => c === '')}
              className="w-full py-3 mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-70 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : LOGIN_UI.verifyAndEnter}
            </button>
            <button 
              type="button"
              onClick={() => setStep(LOGIN_STEPS.LOGIN_PASSWORD)}
              className="w-full py-2 text-sm text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              {LOGIN_UI.cancel}
            </button>
          </form>
        </AuthPanel>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
      <AuthPanel>
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300">
            {LOGIN_UI.title}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {LOGIN_UI.subtitle}
          </p>
        </div>

        <AuthErrorMessage message={visibleError} />

        {step === LOGIN_STEPS.LOGIN && (
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSignIn(AUTH_METHODS.EMAIL_OTP); }}>
            <AuthTextField
              label={LOGIN_UI.emailLabel}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder={LOGIN_UI.emailPlaceholder}
              icon={Mail}
              inputClassName="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-500/30 outline-none transition-all text-gray-900 dark:text-white"
            />

            <AuthCheckboxField
              id="remember_otp"
              checked={rememberDeviceChecked}
              onChange={(e) => setRememberDeviceChecked(e.target.checked)}
              label={LOGIN_UI.rememberOtp}
            />

            <button 
              type="submit"
              disabled={loading || !email}
              className="w-full py-3 mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-70 text-white rounded-xl font-medium flex items-center justify-center gap-2 group transition-all active:scale-[0.98]"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : LOGIN_UI.continue}
              {!loading && <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
            </button>
            
          </form>
        )}

        {step === LOGIN_STEPS.LOGIN_PASSWORD && (
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSignIn(AUTH_METHODS.PASSWORD); }}>
            <AuthTextField
              label={LOGIN_UI.emailLabel}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder={LOGIN_UI.emailPlaceholder}
              icon={Mail}
              inputClassName="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
            />

            <AuthTextField
              label={LOGIN_UI.passwordLabel}
              labelRight={<a href="#" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">{LOGIN_UI.forgotPassword}</a>}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder={LOGIN_UI.passwordPlaceholder}
              icon={Lock}
              inputClassName="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
            />

            <AuthCheckboxField
              id="remember_pwd"
              checked={rememberDeviceChecked}
              onChange={(e) => setRememberDeviceChecked(e.target.checked)}
              label={LOGIN_UI.rememberPassword}
            />

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-70 text-white rounded-xl font-medium flex items-center justify-center gap-2 group transition-all active:scale-[0.98]"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : LOGIN_UI.enter}
              {!loading && <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
            </button>

          </form>
        )}

        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          {LOGIN_UI.noAccount}{' '}
          <button onClick={onNavigate} className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
            {LOGIN_UI.signUp}
          </button>
        </p>
      </AuthPanel>
    </div>
  );
}
