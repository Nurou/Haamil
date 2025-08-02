import { signUpEmail } from "@/web/lib/auth-client";
import { useMutation } from "@tanstack/react-query";

export function useSignUpMutation(props: { onSuccess: () => void }) {
  return useMutation({
    mutationFn: async (formData: {
      email: string;
      password: string;
      name: string;
    }) => {
      await signUpEmail({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      });
      props.onSuccess();
    },
  });
}
