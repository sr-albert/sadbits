import {} from "react-day-picker";
import { Controller, type ControllerProps } from "react-hook-form";
import type { JSX } from "react/jsx-runtime";
import { Field, FieldLabel } from "../ui/field";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectContent,
  SelectItem,
} from "../ui/select";

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
          <Select {...field}>
            <SelectTrigger asChild>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">Low</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      )}
    />
  );
}
