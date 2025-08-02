"use client";

import { useSignUpMutation } from "@/web/app/signup/use-signup-mutation";
import { ProviderSignInButton } from "@/web/components/auth/provider-signin";
import { Alert, AlertDescription, AlertTitle } from "@/web/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function SignUpPage() {
  return (
    <Suspense>
      {/* ¯\_(ツ)_/¯ https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout */}
      <SignUpPagePlain />;
    </Suspense>
  );
}

function SignUpPagePlain() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirectUrl");
  const { error } = useSignUpMutation({
    onSuccess: () => {
      router.push(redirectPath ?? "/page/1");
    },
  });
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center justify-center max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign up to begin your Quran memorization journey
          </p>
        </div>

        {error ? (
          <Alert variant="destructive">
            <AlertCircleIcon className="w-4 h-4" />
            <AlertTitle>Sign up failed</AlertTitle>
            <AlertDescription>
              Error: {error.message}. Please try again. If the issue persists,
              please send an email to{" "}
              <a href="mailto:joel.nh@gmail.com">joel.nh@gmail.com</a>.
            </AlertDescription>
          </Alert>
        ) : null}

        <div className="w-full space-y-4">
          <ProviderSignInButton provider="google" />

          {/* <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <AuthForm
            onSubmit={async (formData) => {
              signUp({
                email: formData.email,
                password: formData.password,
                name: formData.name || "",
              });
            }}
            submitText="Sign up"
            showNameField={true}
            showConfirmPasswordField={true}
          /> */}
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/signin" className="font-medium text-indigo-600">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
