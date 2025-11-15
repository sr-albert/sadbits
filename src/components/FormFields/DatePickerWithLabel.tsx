import { Controller, type ControllerProps } from "react-hook-form";
import type { JSX } from "react/jsx-runtime";
import DatePicker from "../GenericFields/DatePicker";
import { Field, FieldLabel } from "../ui/field";

export default function DatePickerWithLabel({
  label,
  htmlFor = "",
  ...props
}: {
  htmlFor?: string;
  label: string;
} & Pick<ControllerProps, "control" | "defaultValue" | "name">): JSX.Element {
  return (
    <Controller
      name={props.name}
      control={props.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <pre>{JSON.stringify(field, undefined, 2)}</pre>
          <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>
          <DatePicker
            aria-invalid={fieldState.invalid}
            date={field.value}
            onDateChange={(d: Date) => field.onChange(d)}
          />
        </Field>
      )}
    />
  );
}
