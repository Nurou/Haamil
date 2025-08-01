"use client";

import { useSignUpMutation } from "@/web/app/signup/use-signup-mutation";
import { formHook } from "@/web/components/auth-form";
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
  const redirectUrl = searchParams.get("redirectUrl");
  const { mutate: signUp, error } = useSignUpMutation({
    onSuccess: () => {
      router.push(redirectUrl ?? "/page/1");
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
        <SignUpForm
          onSubmit={async (formData) => {
            signUp(formData);
          }}
          submitText="Sign up"
          submitLoadingText="Signing up..."
          error={null}
        />

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

function SignUpForm(props: {
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
        <appForm.AppField
          name="confirmPassword"
          validators={{
            onChange: ({ value }) => {
              if (!value) return "Confirm password is required";
            },
          }}
          children={(field) => (
            <field.TextField
              type="password"
              label="Confirm Password"
              required
            />
          )}
        />
        <appForm.SubmitButton label="Register" className="w-full" />
      </appForm.AppForm>
    </form>
  );
}
