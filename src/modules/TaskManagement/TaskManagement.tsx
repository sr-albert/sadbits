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
import { DotSquareIcon, EllipsisVertical, MenuIcon } from "lucide-react";

const MOCK_TASKS: Task[] = [
  // Standard task with all fields
  {
    id: "1",
    title: "Design Homepage",
    description: "Create wireframes and mockups for the new homepage.",
    completed: false,
    dueDate: new Date("2024-07-10"),
    priority: "high",
    createdAt: new Date("2024-06-01"),
    createdBy: "user1",
    assignedTo: ["user2", "user3"],
  },

  // Completed task
  {
    id: "2",
    title: "Implement Authentication",
    description: "Set up JWT-based authentication system",
    completed: true,
    dueDate: new Date("2024-06-15"),
    priority: "high",
    createdAt: new Date("2024-05-20"),
    updatedAt: new Date("2024-06-14"),
    createdBy: "user2",
    assignedTo: ["user2"],
  },

  // EDGE CASE: Very long title
  {
    id: "3",
    title:
      "This is an extremely long task title that should test how the UI handles text overflow and wrapping in various components and layouts to ensure proper display",
    description: "Normal description",
    completed: false,
    priority: "medium",
    createdAt: new Date("2024-06-05"),
    createdBy: "user1",
  },

  // EDGE CASE: Very long description
  {
    id: "4",
    title: "Test Long Description",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
    completed: false,
    priority: "low",
    createdAt: new Date("2024-06-08"),
    createdBy: "user3",
  },

  // EDGE CASE: Minimal task (only required fields)
  {
    id: "5",
    title: "Minimal Task",
    completed: false,
    createdAt: new Date("2024-06-10"),
    createdBy: "user1",
  },

  // EDGE CASE: Empty description
  {
    id: "6",
    title: "Task with Empty Description",
    description: "",
    completed: false,
    createdAt: new Date("2024-06-12"),
    createdBy: "user2",
  },

  // EDGE CASE: Special characters in title
  {
    id: "7",
    title:
      "Fix bug: <script>alert('XSS')</script> & \"quotes\" & 'apostrophes'",
    description: "Testing special characters: & < > \" ' / \\ @ # $ % ^ *",
    completed: false,
    priority: "high",
    createdAt: new Date("2024-06-15"),
    createdBy: "user1",
  },

  // EDGE CASE: Unicode and emoji
  {
    id: "8",
    title: "测试中文 テスト 🚀 ✨ 🎉",
    description: "Unicode test: Привет مرحبا שלום 안녕하세요",
    completed: false,
    priority: "medium",
    createdAt: new Date("2024-06-18"),
    createdBy: "user3",
  },

  // EDGE CASE: Past due date
  {
    id: "9",
    title: "Overdue Task",
    description: "This task is way past its due date",
    completed: false,
    dueDate: new Date("2023-01-01"),
    priority: "high",
    createdAt: new Date("2022-12-15"),
    createdBy: "user1",
  },

  // EDGE CASE: Far future due date
  {
    id: "10",
    title: "Long-term Planning",
    description: "Task scheduled far in the future",
    completed: false,
    dueDate: new Date("2030-12-31"),
    priority: "low",
    createdAt: new Date("2024-06-20"),
    createdBy: "user2",
  },

  // EDGE CASE: Many assignees
  {
    id: "11",
    title: "Team Collaboration Task",
    description: "Task assigned to many team members",
    completed: false,
    priority: "medium",
    createdAt: new Date("2024-06-22"),
    createdBy: "user1",
    assignedTo: [
      "user1",
      "user2",
      "user3",
      "user4",
      "user5",
      "user6",
      "user7",
      "user8",
    ],
  },

  // EDGE CASE: Due today
  {
    id: "12",
    title: "Due Today",
    description: "Task that is due today",
    completed: false,
    dueDate: new Date(),
    priority: "high",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    createdBy: "user1",
  },

  // EDGE CASE: Just created (seconds ago)
  {
    id: "13",
    title: "Just Created",
    description: "Task created moments ago",
    completed: false,
    createdAt: new Date(),
    createdBy: "user2",
  },

  // EDGE CASE: Low priority completed task
  {
    id: "14",
    title: "Low Priority Completed",
    description: "Testing completed low priority task",
    completed: true,
    priority: "low",
    createdAt: new Date("2024-05-01"),
    updatedAt: new Date("2024-05-10"),
    createdBy: "user3",
  },

  // EDGE CASE: Newlines in description
  {
    id: "15",
    title: "Multi-line Description Test",
    description: "First line\nSecond line\nThird line\n\nWith blank line",
    completed: false,
    priority: "medium",
    createdAt: new Date("2024-06-25"),
    createdBy: "user1",
  },

  // EDGE CASE: Single character title
  {
    id: "16",
    title: "A",
    description: "Minimum length title test",
    completed: false,
    createdAt: new Date("2024-06-26"),
    createdBy: "user2",
  },

  // EDGE CASE: Numbers only title
  {
    id: "17",
    title: "123456789",
    description: "Numeric title test",
    completed: false,
    createdAt: new Date("2024-06-27"),
    createdBy: "user1",
  },

  // EDGE CASE: All priorities represented
  {
    id: "18",
    title: "High Priority Incomplete",
    completed: false,
    priority: "high",
    createdAt: new Date("2024-06-28"),
    createdBy: "user3",
  },

  // EDGE CASE: Task with updatedAt but no dueDate
  {
    id: "19",
    title: "Updated Task No Due Date",
    description: "This task was updated recently but has no due date",
    completed: false,
    priority: "medium",
    createdAt: new Date("2024-05-15"),
    updatedAt: new Date("2024-06-29"),
    createdBy: "user2",
  },

  // EDGE CASE: Whitespace in title
  {
    id: "20",
    title: "  Task With   Extra    Spaces  ",
    description: "Testing whitespace handling",
    completed: false,
    createdAt: new Date("2024-06-30"),
    createdBy: "user1",
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
  selected?: boolean;
}): JSX.Element {
  // if (selected) {
  //   useShortcut("E", onEdit);
  //   useShortcut("D", onDelete);
  // }
  return (
    <Item
      key={task.id}
      variant="outline"
      size="sm"
      className="flex justify-center items-start"
    >
      <ItemActions>
        <Checkbox id={task.id} checked={task.completed} />
      </ItemActions>
      <ItemContent>
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
            <EllipsisVertical className="h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={onEdit}>
              <Typography>Edit Task</Typography>
              <DropdownMenuShortcut>
                <span className="text-xs">⌘E</span>
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete}>
              <Typography>Delete Task</Typography>
              <DropdownMenuShortcut>
                <span className="text-xs">⌘D</span>
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ItemActions>
    </Item>
  );
}

export default function TaskManagement(): JSX.Element {
  const [state, setState] = useState<{
    selectedTaskIds: string[];
    mode: "edit" | "delete" | "create" | "normal";
  }>({
    selectedTaskIds: [],
    mode: "normal",
  });

  return (
    <div className="flex-1 flex-col pl-2 pr-2 space-y-4">
      <ButtonGroup className="ml-auto pt-2">
        <Button
          size="sm"
          onClick={() => setState({ selectedTaskIds: [], mode: "create" })}
        >
          <Typography>Add Task</Typography>
        </Button>
      </ButtonGroup>
      <ItemGroup className="gap-2">
        {MOCK_TASKS.map((task) => (
          <div key={task.id}>
            <TaskRow
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
              open={
                state.selectedTaskIds.includes(task.id) && state.mode === "edit"
              }
              onClose={() => setState({ selectedTaskIds: [], mode: "normal" })}
            />
          </div>
        ))}
      </ItemGroup>
      <TaskDialog
        open={state.mode === "create"}
        onClose={() => setState({ selectedTaskIds: [], mode: "normal" })}
      />
    </div>
  );
}
