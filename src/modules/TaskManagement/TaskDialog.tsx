import InputWithLabel from "@/components/InputWithLabel/InputWithLabel";
import Typography from "@/components/Typography";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { JSX } from "react/jsx-runtime";
import { z } from "zod";
import type { Task } from "./TaskManagement.interfaces";
import { DropdownMenuShortcut } from "@/components/ui/dropdown-menu";

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
  task,
  open,
  onClose,
}: {
  task: Task;
  open: boolean;
  onClose?: () => void;
}): JSX.Element {
  const form = useForm<z.input<typeof schema>>({
    resolver,
    defaultValues: { ...task },
  });
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open && onClose) {
          onClose();
        }
      }}
    >
      <form id="task-edit-form">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <Typography level="h2">{task.title}</Typography>
            </DialogTitle>
          </DialogHeader>
          <div className="flex-col gap-1">
            <pre>{JSON.stringify(form.getValues(), undefined, 2)}</pre>
            {/* <InputWithLabel
              label="Title"
              name="title"
              control={form.control}
              inputProps={{}}
            />
            <InputWithLabel
              label="Description"
              name="description"
              control={form.control}
              inputProps={{}}
            /> */}
          </div>
        </DialogContent>
      </form>
    </Dialog>
  );
}
