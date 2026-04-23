const COGNITO_ERROR_MESSAGES = {
  UserNotFoundException: 'No encontramos una cuenta con ese correo.',
  NotAuthorizedException: 'Correo o contraseña incorrectos.',
  UserNotConfirmedException: 'Tu cuenta aun no esta confirmada. Revisa tu correo.',
  UsernameExistsException: 'Este correo ya esta registrado.',
  CodeMismatchException: 'El codigo ingresado no es valido.',
  ExpiredCodeException: 'El codigo expiro. Solicita uno nuevo.',
  LimitExceededException: 'Se excedio el numero de intentos. Intenta nuevamente mas tarde.',
  TooManyRequestsException: 'Demasiados intentos. Espera un momento e intenta de nuevo.',
  InvalidPasswordException: 'La contrasena no cumple los requisitos de seguridad.'
};

const stripTechnicalPrefix = (message) => {
  if (!message || typeof message !== 'string') return message;

  const cleaned = message
    .trim()
    .replace(/^[A-Za-z0-9_]+\s+failed\s+with\s+error\s*/i, '')
    .replace(/^Error:\s*/i, '')
    .replace(/^[\s:.-]+/, '');

  return cleaned || message;
};

const getRawMessage = (error) => {
  if (!error) return '';
  if (typeof error === 'string') return error;
  return error.message || '';
};

export const mapAuthError = (error, fallbackMessage = 'Ocurrio un error inesperado.') => {
  if (!error) return fallbackMessage;

  const code = error?.name || error?.code;
  if (code && COGNITO_ERROR_MESSAGES[code]) {
    return COGNITO_ERROR_MESSAGES[code];
  }

  const rawMessage = getRawMessage(error);
  if (!rawMessage) return fallbackMessage;

  return stripTechnicalPrefix(rawMessage);
};
