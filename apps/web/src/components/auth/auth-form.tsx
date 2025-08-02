"use client";

import { formHook } from "@/web/components/auth/form-fields";

export interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
  name?: string;
}

export interface AuthFormProps {
  onSubmit: (formData: AuthFormData) => void;
  submitText: string;
  showNameField?: boolean;
  showConfirmPasswordField?: boolean;
  namePlaceholder?: string;
}

export function AuthForm({
  onSubmit,
  submitText,
  showNameField = false,
  showConfirmPasswordField = false,
  namePlaceholder = "Al-Qaʿqāʿ ibn ʿAmr ibn Mālik Al-Tamīmī",
}: AuthFormProps) {
  const appForm = formHook.useAppForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    },
    onSubmit: async ({ value }) => {
      onSubmit(value);
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
        {showNameField && (
          <appForm.AppField
            name="name"
            children={(field) => (
              <field.TextField label="Name" placeholder={namePlaceholder} />
            )}
          />
        )}

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

        {showConfirmPasswordField && (
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
        )}

        <appForm.SubmitButton label={submitText} className="w-full" />
      </appForm.AppForm>
    </form>
  );
}
