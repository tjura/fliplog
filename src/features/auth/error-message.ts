export function authErrorMessage(
  status: number,
  createAccount: boolean,
): string {
  if (status === 429)
    return "Too many attempts. Please wait a minute and retry.";
  if (createAccount && [400, 409, 422].includes(status))
    return "We couldn’t create this account. Check your details or try signing in.";
  if (!createAccount && [400, 401, 422].includes(status))
    return "Email or password is incorrect. Please try again.";
  return "Account access is temporarily unavailable. Please retry.";
}
