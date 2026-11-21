export type FieldErrors = Record<string, string[] | undefined>;

export type AuthState = {
  error?: string;
  fieldErrors?: FieldErrors;
  token?: string;
};

export const initialAuthState: AuthState = {};
