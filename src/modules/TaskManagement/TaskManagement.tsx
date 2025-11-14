import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { ItemGroup } from "@/components/ui/item";
import type { JSX } from "react/jsx-runtime";

export default function TaskManagement(): JSX.Element {
  return (
    <div className="flex-1 flex">
      {/* Header */}
      <ButtonGroup className="ml-auto p-2">
        <Button size="sm" security="">
          Add Task
        </Button>
      </ButtonGroup>
      <ItemGroup></ItemGroup>
    </div>
  );
}
