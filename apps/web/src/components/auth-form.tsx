"use client";

import { Button } from "@/web/components/ui/button";
import { ButtonLoading } from "@/web/components/ui/button-loading";
import { Input } from "@/web/components/ui/input";
import { Label } from "@/web/components/ui/label";
import { useState } from "react";

interface AuthFormProps {
  submitText: string;
  submitLoadingText: string;
  isLoginForm?: boolean;
  onSubmit?: () => void;
}

export function AuthForm({
  onSubmit,
  submitText,
  submitLoadingText,
}: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    onSubmit?.();

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
      <div className="flex flex-col space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {loading ? (
        <ButtonLoading text={submitLoadingText} className="w-full" />
      ) : (
        <Button type="submit" disabled={loading} className="w-full">
          {submitText}
        </Button>
      )}
    </form>
  );
}
