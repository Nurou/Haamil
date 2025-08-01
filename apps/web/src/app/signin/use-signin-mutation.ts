import { authClient } from "@/web/lib/auth-client";
import { useMutation } from "@tanstack/react-query";

export function useSignInMutation(props: { onSuccess: () => void }) {
  return useMutation({
    mutationFn: async (formData: { email: string; password: string }) => {
      await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
      });
      props.onSuccess();
    },
  });
}
