import DatePickerWithLabel from "@/components/FormFields/DatePickerWithLabel";
import InputWithLabel from "@/components/FormFields/InputWithLabel";
import TextareaWithLabel from "@/components/FormFields/TextareaWithLabel";
import Typography from "@/components/Typography";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, useForm } from "react-hook-form";
import type { JSX } from "react/jsx-runtime";
import { z } from "zod";
import type { Task } from "./TaskManagement.interfaces";

const schema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  completed: z.boolean().optional(),
  dueDate: z.date().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  createdBy: z.string().optional(),
  assignedTo: z.array(z.string()).optional(),
});

const resolver = zodResolver(schema);

export default function TaskDialog({
  task = undefined,
  open,
  onClose,
}: {
  task?: Task;
  open: boolean;
  onClose?: () => void;
}): JSX.Element | null {
  const form = useForm<z.input<typeof schema>>({
    resolver,
    defaultValues: task ? { ...task } : undefined,
    shouldFocusError: true,
  });

  const {
    handleSubmit,
    control,
    formState: { isDirty, isSubmitting },
    getValues,
  } = form;

  const formValue = getValues();

  const onSubmit = handleSubmit((data) => {
    // handle submit
    console.log(data);
  });

  const handleClose = () => {
    if (isDirty && !window.confirm("Discard changes?")) {
      window.confirm("Discard changes?") && onClose?.();
    }
    onClose?.();
  };

  if (!open) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open && onClose) {
          handleClose();
        }
      }}
    >
      <Form {...form}>
        <form id="task-edit-form" onSubmit={onSubmit}>
          <DialogContent aria-describedby="task-edit-form">
            <pre>{JSON.stringify(formValue, undefined, 2)}</pre>
            <DialogHeader>
              <DialogTitle>{task ? "Edit" : "Create new task"}</DialogTitle>
            </DialogHeader>
            <div className="flex-col gap-4 flex">
              <InputWithLabel label="Title" name="title" control={control} />
              <DatePickerWithLabel
                label="Due date"
                name="dueDate"
                control={control}
              />

              <TextareaWithLabel
                label="Description"
                name="description"
                control={control}
              />
            </div>

            <div className="flex gap-2 align-end">
              <Button
                variant="secondary"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Discard
              </Button>
              <Button type="submit" loading={isSubmitting}>
                {task ? (
                  <Typography>Submit</Typography>
                ) : (
                  <Typography>Create new</Typography>
                )}
              </Button>
            </div>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
}
