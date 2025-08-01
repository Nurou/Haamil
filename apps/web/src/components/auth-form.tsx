"use client";

import { Button } from "@/web/components/ui/button";
import { ButtonLoading } from "@/web/components/ui/button-loading";
import { Input } from "@/web/components/ui/input";
import { Label } from "@/web/components/ui/label";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { HTMLInputTypeAttribute } from "react";

export function TextField(props: {
  label: string;
  required?: boolean;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  caption?: string;
}) {
  const field = useFieldContext<string>();
  return (
    <div className="flex flex-col space-y-2">
      <Label htmlFor={field.name}>
        {props.label}
        {props.required ? (
          <span className="text-red-500 text-sm ml-1">*</span>
        ) : null}
      </Label>
      <Input
        id={field.name}
        name={field.name}
        type={props.type}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        required={props.required}
        placeholder={props.placeholder}
      />
      {props.caption ? (
        <span className="text-sm text-gray-400">{props.caption}</span>
      ) : null}
      {field.state.meta.errors ? (
        <p className="text-sm text-red-600">
          {field.state.meta.errors.join(", ")}
        </p>
      ) : null}
    </div>
  );
}

function SubmitButton({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {form.state.isSubmitting ? (
        <ButtonLoading text="Submitting..." className={className} />
      ) : (
        <Button
          type="submit"
          disabled={form.state.isSubmitting || !form.state.canSubmit}
          className="w-full"
        >
          {label}
        </Button>
      )}
    </form.Subscribe>
  );
}

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

export const formHook = createFormHook({
  fieldComponents: {
    TextField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});
