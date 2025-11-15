import Typography from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
} from "@/components/ui/item";
import { Label } from "@/components/ui/label";
import { useShortcut } from "@/hooks/useShortcut";
import { useState } from "react";
import type { JSX } from "react/jsx-runtime";
import TaskDialog from "./TaskDialog";
import type { Task } from "./TaskManagement.interfaces";

const MOCK_TASKS = [
  {
    id: "1",
    title: "Design Homepage",
    description: "Create wireframes and mockups for the new homepage.",
    completed: false,
    dueDate: new Date("2024-07-10"),
    priority: "high" as const,
    createdAt: new Date("2024-06-01"),
    createdBy: "user1",
    assignedTo: ["user2", "user3"],
  },
  {
    id: "2",
    title: "Implement Authentication",
    completed: true,
    createdAt: new Date("2024-05-20"),
    createdBy: "user2",
  },
];

function TaskRow({
  task,
  onEdit,
  onDelete,
}: {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
}): JSX.Element {
  useShortcut("E", onEdit);
  useShortcut("D", onDelete);

  return (
    <Item key={task.id} variant="outline" size="sm">
      <ItemContent>
        <Checkbox id={task.id} checked={task.completed} />
        <Label htmlFor={task.id} className="font-semibold">
          {task.title}
        </Label>
        {task.description && <p className="text-sm">{task.description}</p>}
        <p className="text-xs text-gray-500">
          Due: {task.dueDate ? task.dueDate.toDateString() : "N/A"} | Priority:{" "}
          {task.priority ?? "N/A"}
        </p>
      </ItemContent>
      <ItemActions>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost" className="rotate-90 font-bold">
              ···
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={onEdit}>
              <Typography>Edit Task</Typography>
              <DropdownMenuShortcut>
                <span className="text-xs">⌘E</span>
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete}>Delete Task</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ItemActions>
    </Item>
  );
}

export default function TaskManagement(): JSX.Element {
  const [state, setState] = useState<{
    selectedTaskIds: string[];
    mode: "edit" | "delete" | undefined;
  }>({
    selectedTaskIds: [],
    mode: undefined,
  });

  return (
    <div className="flex-1 flex-col pl-2 pr-2 space-y-4">
      <ButtonGroup className="ml-auto pt-2">
        <Button size="sm" security="">
          Add Task
        </Button>
      </ButtonGroup>
      <ItemGroup className="gap-2">
        {MOCK_TASKS.map((task) => (
          <>
            <TaskRow
              key={task.id}
              task={task}
              onEdit={() =>
                setState({ selectedTaskIds: [task.id], mode: "edit" })
              }
              onDelete={() =>
                setState({ selectedTaskIds: [task.id], mode: "delete" })
              }
            />
            <TaskDialog
              task={task}
              open={state.selectedTaskIds.includes(task.id)}
              onClose={() => setState({ selectedTaskIds: [], mode: undefined })}
            />
          </>
        ))}
      </ItemGroup>
    </div>
  );
}
