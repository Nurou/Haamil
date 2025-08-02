"use client";

import { ProviderSignInButton } from "@/web/components/auth/provider-signin";
import Link from "next/link";
// import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function SignInPage() {
  return (
    <Suspense>
      {/* ¯\_(ツ)_/¯ https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout */}
      <SignInPagePlain />;
    </Suspense>
  );
}

function SignInPagePlain() {
  // const searchParams = useSearchParams();
  // const redirectPath = searchParams.get("redirectPath");
  // const router = useRouter();
  // const { mutate: signIn, error } = useSignInMutation({
  //   onSuccess: () => {
  //     router.push(redirectUrl ?? "/page/1");
  //   },
  // });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center justify-center max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Memorize. Review. Retain.
          </p>
        </div>

        {/* {error ? (
          <Alert variant="destructive">
            <AlertCircleIcon className="w-4 h-4" />
            <AlertTitle>Sign up failed</AlertTitle>
            <AlertDescription>
              Error: {error.message}. Please try again. If the issue persists,
              please send an email to{" "}
              <a href="mailto:joel.nh@gmail.com">joel.nh@gmail.com</a>.
            </AlertDescription>
          </Alert>
        ) : null} */}

        <div className="w-full space-y-4">
          <ProviderSignInButton provider="google" />

          {/* <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-50 px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <AuthForm
            onSubmit={async (formData) => {
              signIn({
                email: formData.email,
                password: formData.password,
              });
            }}
            submitText="Login"
          /> */}
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/signup" className="font-medium text-indigo-600 ">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
