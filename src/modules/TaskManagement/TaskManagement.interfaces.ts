type PriorityType = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date;
  priority?: PriorityType;
  createdAt: Date;
  updatedAt?: Date;
  createdBy: string;
  assignedTo?: string[];
}
