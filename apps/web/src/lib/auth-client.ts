import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const signInWithProvider = async ({
  provider,
  callbackURL,
}: {
  provider: "google";
  callbackURL: string;
}) => {
  await authClient.signIn.social({
    provider,
    callbackURL,
  });
};

export const signUpEmail = async ({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name: string;
}) => {
  await authClient.signUp.email({
    email,
    password,
    name,
  });
};

export const signInEmail = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  await authClient.signIn.email({
    email,
    password,
  });
};

export const signOut = async () => {
  await authClient.signOut();
};

export const useSession = () => {
  return authClient.useSession();
};
