import { Controller, type ControllerProps } from "react-hook-form";
import type { JSX } from "react/jsx-runtime";
import { Field, FieldLabel } from "../ui/field";
import { Textarea } from "../ui/textarea";

export default function TextareaWithLabel({
  label,
  htmlFor,
  inputProps,
  ...props
}: {
  htmlFor?: string;
  label: string;
  inputProps?: React.ComponentProps<"input">;
} & Pick<ControllerProps, "control" | "defaultValue" | "name">): JSX.Element {
  return (
    <Controller
      {...props}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>
          <Textarea {...field} id={htmlFor} aria-invalid={fieldState.invalid} />
        </Field>
      )}
    />
  );
}
