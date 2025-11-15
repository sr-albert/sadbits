import type { JSX } from "react/jsx-runtime";
import { Controller, type ControllerProps } from "react-hook-form";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

export default function InputWithLabel({
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
          <Input
            {...field}
            id={htmlFor}
            aria-invalid={fieldState.invalid}
            onChange={(e) => field.onChange(e.target.value)}
          />
        </Field>
      )}
    />
  );
}
