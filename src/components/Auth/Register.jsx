import React, { useState } from "react";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { signUp, confirmSignUp, signIn } from "aws-amplify/auth";
import CodeInputGroup from "./CodeInputGroup";
import AuthPanel from "./ui/AuthPanel";
import AuthErrorMessage from "./ui/AuthErrorMessage";
import AuthTextField from "./ui/AuthTextField";
import { REGISTER_UI, REGISTER_ERRORS } from "./constants/authText";
import { REGISTER_STEPS } from "./constants/authState";
import { mapAuthError } from "./utils/authErrorMapper";

export default function Register({ onNavigate }) {
  const [step, setStep] = useState(REGISTER_STEPS.REGISTER);

  // Register state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Confirm state
  const [code, setCode] = useState(["", "", "", "", "", ""]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            "custom:name": name, // 👈 AQUI ESTA EL FIX
          },
        },
      });
      setStep(REGISTER_STEPS.CONFIRM);
    } catch (err) {
      setError(mapAuthError(err, REGISTER_ERRORS.signUpError));
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const confirmationCode = code.join("");
      await confirmSignUp({ username: email, confirmationCode });

      // Intentamos hacer auto-login ya que ahora el MFA es opcional
      try {
        const { isSignedIn } = await signIn({ username: email, password });
        if (!isSignedIn) {
          // Si por alguna razón pide un reto (MFA u otro),
          // lo mandamos al Login para que esa pantalla maneje el flujo complejo.
          onNavigate();
        }
        // Si isSignedIn es true, el Hub en App.jsx detectará el evento 'signedIn'
        // y lo enviará automáticamente al Dashboard.
      } catch {
        // Si el auto-login falla, también lo mandamos al Login por precaución.
        onNavigate();
      }
    } catch (err) {
      setError(mapAuthError(err, REGISTER_ERRORS.invalidCode));
    } finally {
      setLoading(false);
    }
  };

  if (step === REGISTER_STEPS.CONFIRM) {
    return (
      <div className="w-full max-w-md">
        <AuthPanel className="text-center">
          <div className="w-14 h-14 bg-[#e7eff1] text-[#00343a] rounded-full flex items-center justify-center mx-auto mb-5">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-semibold text-[#1f2328] mb-2">
            {REGISTER_UI.verifyEmailTitle}
          </h2>
          <p className="text-gray-600 mb-4 text-sm">
            {REGISTER_UI.verifyEmailPrefix} <strong>{email}</strong>.{" "}
            {REGISTER_UI.verifyEmailSuffix}
          </p>

          <AuthErrorMessage message={error} className="text-left" />

          <form className="space-y-4" onSubmit={handleConfirm}>
            <CodeInputGroup
              value={code}
              onChange={setCode}
              length={6}
              idPrefix="code"
              inputClassName="w-12 h-14 text-center text-xl font-bold bg-white border border-[#cfd5db] rounded-xl focus:ring-2 focus:ring-[#00343a]/20 focus:border-[#00343a]/40 outline-none transition-all"
            />

            <button
              disabled={loading || code.some((c) => c === "")}
              className="w-full py-3 mt-6 bg-[#00343a] hover:bg-[#00464d] disabled:opacity-70 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                REGISTER_UI.confirmAccount
              )}
            </button>
          </form>

          <p className="mt-6 text-sm text-gray-500">
            {REGISTER_UI.backToLogin}{" "}
            <button
              onClick={onNavigate}
              className="text-[#005a64] hover:underline"
            >
              {REGISTER_UI.login}
            </button>
          </p>
        </AuthPanel>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <AuthPanel>
        <div className="text-center mb-6">
          <h2 className="text-3xl font-semibold text-[#00343a]">
            {REGISTER_UI.title}
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            {REGISTER_UI.subtitle}
          </p>
        </div>

        <AuthErrorMessage message={error} />

        <form className="space-y-4" onSubmit={handleSignUp}>
          <AuthTextField
            label={REGISTER_UI.fullNameLabel}
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={REGISTER_UI.fullNamePlaceholder}
            icon={User}
            inputClassName="w-full pl-10 pr-4 py-3 bg-white border border-[#cfd5db] rounded-xl focus:ring-2 focus:ring-[#00343a]/20 focus:border-[#00343a]/40 outline-none transition-all"
          />

          <AuthTextField
            label={REGISTER_UI.emailLabel}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={REGISTER_UI.emailPlaceholder}
            icon={Mail}
            inputClassName="w-full pl-10 pr-4 py-3 bg-white border border-[#cfd5db] rounded-xl focus:ring-2 focus:ring-[#00343a]/20 focus:border-[#00343a]/40 outline-none transition-all"
          />

          <AuthTextField
            label={REGISTER_UI.passwordLabel}
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={REGISTER_UI.passwordPlaceholder}
            icon={Lock}
            inputClassName="w-full pl-10 pr-4 py-3 bg-white border border-[#cfd5db] rounded-xl focus:ring-2 focus:ring-[#00343a]/20 focus:border-[#00343a]/40 outline-none transition-all"
          />

          <button
            disabled={loading}
            className="w-full py-3 mt-6 bg-[#00343a] hover:bg-[#00464d] disabled:opacity-70 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
          >
            {loading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              REGISTER_UI.signUp
            )}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          {REGISTER_UI.haveAccount}{" "}
          <button
            onClick={onNavigate}
            className="font-semibold text-[#005a64] hover:underline"
          >
            {REGISTER_UI.signIn}
          </button>
        </p>
      </AuthPanel>
    </div>
  );
}
