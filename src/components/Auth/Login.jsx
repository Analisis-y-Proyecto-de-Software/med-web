import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Loader2, ShieldCheck, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { confirmResetPassword, resetPassword } from 'aws-amplify/auth';
import CodeInputGroup from './CodeInputGroup';
import useLoginFlow from '../../hooks/useLoginFlow';
import AuthPanel from './ui/AuthPanel';
import AuthErrorMessage from './ui/AuthErrorMessage';
import AuthTextField from './ui/AuthTextField';
import AuthCheckboxField from './ui/AuthCheckboxField';
import { LOGIN_UI } from './constants/authText';
import { AUTH_METHODS, LOGIN_STEPS } from './constants/authState';
import { mapAuthError } from './utils/authErrorMapper';

export default function Login({ onNavigate, onLoginSuccess }) {
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetStep, setResetStep] = useState('request');
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');

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

  const openResetMode = () => {
    setIsResetMode(true);
    setResetStep('request');
    setResetEmail(email || '');
    setResetCode('');
    setResetNewPassword('');
    setResetError('');
    setResetSuccess('');
  };

  const closeResetMode = () => {
    setIsResetMode(false);
    setResetStep('request');
    setResetCode('');
    setResetNewPassword('');
    setResetError('');
    setResetSuccess('');
  };

  const handleSendResetCode = async () => {
    if (!resetEmail.trim()) {
      setResetError(LOGIN_UI.resetEmailRequired);
      return;
    }

    setResetLoading(true);
    setResetError('');
    setResetSuccess('');

    try {
      await resetPassword({ username: resetEmail.trim() });
      setResetStep('confirm');
      setResetSuccess(LOGIN_UI.resetCodeSent(resetEmail.trim()));
    } catch (err) {
      setResetError(mapAuthError(err, LOGIN_UI.resetSendCodeError));
    } finally {
      setResetLoading(false);
    }
  };

  const handleConfirmResetPassword = async () => {
    if (!resetEmail.trim()) {
      setResetError(LOGIN_UI.resetEmailRequired);
      return;
    }

    if (!resetCode.trim()) {
      setResetError(LOGIN_UI.resetCodeRequired);
      return;
    }

    if (resetCode.trim().length !== 6) {
      setResetError(LOGIN_UI.resetCodeLengthError);
      return;
    }

    if (!resetNewPassword.trim()) {
      setResetError(LOGIN_UI.resetNewPasswordRequired);
      return;
    }

    setResetLoading(true);
    setResetError('');
    setResetSuccess('');

    try {
      await confirmResetPassword({
        username: resetEmail.trim(),
        confirmationCode: resetCode.trim(),
        newPassword: resetNewPassword
      });
      setEmail(resetEmail.trim());
      setPassword('');
      setResetSuccess(LOGIN_UI.resetPasswordSuccess);
      setTimeout(() => {
        closeResetMode();
      }, 800);
    } catch (err) {
      setResetError(mapAuthError(err, LOGIN_UI.resetConfirmError));
    } finally {
      setResetLoading(false);
    }
  };

  // Vistas secundarias
  if (step === LOGIN_STEPS.SETUP_TOTP || step === LOGIN_STEPS.CONFIRM_TOTP || step === LOGIN_STEPS.CONFIRM_EMAIL_OTP) {
    return (
      <div className="w-full max-w-md">
        <AuthPanel className="text-center">
          <div className="w-14 h-14 bg-[#d8e7ea] text-[#00343a] rounded-full flex items-center justify-center mx-auto mb-5">
            {step === LOGIN_STEPS.SETUP_TOTP ? <QrCode className="w-8 h-8" /> : (step === LOGIN_STEPS.CONFIRM_EMAIL_OTP ? <Mail className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />)}
          </div>
          
          <h2 className="text-2xl font-semibold text-[#1f2328] mb-2">
            {step === LOGIN_STEPS.SETUP_TOTP ? LOGIN_UI.setupTotpTitle : (step === LOGIN_STEPS.CONFIRM_EMAIL_OTP ? LOGIN_UI.confirmEmailOtpTitle : LOGIN_UI.confirmTotpTitle)}
          </h2>
          
          <p className="text-gray-600 mb-5 text-sm">
            {step === LOGIN_STEPS.SETUP_TOTP 
              ? LOGIN_UI.setupTotpDescription
              : (step === LOGIN_STEPS.CONFIRM_EMAIL_OTP 
                  ? LOGIN_UI.confirmEmailOtpDescription(email)
                  : LOGIN_UI.confirmTotpDescription)}
          </p>

          {step === LOGIN_STEPS.SETUP_TOTP && qrUri && (
            <div className="flex justify-center mb-6 p-4 bg-white rounded-xl mx-auto w-max shadow-sm border border-[#d7dce2]">
              <QRCodeSVG value={qrUri} size={150} />
            </div>
          )}

          <AuthErrorMessage message={visibleError} className="text-left" />
          
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleConfirmMFA(); }}>
            <CodeInputGroup
              value={mfaCode}
              onChange={setMfaCode}
              length={6}
              idPrefix="mfa"
              inputClassName="w-12 h-14 text-center text-xl font-bold bg-white border border-[#cfd5db] rounded-xl focus:ring-2 focus:ring-[#00343a]/20 focus:border-[#00343a]/40 outline-none transition-all"
            />

            <button 
              disabled={loading || mfaCode.slice(0, 6).some(c => c === '')}
              className="w-full py-3 mt-6 bg-[#00343a] hover:bg-[#00464d] disabled:opacity-70 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : LOGIN_UI.verifyAndEnter}
            </button>
            <button 
              type="button"
              onClick={() => setStep(LOGIN_STEPS.LOGIN_PASSWORD)}
              className="w-full py-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
            >
              {LOGIN_UI.cancel}
            </button>
          </form>
        </AuthPanel>
      </div>
    );
  }

  if (isResetMode) {
    return (
      <div className="w-full max-w-md">
        <AuthPanel>
          <div className="text-center mb-7">
            <h2 className="text-3xl font-semibold text-[#00343a]">{LOGIN_UI.resetTitle}</h2>
            <p className="text-sm text-gray-600 mt-2">{LOGIN_UI.resetSubtitle}</p>
          </div>

          <AuthErrorMessage message={resetError} />

          {resetSuccess && (
            <div className="mb-4 p-3 rounded-xl border bg-[#d8e7ea] border-[#b8d0d5] text-[#00343a]">
              <p className="text-sm leading-5">{resetSuccess}</p>
            </div>
          )}

          {resetStep === 'request' && (
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); void handleSendResetCode(); }}>
              <AuthTextField
                label={LOGIN_UI.emailLabel}
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
                placeholder={LOGIN_UI.emailPlaceholder}
                icon={Mail}
                inputClassName="w-full pl-10 pr-4 py-3 bg-white border border-[#cfd5db] rounded-xl focus:ring-2 focus:ring-[#00343a]/20 focus:border-[#00343a]/40 outline-none transition-all"
              />

              <button
                type="submit"
                disabled={resetLoading}
                className="w-full py-3 mt-6 bg-[#00343a] hover:bg-[#00464d] disabled:opacity-70 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
              >
                {resetLoading ? <Loader2 className="animate-spin h-5 w-5" /> : LOGIN_UI.sendResetCode}
              </button>
            </form>
          )}

          {resetStep === 'confirm' && (
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); void handleConfirmResetPassword(); }}>
              <AuthTextField
                label={LOGIN_UI.emailLabel}
                type="email"
                value={resetEmail}
                onChange={() => {}}
                inputProps={{ readOnly: true, disabled: true, autoComplete: 'off' }}
                inputClassName="w-full px-4 py-3 bg-[#f5f6f8] border border-[#cfd5db] rounded-xl text-gray-500 outline-none"
              />

              <AuthTextField
                label={LOGIN_UI.resetCodeLabel}
                type="text"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                placeholder={LOGIN_UI.resetCodePlaceholder}
                inputProps={{
                  inputMode: 'numeric',
                  autoComplete: 'one-time-code',
                  maxLength: 6,
                  pattern: '\\d{6}',
                  name: 'reset-code'
                }}
                inputClassName="w-full px-4 py-3 bg-white border border-[#cfd5db] rounded-xl focus:ring-2 focus:ring-[#00343a]/20 focus:border-[#00343a]/40 outline-none transition-all"
              />

              <AuthTextField
                label={LOGIN_UI.resetNewPasswordLabel}
                type="password"
                value={resetNewPassword}
                onChange={(e) => setResetNewPassword(e.target.value)}
                required
                placeholder={LOGIN_UI.resetNewPasswordPlaceholder}
                icon={Lock}
                inputClassName="w-full pl-10 pr-4 py-3 bg-white border border-[#cfd5db] rounded-xl focus:ring-2 focus:ring-[#00343a]/20 focus:border-[#00343a]/40 outline-none transition-all"
              />

              <button
                type="submit"
                disabled={resetLoading || resetCode.length !== 6 || !resetNewPassword.trim()}
                className="w-full py-3 mt-6 bg-[#00343a] hover:bg-[#00464d] disabled:opacity-70 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
              >
                {resetLoading ? <Loader2 className="animate-spin h-5 w-5" /> : LOGIN_UI.resetPasswordButton}
              </button>

              <button
                type="button"
                onClick={() => {
                  setResetStep('request');
                  setResetCode('');
                  setResetSuccess('');
                  setResetError('');
                }}
                className="w-full py-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
              >
                {LOGIN_UI.resendResetCode}
              </button>
            </form>
          )}

          <button
            type="button"
            onClick={closeResetMode}
            className="w-full mt-6 py-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            {LOGIN_UI.backToLogin}
          </button>
        </AuthPanel>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <AuthPanel>
        
        <div className="text-center mb-7">
          <h2 className="text-3xl font-semibold text-[#00343a]">
            {LOGIN_UI.title}
          </h2>
          <p className="text-sm text-gray-600 mt-2">
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
              inputClassName="w-full pl-10 pr-4 py-3 bg-white border border-[#cfd5db] rounded-xl focus:ring-2 focus:ring-[#00343a]/20 focus:border-[#00343a]/40 outline-none transition-all text-[#1f2328]"
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
              className="w-full py-3 mt-6 bg-[#00343a] hover:bg-[#00464d] disabled:opacity-70 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : LOGIN_UI.continue}
              {!loading && <ArrowRight className="h-4 w-4" />}
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
              inputClassName="w-full pl-10 pr-4 py-3 bg-white border border-[#cfd5db] rounded-xl focus:ring-2 focus:ring-[#00343a]/20 focus:border-[#00343a]/40 outline-none transition-all"
            />

            <AuthTextField
              label={LOGIN_UI.passwordLabel}
              labelRight={<button type="button" onClick={openResetMode} className="text-xs text-[#005a64] hover:underline">{LOGIN_UI.forgotPassword}</button>}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder={LOGIN_UI.passwordPlaceholder}
              icon={Lock}
              inputClassName="w-full pl-10 pr-4 py-3 bg-white border border-[#cfd5db] rounded-xl focus:ring-2 focus:ring-[#00343a]/20 focus:border-[#00343a]/40 outline-none transition-all"
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
              className="w-full py-3 mt-6 bg-[#00343a] hover:bg-[#00464d] disabled:opacity-70 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : LOGIN_UI.enter}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>

          </form>
        )}

        <p className="mt-8 text-center text-sm text-gray-600">
          {LOGIN_UI.noAccount}{' '}
          <button onClick={onNavigate} className="font-semibold text-[#005a64] hover:underline">
            {LOGIN_UI.signUp}
          </button>
        </p>
      </AuthPanel>
    </div>
  );
}
