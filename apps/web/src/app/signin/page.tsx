"use client";

import { useSignInMutation } from "@/web/app/signin/use-signin-mutation";
import { formHook } from "@/web/components/auth-form";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirectUrl");
  const router = useRouter();
  const { mutate: signIn, error } = useSignInMutation({
    onSuccess: () => {
      router.push(redirectUrl ?? "/page/1");
    },
  });

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

        <SignInForm
          onSubmit={async (formData) => {
            signIn({
              email: formData.email,
              password: formData.password,
            });
          }}
          error={error}
          submitLoadingText="Logging in..."
          submitText="Login"
        />

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

function SignInForm(props: {
  onSubmit: (formData: {
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
  }) => void;
  submitText: string;
  submitLoadingText: string;
  error: Error | null;
}) {
  const appForm = formHook.useAppForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    },
    onSubmit: async ({ value }) => {
      props.onSubmit(value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        appForm.handleSubmit();
      }}
      className="space-y-4 w-full"
    >
      <appForm.AppForm>
        <appForm.AppField
          name="name"
          children={(field) => (
            <field.TextField
              label="Name"
              placeholder="Al-Qaʿqāʿ ibn ʿAmr ibn Mālik Al-Tamīmī"
            />
          )}
        />
        <appForm.AppField
          name="email"
          validators={{
            onChange: ({ value }) => {
              if (!value) return "Email is required";
            },
          }}
          children={(field) => (
            <field.TextField type="email" label="Email" required />
          )}
        />
        <appForm.AppField
          name="password"
          validators={{
            onChange: ({ value }) => {
              if (!value) return "Password is required";
              if (value.length < 6) {
                return "Password must be at least 6 characters";
              }
            },
          }}
          children={(field) => (
            <field.TextField type="password" label="Password" required />
          )}
        />
        <appForm.SubmitButton label="Sign in" className="w-full" />
      </appForm.AppForm>
    </form>
  );
}
